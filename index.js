/**
 * 宝宝记录 · Host 端
 *
 * 负责把记录持久化为 DSH 主机上的一份 JSON 文件，并通过 Connection 的
 * `/api` 精确 Fetch 路由提供给浏览器端（Client 半）读写。浏览器地址或端口
 * 变化、清空站点存储都不会影响这份数据。
 */

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'

/** Host 服务依赖：Connection 提供浏览器鉴权与 `/api` Fetch 路由桥。 */
export const inject = ['connection']

const ROUTE = '/api/baby-diary'
const MAX_ENTRIES = 20000
const MAX_NAME = 40
const MAX_NOTE = 200
const MAX_DOSE = 40
const KINDS = new Set(['feed', 'weight', 'diaper', 'supplement'])
const SUPPLEMENTS = new Set(['d3', 'probiotic'])

/** 数据文件位置：$DSH_HOME/baby-diary/data.json，默认 ~/.dsh。 */
function dataFilePath() {
  const home = process.env.DSH_HOME && process.env.DSH_HOME.trim() !== ''
    ? process.env.DSH_HOME
    : join(homedir(), '.dsh')
  return join(home, 'baby-diary', 'data.json')
}

function emptyState() {
  return {
    version: 1,
    baby: { name: '', birthDate: null },
    entries: [],
    updatedAt: null,
  }
}

function asObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function cleanText(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : ''
}

/** 缺失值按 0 处理；越界或非数字返回 null，让调用方拒绝整条记录。 */
function boundedOrZero(value, max) {
  if (value === undefined || value === null || value === '') return 0
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0 || number > max) return null
  return Math.round(number)
}

/** 必填的整数范围；越界或非数字返回 null。 */
function bounded(value, min, max) {
  const number = Number(value)
  if (!Number.isFinite(number) || number < min || number > max) return null
  return Math.round(number)
}

function isoOrNull(value) {
  if (typeof value !== 'string') return null
  const time = Date.parse(value)
  if (!Number.isFinite(time)) return null
  const date = new Date(time)
  const year = date.getUTCFullYear()
  if (year < 2000 || year > 2100) return null
  return date.toISOString()
}

function dateOnlyOrNull(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const time = Date.parse(`${value}T00:00:00Z`)
  if (!Number.isFinite(time)) return null
  const year = Number(value.slice(0, 4))
  return year >= 2000 && year <= 2100 ? value : null
}

/** 把未知输入规整成一条合法记录，无法识别时返回 null。 */
function normalizeEntry(raw) {
  const value = asObject(raw)
  const kind = value.kind
  if (!KINDS.has(kind)) return null
  const at = isoOrNull(value.at)
  if (at === null) return null
  const id = typeof value.id === 'string' && value.id !== '' && value.id.length <= 80 ? value.id : randomUUID()
  const createdAt = isoOrNull(value.createdAt) ?? at
  const note = cleanText(value.note, MAX_NOTE)
  const base = { id, kind, at, createdAt }
  if (note !== '') base.note = note

  if (kind === 'feed') {
    const breastMl = boundedOrZero(value.breastMl, 2000)
    const formulaMl = boundedOrZero(value.formulaMl, 2000)
    if (breastMl === null || formulaMl === null || breastMl + formulaMl === 0) return null
    return { ...base, breastMl, formulaMl }
  }
  if (kind === 'weight') {
    const grams = bounded(value.grams, 300, 40000)
    if (grams === null) return null
    return { ...base, grams }
  }
  if (kind === 'diaper') {
    const pee = boundedOrZero(value.pee, 20)
    const poop = boundedOrZero(value.poop, 20)
    if (pee === null || poop === null || pee + poop === 0) return null
    return { ...base, pee, poop }
  }
  const item = SUPPLEMENTS.has(value.item) ? value.item : null
  if (item === null) return null
  const dose = cleanText(value.dose, MAX_DOSE)
  return dose === '' ? { ...base, item } : { ...base, item, dose }
}

function normalizeState(raw) {
  const state = emptyState()
  const value = asObject(raw)
  const baby = asObject(value.baby)
  state.baby.name = cleanText(baby.name, MAX_NAME)
  state.baby.birthDate = dateOnlyOrNull(baby.birthDate)
  const entries = Array.isArray(value.entries) ? value.entries : []
  const seen = new Set()
  for (const entry of entries.slice(0, MAX_ENTRIES)) {
    const normalized = normalizeEntry(entry)
    if (normalized === null || seen.has(normalized.id)) continue
    seen.add(normalized.id)
    state.entries.push(normalized)
  }
  state.entries.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
  state.updatedAt = isoOrNull(value.updatedAt)
  return state
}

async function readState(file) {
  let text
  try {
    text = await readFile(file, 'utf8')
  } catch (error) {
    if (error?.code === 'ENOENT') return emptyState()
    throw error
  }
  try {
    return normalizeState(JSON.parse(text))
  } catch {
    // 保留损坏的文件，绝不静默覆盖：改名为 .corrupt-<时间戳> 后从空状态继续。
    try {
      await rename(file, `${file}.corrupt-${Date.now()}`)
    } catch {
      // 改名失败时也继续；下一次写入会创建新文件。
    }
    return emptyState()
  }
}

async function writeState(file, state) {
  await mkdir(dirname(file), { recursive: true })
  const temporary = `${file}.tmp-${process.pid}-${Date.now()}`
  await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
  await rename(temporary, file)
}

function publicState(state, file) {
  return {
    version: state.version,
    baby: state.baby,
    entries: state.entries,
    updatedAt: state.updatedAt,
    dataFile: file,
  }
}

function invalid(message) {
  const error = new Error(message)
  error.code = 'baby/invalid'
  return error
}

/**
 * 注册数据通道：读状态、保存宝宝资料、新增/修改/删除记录、整体导入。
 * @param ctx - 插件上下文，提供 Connection 的 RPC 通道。
 */
export function apply(ctx) {
  const file = dataFilePath()

  // 读-改-写全程串行，避免两个请求交错覆盖同一个文件。
  let tail = Promise.resolve()
  const serial = (operation) => {
    const run = tail.then(operation, operation)
    tail = run.then(() => undefined, () => undefined)
    return run
  }

  const dispatch = async (endpoint, payload) => {
    if (endpoint === 'state/read') {
      const state = await readState(file)
      return publicState(state, file)
    }

    if (endpoint === 'baby/save') {
      const body = asObject(payload)
      const state = await readState(file)
      state.baby.name = cleanText(body.name, MAX_NAME)
      state.baby.birthDate = dateOnlyOrNull(body.birthDate)
      state.updatedAt = new Date().toISOString()
      await writeState(file, state)
      return publicState(state, file)
    }

    if (endpoint === 'entry/save') {
      const body = asObject(payload)
      const normalized = normalizeEntry(body.entry)
      if (normalized === null) throw invalid('记录内容不完整或格式不正确')
      const state = await readState(file)
      const id = typeof body.id === 'string' && body.id !== '' ? body.id : null
      if (id !== null) {
        const index = state.entries.findIndex(entry => entry.id === id)
        if (index < 0) throw invalid('找不到要修改的记录')
        if (state.entries[index].kind !== normalized.kind) throw invalid('不能修改记录类型')
        normalized.id = id
        normalized.createdAt = state.entries[index].createdAt
        state.entries[index] = normalized
      } else {
        if (state.entries.length >= MAX_ENTRIES) throw invalid('记录数量已达上限')
        state.entries.push(normalized)
      }
      state.entries.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
      state.updatedAt = new Date().toISOString()
      await writeState(file, state)
      return publicState(state, file)
    }

    if (endpoint === 'entry/delete') {
      const body = asObject(payload)
      const id = typeof body.id === 'string' ? body.id : ''
      if (id === '') throw invalid('缺少记录 id')
      const state = await readState(file)
      const before = state.entries.length
      state.entries = state.entries.filter(entry => entry.id !== id)
      if (state.entries.length === before) throw invalid('找不到要删除的记录')
      state.updatedAt = new Date().toISOString()
      await writeState(file, state)
      return publicState(state, file)
    }

    if (endpoint === 'data/replace') {
      const body = asObject(payload)
      const raw = asObject(body.data)
      const entries = Array.isArray(raw.entries) ? raw.entries : null
      if (entries === null) throw invalid('导入内容缺少 entries 数组')
      if (entries.length > MAX_ENTRIES) throw invalid('导入的记录数量过多')
      const state = normalizeState({ baby: raw.baby, entries })
      if (entries.length > 0 && state.entries.length === 0) throw invalid('没有可导入的有效记录')
      state.updatedAt = new Date().toISOString()
      await writeState(file, state)
      return publicState(state, file)
    }

    throw invalid(`未知操作：${endpoint}`)
  }

  const answer = (body) => new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })

  // Connection 的精确 Fetch 路由：`/api` 前缀由 Connection 自己挂载并完成
  // 浏览器鉴权，这里只登记具体路径，因此不需要直接依赖 webServer 服务。
  ctx.connection.fetch.register({
    path: ROUTE,
    methods: ['POST'],
    requestBody: 'buffered',
    async fetch(request) {
      let body
      try {
        body = await request.json()
      } catch {
        return answer({ ok: false, error: { code: 'baby/invalid', message: '请求内容不是合法 JSON', details: {} } })
      }
      const endpoint = body !== null && typeof body === 'object' && typeof body.endpoint === 'string' ? body.endpoint : ''
      const payload = body !== null && typeof body === 'object' ? (body.payload ?? null) : null
      try {
        const value = await serial(() => dispatch(endpoint, payload))
        return answer({ ok: true, value })
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.error(`[baby-diary] ${endpoint} failed: ${message}`)
        return answer({
          ok: false,
          error: {
            code: typeof error?.code === 'string' ? error.code : 'baby/internal',
            message,
            details: {},
          },
        })
      }
    },
  })
}
