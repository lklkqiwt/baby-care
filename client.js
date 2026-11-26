/**
 * 宝宝记录 · Client 端
 *
 * 侧栏底部入口 + 整帧浮层面板：快捷记录、按时段汇总、趋势图表、历史与设置。
 * 数据通过 Connection 的通用 RPC 通道读写，真正的存储由 Host 半负责。
 */

window.__ModuleLoader__.load({
  id: '@local/baby-diary',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const ROUTE = 'api/baby-diary'
    const NS = 'babyTracker'
    const START = { data: null, phase: 'idle', error: null, open: false, tab: 'today', editing: null, saving: false, notice: null, loadedAt: 0, tick: 0, dirty: false }

    // ───────────────────────────── 文案 ─────────────────────────────

    const DICT = {
      zh: {
        title: '宝宝记录',
        defaultBaby: '宝宝',
        ageDays: '出生 {n} 天',
        tabsToday: '今日',
        tabsTrends: '趋势',
        tabsHistory: '记录',
        tabsSettings: '设置',
        close: '关闭',
        refresh: '刷新',
        loading: '正在读取记录…',
        loadFailed: '读取失败',
        renderError: '这块内容渲染出错',
        authFailed: '登录状态已失效，请刷新页面后重试',
        networkFailed: '无法连接 DSH 主机，请稍后重试',
        retry: '重试',
        save: '保存',
        saving: '保存中…',
        deleting: '删除中…',
        cancel: '取消',
        delete: '删除',
        edit: '修改',
        confirm: '确认',
        confirmDelete: '确认删除？',
        added: '已记录',
        updated: '已更新',
        deleted: '已删除',
        invalidTime: '请选择有效的时间',
        needFeed: '母乳、奶粉或亲喂时长至少填一项',
        nurseMin: '亲喂时长（分钟）',
        nurseShort: '亲喂',
        nurseHint: '亲喂时只填时长即可，母乳/奶粉的 ml 可以留空',
        side: '侧别',
        sideLeft: '左',
        sideRight: '右',
        sideBoth: '双',
        minutes: '分钟',
        needWeight: '请输入体重',
        needDiaper: '小便或大便次数至少填一项',
        feed: '喂奶',
        weight: '体重',
        height: '身高',
        heightCm: '身高（cm）',
        latestHeight: '最近身高',
        heightTrend: '身高曲线',
        heightHint: '每次测量都会连成一条生长曲线',
        needHeight: '请输入身高',
        heightDelta: '较上次 {delta}',
        diaper: '尿布',
        supplement: '补充',
        d3: '维生素D3',
        probiotic: '益生菌',
        time: '时间',
        now: '现在',
        breastMilk: '母乳',
        formula: '奶粉',
        ml: 'ml',
        weightKg: '体重（kg）',
        pee: '小便',
        poop: '大便',
        times: '次',
        supplementType: '补充剂',
        dose: '剂量（选填）',
        note: '备注（选填）',
        addRecord: '添加记录',
        saveEdit: '保存修改',
        editing: '正在修改一条记录',
        stopEditing: '取消修改',
        todayMilk: '今日奶量',
        todayFeeds: '今日喂养',
        todayDiaper: '今日尿布',
        latestWeight: '最近体重',
        weightRecords: '共 {n} 次',
        breastShort: '母乳',
        formulaShort: '奶粉',
        timesUnit: '次',
        noDataShort: '—',
        lastFeedLabel: '上次喂奶',
        lastDoseLabel: '上次',
        lastFeedShort: '上次 {time}',
        intervalLabel: '间隔',
        intervalMinutes: '{n} 分钟',
        intervalHours: '{n} 小时',
        intervalHoursMinutes: '{hours} 小时 {minutes} 分',
        intervalDays: '{n} 天',
        intervalDaysHours: '{days} 天 {hours} 小时',
        notYet: '还没有记录',
        weightDelta: '较上次 {delta}',
        recordedAt: '记录于 {date}',
        byPeriod: '按时段',
        todayFeedTotal: '共 {total} ml',
        todayRecords: '今日记录',
        todayFeedAmount: '今日每次奶量',
        todayFeedHint: '按时间顺序看今天每一顿的奶量（不含亲喂）',
        noRecordsToday: '今天还没有记录',
        noRecordsHint: '用左侧表单记下第一次喂奶，趋势会在这里慢慢长出来。',
        noData: '暂无数据',
        trendsRange: '范围',
        range7: '近 7 天',
        range30: '近 30 天',
        weightTrend: '体重曲线',
        milkTrend: '每日奶量',
        diaperTrend: '每日尿布',
        periodTrend: '喂养时段分布',
        supplementTrend: '补充剂打卡',
        weightHint: '同一天多次称重取平均值，再连成成长曲线',
        weightDays: '共 {n} 天',
        weightDailyAverage: '当日 {n} 次平均',
        milkHint: '母乳 + 奶粉按天叠加；亲喂按分钟单独记录，不计入 ml',
        feedAmountTrend: '每次奶量',
        feedAmountHint: '当天每次喂养的奶量折线（不含亲喂）；青绿虚线为当天平均，可切换日期',
        previousDay: '前一天',
        nextDay: '后一天',
        feedCount: '共 {n} 次',
        feedSum: '合计 {sum} ml',
        feedAverage: '平均 {avg} ml',
        noFeedAmount: '这一天没有记录奶量',
        todayLabel: '今日',
        milkAverageLabel: '日均',
        milkAverageHint: '按有记录的天数计算',
        diaperHint: '小便 + 大便，按天堆叠',
        periodHint: '近 {n} 天各时段的奶量合计',
        supplementHint: '维生素D3 每天 1 次，益生菌每天 2 次',
        weightEmpty: '记录两次体重后就能看到曲线',
        historyTitle: '最近 30 天',
        historyEmpty: '还没有任何记录',
        historyMeta: '{milk} · 小便 {pee} · 大便 {poop}',
        dayToday: '今天',
        dayYesterday: '昨天',
        settingsProfile: '宝宝资料',
        babyName: '昵称',
        birthDate: '出生日期',
        saveProfile: '保存资料',
        profileSaved: '资料已保存',
        settingsData: '数据',
        dataFile: '数据文件',
        dataHint: '记录保存在这台电脑的 DSH 主机上，刷新页面、换浏览器地址或清空站点数据都不会丢失。',
        exportExcel: '导出 Excel',
        excelHint: 'Excel 含每日汇总和各类明细，便于查看和统计；JSON 用于完整备份与恢复。',
        exportJson: '导出 JSON',
        importJson: '导入 JSON',
        importConfirm: '导入会覆盖现有全部记录，确定继续？',
        importDone: '已导入 {n} 条记录',
        importPartial: '已导入 {imported} 条，忽略 {skipped} 条无效或重复记录',
        importFailed: '文件格式不正确',
        settingsAbout: '关于',
        aboutText: '宝宝记录 · 体重、喂奶（母乳/奶粉）、大小便、维生素D3 与益生菌，按时段统计并生成趋势图。',
        justNow: '刚刚',
        notRecorded: '未记录',
      },
      en: {
        title: 'Baby log',
        defaultBaby: 'Baby',
        ageDays: '{n} days old',
        tabsToday: 'Today',
        tabsTrends: 'Trends',
        tabsHistory: 'History',
        tabsSettings: 'Settings',
        close: 'Close',
        refresh: 'Refresh',
        loading: 'Loading records…',
        loadFailed: 'Could not load',
        renderError: 'This section failed to render',
        authFailed: 'Your session expired; refresh the page and try again',
        networkFailed: 'Could not reach the DSH host; try again in a moment',
        retry: 'Retry',
        save: 'Save',
        saving: 'Saving…',
        deleting: 'Deleting…',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        confirm: 'Confirm',
        confirmDelete: 'Delete this record?',
        added: 'Recorded',
        updated: 'Updated',
        deleted: 'Deleted',
        invalidTime: 'Choose a valid time',
        needFeed: 'Enter milk, formula, or nursing minutes',
        nurseMin: 'Nursing (minutes)',
        nurseShort: 'Nursing',
        nurseHint: 'For direct nursing, just enter minutes; ml can stay empty',
        side: 'Side',
        sideLeft: 'Left',
        sideRight: 'Right',
        sideBoth: 'Both',
        minutes: 'min',
        needWeight: 'Enter a weight',
        needDiaper: 'Enter pee or poop',
        feed: 'Feeding',
        weight: 'Weight',
        height: 'Height',
        heightCm: 'Height (cm)',
        latestHeight: 'Latest height',
        heightTrend: 'Height curve',
        heightHint: 'Every measurement joins the growth curve',
        needHeight: 'Enter a height',
        heightDelta: '{delta} since last',
        diaper: 'Diaper',
        supplement: 'Supp.',
        d3: 'Vitamin D3',
        probiotic: 'Probiotic',
        time: 'Time',
        now: 'Now',
        breastMilk: 'Breast milk',
        formula: 'Formula',
        ml: 'ml',
        weightKg: 'Weight (kg)',
        pee: 'Pee',
        poop: 'Poop',
        times: 'times',
        supplementType: 'Supplement',
        dose: 'Dose (optional)',
        note: 'Note (optional)',
        addRecord: 'Add record',
        saveEdit: 'Save changes',
        editing: 'Editing a record',
        stopEditing: 'Cancel edit',
        todayMilk: 'Milk today',
        todayFeeds: 'Feedings today',
        todayDiaper: 'Diapers today',
        latestWeight: 'Latest weight',
        weightRecords: '{n} records',
        breastShort: 'Breast',
        formulaShort: 'Formula',
        timesUnit: 'times',
        noDataShort: '—',
        lastFeedLabel: 'Last feeding',
        lastDoseLabel: 'Last',
        lastFeedShort: 'Last {time}',
        intervalLabel: 'Interval',
        intervalMinutes: '{n} min',
        intervalHours: '{n} h',
        intervalHoursMinutes: '{hours} h {minutes} min',
        intervalDays: '{n} d',
        intervalDaysHours: '{days} d {hours} h',
        notYet: 'No record yet',
        weightDelta: '{delta} since last',
        recordedAt: 'Recorded {date}',
        byPeriod: 'By time of day',
        todayFeedTotal: '{total} ml total',
        todayRecords: 'Today',
        todayFeedAmount: 'Today’s feeds',
        todayFeedHint: 'Milk volume of each feeding today in time order (nursing excluded)',
        noRecordsToday: 'No records today',
        noRecordsHint: 'Log the first feeding on the left; trends grow from here.',
        noData: 'No data',
        trendsRange: 'Range',
        range7: 'Last 7 days',
        range30: 'Last 30 days',
        weightTrend: 'Weight curve',
        milkTrend: 'Daily milk',
        diaperTrend: 'Daily diapers',
        periodTrend: 'Feeding by time of day',
        supplementTrend: 'Supplement check-ins',
        weightHint: 'Multiple weigh-ins on one day are averaged into the curve',
        weightDays: '{n} days',
        weightDailyAverage: 'avg of {n} that day',
        milkHint: 'Breast milk + formula stacked per day; nursing minutes are tracked separately',
        feedAmountTrend: 'Per-feed amount',
        feedAmountHint: 'Milk volume of each feeding that day (nursing excluded); the teal dashed line is the daily average',
        previousDay: 'Previous day',
        nextDay: 'Next day',
        feedCount: '{n} feeds',
        feedSum: '{sum} ml total',
        feedAverage: '{avg} ml avg',
        noFeedAmount: 'No milk volume recorded this day',
        todayLabel: 'Today',
        milkAverageLabel: 'Daily avg',
        milkAverageHint: 'Averaged over days with records',
        diaperHint: 'Pee + poop, stacked per day',
        periodHint: 'Milk total per time bucket over {n} days',
        supplementHint: 'Vitamin D3 once daily; probiotic twice daily',
        weightEmpty: 'Two weigh-ins reveal the curve',
        historyTitle: 'Last 30 days',
        historyEmpty: 'No records yet',
        historyMeta: '{milk} · pee {pee} · poop {poop}',
        dayToday: 'Today',
        dayYesterday: 'Yesterday',
        settingsProfile: 'Baby profile',
        babyName: 'Name',
        birthDate: 'Birth date',
        saveProfile: 'Save profile',
        profileSaved: 'Profile saved',
        settingsData: 'Data',
        dataFile: 'Data file',
        dataHint: 'Records live on this computer’s DSH host; reloading the page or changing the browser address will not lose them.',
        exportExcel: 'Export Excel',
        excelHint: 'Excel contains a daily summary and detail sheets for review; JSON is the full backup for restore.',
        exportJson: 'Export JSON',
        importJson: 'Import JSON',
        importConfirm: 'Importing replaces every existing record. Continue?',
        importDone: 'Imported {n} records',
        importPartial: 'Imported {imported}; ignored {skipped} invalid or duplicate records',
        importFailed: 'That file is not a valid export',
        settingsAbout: 'About',
        aboutText: 'Baby log: weight, feeding (breast/formula), diapers, vitamin D3 and probiotic times, with by-time-of-day totals and trend charts.',
        justNow: 'just now',
        notRecorded: 'not recorded',
      },
    }

    // ───────────────────────────── 纯函数 ─────────────────────────────

    const pad2 = value => (value < 10 ? '0' : '') + value
    const PERIOD_LABELS = ['00–03', '03–06', '06–09', '09–12', '12–15', '15–18', '18–21', '21–24']
    // 每日目标次数：益生菌一天两次，维生素 D3 一次。
    const SUPPLEMENT_DAILY = { d3: 1, probiotic: 2 }
    // 图表双系列：主题的 brand-primary 是中性近黑/近白，不能用来区分两个系列。
    // 图表双系列用实色，避免 color-mix 在 SVG fill 里解析失败回退成黑色。
    // 主系列：紫；次系列：深青绿（冷色，和紫形成冷暖对比，白字清楚）。
    const SERIES_PRIMARY = '#8f62f4'
    const SERIES_SECONDARY = '#0f766e'
    // 柱内数字统一白字；紫色柱用浅描边，琥珀柱用更深的描边保证对比。
    const SERIES_TEXT_PRIMARY = {
      fill: 'var(--dsw-static-neutral-bluish-00, #ffffff)',
      stroke: 'rgba(15, 17, 21, 0.45)',
      strokeWidth: 0.6,
      paintOrder: 'stroke',
      fontSize: '8.5px',
      fontWeight: 600,
    }
    const SERIES_TEXT_SECONDARY = {
      fill: 'var(--dsw-static-neutral-bluish-00, #ffffff)',
      stroke: 'rgba(15, 17, 21, 0.62)',
      strokeWidth: 0.9,
      paintOrder: 'stroke',
      fontSize: '8.5px',
      fontWeight: 600,
    }
    const ICON_STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

    function dateKeyOf(value) {
      const date = value instanceof Date ? value : new Date(value)
      return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate())
    }

    function toInputValue(date) {
      return dateKeyOf(date) + 'T' + pad2(date.getHours()) + ':' + pad2(date.getMinutes())
    }

    function parseInputValue(value) {
      const date = new Date(value)
      return Number.isNaN(date.getTime()) ? null : date
    }

    function timeOf(iso) {
      const date = new Date(iso)
      return pad2(date.getHours()) + ':' + pad2(date.getMinutes())
    }

    function minutesSince(iso) {
      return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
    }

    /** 上次喂奶的量：单一时显示「奶粉 90 ml」，混合时显示「母乳 60 + 奶粉 90 (150 ml)」。 */
    function sideText(side, t) {
      if (side === 'left') return t('sideLeft')
      if (side === 'right') return t('sideRight')
      if (side === 'both') return t('sideBoth')
      return ''
    }

    function feedAmountText(entry, t) {
      const pieces = []
      if (entry.breastMl > 0) pieces.push(t('breastMilk') + ' ' + entry.breastMl)
      if (entry.formulaMl > 0) pieces.push(t('formula') + ' ' + entry.formulaMl)
      const bottle = pieces.length > 0
        ? (pieces.length > 1 ? pieces.join(' + ') + ' (' + (entry.breastMl + entry.formulaMl) + ' ml)' : pieces[0] + ' ml')
        : ''
      if (!(entry.nurseMin > 0)) return bottle
      const side = sideText(entry.side, t)
      const nurse = t('nurseShort') + ' ' + entry.nurseMin + ' ' + t('minutes') + (side ? '（' + side + '）' : '')
      return bottle ? bottle + ' + ' + nurse : nurse
    }

    /** 上次喂奶的显示时间：今天只显示时:分，昨天带“昨天”，更早带月/日。 */
    function lastTimeWhen(iso, t) {
      const key = dateKeyOf(iso)
      const today = dateKeyOf(new Date())
      if (key === today) return timeOf(iso)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (key === dateKeyOf(yesterday)) return t('dayYesterday') + ' ' + timeOf(iso)
      const date = new Date(iso)
      return (date.getMonth() + 1) + '/' + date.getDate() + ' ' + timeOf(iso)
    }

    /** 距上次喂奶的间隔（分钟数 → 中文/英文可读文本）。 */
    function intervalText(minutes, t) {
      if (minutes < 1) return t('justNow')
      if (minutes < 60) return t('intervalMinutes', { n: minutes })
      const hours = Math.floor(minutes / 60)
      const rest = minutes % 60
      if (hours < 24) {
        return rest > 0
          ? t('intervalHoursMinutes', { hours, minutes: rest })
          : t('intervalHours', { n: hours })
      }
      const days = Math.floor(hours / 24)
      const remain = hours % 24
      return remain > 0
        ? t('intervalDaysHours', { days, hours: remain })
        : t('intervalDays', { n: days })
    }

    function formatKg(grams) {
      return (grams / 1000).toFixed(2)
    }

    function formatCm(mm) {
      return (mm / 10).toFixed(1)
    }

    function formatCmDelta(mm) {
      return (mm > 0 ? '+' : '') + (mm / 10).toFixed(1) + ' cm'
    }

    function formatDelta(grams) {
      return (grams > 0 ? '+' : '') + grams + ' g'
    }

    function numberOrZero(value) {
      const number = Number(value)
      return Number.isFinite(number) && number > 0 ? Math.round(number) : 0
    }

    function ageInDays(birthDate) {
      if (!birthDate) return null
      const birth = new Date(birthDate + 'T00:00:00')
      if (Number.isNaN(birth.getTime())) return null
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return Math.floor((today.getTime() - birth.getTime()) / 86400000)
    }

    function dayHeading(key, t, lang) {
      const language = typeof lang === 'string' && lang !== '' ? lang : 'zh'
      const today = dateKeyOf(new Date())
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (key === today) return t('dayToday')
      if (key === dateKeyOf(yesterday)) return t('dayYesterday')
      const [year, month, day] = key.split('-').map(Number)
      if (language.indexOf('zh') === 0) {
        const date = new Date(year, month - 1, day)
        const week = '日一二三四五六'[date.getDay()]
        return month + '月' + day + '日 周' + week
      }
      const date = new Date(year, month - 1, day)
      try {
        return new Intl.DateTimeFormat(language, { month: 'short', day: 'numeric', weekday: 'short' }).format(date)
      } catch {
        return month + '/' + day
      }
    }

    function dayShortLabel(date, lang) {
      const month = date.getMonth() + 1
      const day = date.getDate()
      return lang.indexOf('zh') === 0 ? month + '/' + day : month + '/' + day
    }

    function buildDays(entries, count) {
      const days = []
      const index = new Map()
      for (let offset = count - 1; offset >= 0; offset -= 1) {
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        date.setDate(date.getDate() - offset)
        const row = { key: dateKeyOf(date), date, breast: 0, formula: 0, nurseMin: 0, feeds: 0, pee: 0, poop: 0 }
        days.push(row)
        index.set(row.key, row)
      }
      for (const entry of entries) {
        const row = index.get(dateKeyOf(entry.at))
        if (!row) continue
        if (entry.kind === 'feed') {
          row.breast += entry.breastMl
          row.formula += entry.formulaMl
          row.nurseMin += entry.nurseMin || 0
          row.feeds += 1
        } else if (entry.kind === 'diaper') {
          row.pee += entry.pee
          row.poop += entry.poop
        }
      }
      return days
    }

    function feedTotals(entries) {
      let breast = 0
      let formula = 0
      let nurseMin = 0
      let nurseCount = 0
      let count = 0
      for (const entry of entries) {
        if (entry.kind !== 'feed') continue
        breast += entry.breastMl
        formula += entry.formulaMl
        if (entry.nurseMin > 0) {
          nurseMin += entry.nurseMin
          nurseCount += 1
        }
        count += 1
      }
      return { breast, formula, total: breast + formula, count, nurseMin, nurseCount }
    }

    /** 体重按本地日聚合：同一天多次称重取平均值；x 轴用当天中午，一天一个点。 */
    function dailyWeightPoints(entries) {
      const byDay = new Map()
      for (const entry of entries) {
        if (entry.kind !== 'weight') continue
        const key = dateKeyOf(entry.at)
        if (!byDay.has(key)) byDay.set(key, [])
        byDay.get(key).push(entry)
      }
      const points = []
      for (const [key, list] of byDay) {
        const [year, month, day] = key.split('-').map(Number)
        const at = new Date(year, month - 1, day, 12).toISOString()
        const grams = Math.round(list.reduce((sum, entry) => sum + entry.grams, 0) / list.length)
        points.push({ id: key, at, grams, count: list.length })
      }
      return points.sort((a, b) => (a.at < b.at ? -1 : 1))
    }

    function diaperTotals(entries) {
      let pee = 0
      let poop = 0
      for (const entry of entries) {
        if (entry.kind !== 'diaper') continue
        pee += entry.pee
        poop += entry.poop
      }
      return { pee, poop }
    }

    function periodBuckets(entries) {
      const buckets = PERIOD_LABELS.map((label, index) => ({ label, index, breast: 0, formula: 0, total: 0, count: 0 }))
      for (const entry of entries) {
        if (entry.kind !== 'feed') continue
        const hour = new Date(entry.at).getHours()
        const bucket = buckets[Math.min(7, Math.floor(hour / 3))]
        bucket.breast += entry.breastMl
        bucket.formula += entry.formulaMl
        bucket.total += entry.breastMl + entry.formulaMl
        bucket.count += 1
      }
      return buckets
    }

    /** 某一天内一种补充剂的目标/已记录次数与时间，供面板与打卡格共用。 */
    function supplementStatus(entries, item) {
      const target = SUPPLEMENT_DAILY[item]
      const records = entries
        .filter(entry => entry.kind === 'supplement' && entry.item === item)
        .sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
      const count = records.length
      return {
        target,
        count,
        done: count >= target,
        partial: count > 0 && count < target,
        times: records.map(record => timeOf(record.at)),
      }
    }

    /** 打卡格/历史用的进度文案：次数 + 当天各次时间。 */
    function supplementDetail(status, t) {
      if (status.target === 1) return status.times.length > 0 ? status.times[0] : t('notRecorded')
      const parts = [status.count + '/' + status.target]
      if (status.times.length > 0) parts.push(status.times.join(' → '))
      return parts.join(' · ')
    }

    /** 查找某类补充剂最近一次（跨天），用于“上次时间 + 间隔”。 */
    function lastSupplementAt(entries, item) {
      const records = entries.filter(entry => entry.kind === 'supplement' && entry.item === item)
      return records.length > 0 ? records.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0))[0] : null
    }

    /** 益生菌（每天两次）的“上次时间 + 距这次多久”。 */
    function probioticDetail(count, target, last, t) {
      const parts = [count + '/' + target]
      if (!last) {
        parts.push(t('notRecorded'))
        return parts.join(' · ')
      }
      parts.push(t('lastDoseLabel') + ' ' + lastTimeWhen(last.at, t))
      parts.push(t('intervalLabel') + ' ' + intervalText(minutesSince(last.at), t))
      return parts.join(' · ')
    }

    function describeEntry(entry, t) {
      if (entry.kind === 'feed') {
        return { main: feedAmountText(entry, t), sub: '' }
      }
      if (entry.kind === 'weight') {
        return { main: formatKg(entry.grams) + ' kg', sub: '' }
      }
      if (entry.kind === 'height') {
        return { main: formatCm(entry.mm) + ' cm', sub: '' }
      }
      if (entry.kind === 'diaper') {
        const parts = []
        if (entry.pee > 0) parts.push(t('pee') + ' ' + entry.pee + ' ' + t('times'))
        if (entry.poop > 0) parts.push(t('poop') + ' ' + entry.poop + ' ' + t('times'))
        return { main: parts.join(' · '), sub: '' }
      }
      return { main: t(entry.item) + (entry.dose ? ' · ' + entry.dose : ''), sub: '' }
    }

    function messageOf(error, t) {
      const message = error && error.message ? error.message : String(error || '')
      if (message.indexOf('HTTP 401') >= 0 || message.indexOf('HTTP 403') >= 0) return t('authFailed')
      if (/Failed to fetch|NetworkError|Load failed|HTTP 0$/i.test(message)) return t('networkFailed')
      return message
    }

    // ───────────────────────────── 状态与请求 ─────────────────────────────

    function createStore(initial) {
      let state = initial
      const listeners = new Set()
      return {
        get: () => state,
        set(patch) {
          const next = typeof patch === 'function' ? patch(state) : Object.assign({}, state, patch)
          if (next === state) return
          state = next
          for (const listener of [...listeners]) listener()
        },
        subscribe(listener) {
          listeners.add(listener)
          return () => { listeners.delete(listener) }
        },
      }
    }

    function useStoreState(store) {
      const [state, setState] = React.useState(store.get())
      React.useEffect(() => store.subscribe(() => setState(store.get())), [store])
      return state
    }

    function useElementWidth() {
      const ref = React.useRef(null)
      const [width, setWidth] = React.useState(0)
      React.useEffect(() => {
        const element = ref.current
        if (!element) return undefined
        const update = () => setWidth(element.clientWidth)
        update()
        if (typeof ResizeObserver === 'function') {
          const observer = new ResizeObserver(update)
          observer.observe(element)
          return () => observer.disconnect()
        }
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
      }, [])
      return [ref, width]
    }

    // ───────────────────────────── 图标 ─────────────────────────────

    function icon(paths, size) {
      return h('svg', Object.assign({ viewBox: '0 0 24 24', width: size || 16, height: size || 16, 'aria-hidden': true, style: { display: 'block' } }, ICON_STROKE), paths)
    }

    function BottleIcon(props) {
      return icon([
        h('rect', { key: 'b', x: 8, y: 8.5, width: 8, height: 12.5, rx: 2.5 }),
        h('path', { key: 'n', d: 'M10 8.5V6h4v2.5' }),
        h('path', { key: 'c', d: 'M10 3h4' }),
        h('path', { key: 'l', d: 'M10.5 12.5h3' }),
      ], props.size)
    }

    function ScaleIcon(props) {
      return icon([
        h('rect', { key: 'r', x: 3.5, y: 4.5, width: 17, height: 15, rx: 3 }),
        h('path', { key: 'a', d: 'M8 11.2a4 4 0 0 1 8 0' }),
        h('path', { key: 'n', d: 'M12 11.2l2.2-2.2' }),
      ], props.size)
    }

    function RulerIcon(props) {
      return icon([
        h('rect', { key: 'r', x: 3.5, y: 9, width: 17, height: 6, rx: 1.5 }),
        h('path', { key: 'a', d: 'M7 9v2.5M10.5 9v4M14 9v2.5M17.5 9v4' }),
      ], props.size)
    }

    function DiaperIcon(props) {
      return icon([
        h('path', { key: 'p', d: 'M4 7h16l-1.2 8.4a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 7z' }),
        h('path', { key: 'l', d: 'M8 7v3.2a4 4 0 0 1-1.5 3' }),
        h('path', { key: 'r', d: 'M16 7v3.2a4 4 0 0 0 1.5 3' }),
      ], props.size)
    }

    function PillIcon(props) {
      return icon([
        h('path', { key: 'c', d: 'M8.6 15.4a3.5 3.5 0 0 1 0-5l1.8-1.8a3.5 3.5 0 0 1 5 5l-1.8 1.8a3.5 3.5 0 0 1-5 0z' }),
        h('path', { key: 'l', d: 'M9.6 9.6l4.8 4.8' }),
      ], props.size)
    }

    function CloseIcon(props) {
      return icon([h('path', { key: 'x', d: 'M6 6l12 12M18 6L6 18' })], props.size)
    }

    function RefreshIcon(props) {
      return icon([
        h('path', { key: 'a', d: 'M20 12a8 8 0 1 1-2.4-5.7' }),
        h('path', { key: 'b', d: 'M20 4.5V9h-4.5' }),
      ], props.size)
    }

    function EditIcon(props) {
      return icon([
        h('path', { key: 'p', d: 'M4.5 19.5h4L19 9l-4-4L4.5 15.5v4z' }),
        h('path', { key: 'l', d: 'M13.5 6.5l4 4' }),
      ], props.size)
    }

    function TrashIcon(props) {
      return icon([
        h('path', { key: 'a', d: 'M4.5 7h15' }),
        h('path', { key: 'b', d: 'M9.5 7V4.8h5V7' }),
        h('path', { key: 'c', d: 'M6.6 7l.8 12a2 2 0 0 0 2 1.9h5.2a2 2 0 0 0 2-1.9l.8-12' }),
      ], props.size)
    }

    function CheckIcon(props) {
      return icon([h('path', { key: 'c', d: 'M5 12.5l4.5 4.5L19 7' })], props.size)
    }

    function DropletIcon(props) {
      return icon([h('path', { key: 'd', d: 'M12 3.5s4.8 5 4.8 8.2a4.8 4.8 0 0 1-9.6 0C7.2 8.5 12 3.5 12 3.5z' })], props.size)
    }

    function kindIcon(kind) {
      if (kind === 'feed') return h(BottleIcon, { size: 15 })
      if (kind === 'weight') return h(ScaleIcon, { size: 15 })
      if (kind === 'height') return h(RulerIcon, { size: 15 })
      if (kind === 'diaper') return h(DiaperIcon, { size: 15 })
      return h(PillIcon, { size: 15 })
    }

    // ───────────────────────────── 基础组件 ─────────────────────────────

    const AppContext = React.createContext(null)

    function useApp() {
      return React.useContext(AppContext)
    }

    function IconButton({ label, onClick, disabled, children }) {
      return h('button', {
        type: 'button',
        className: 'bt-icon-button',
        'aria-label': label,
        title: label,
        disabled: disabled ? true : undefined,
        onClick,
      }, children)
    }

    function StatCard({ label, value, unit, foot }) {
      return h('div', { className: 'bt-card' },
        h('span', { className: 'bt-card-label' }, label),
        h('span', { className: 'bt-card-value' },
          h('span', null, value),
          unit ? h('span', { className: 'bt-card-unit' }, unit) : null
        ),
        foot ? h('span', { className: 'bt-card-foot' }, foot) : null
      )
    }

    function Field({ label, children }) {
      return h('div', { className: 'bt-field', role: 'group', 'aria-label': label },
        h('span', { className: 'bt-field-label' }, label),
        children
      )
    }

    function NumberInput({ value, onChange, min, max, step, suffix, placeholder, ariaLabel }) {
      return h('span', { className: 'bt-input-wrap' },
        h('input', {
          className: 'bt-input',
          type: 'number',
          inputMode: 'decimal',
          min,
          max,
          step,
          value,
          placeholder: placeholder || '',
          'aria-label': ariaLabel,
          onChange: event => onChange(event.target.value),
        }),
        suffix ? h('span', { className: 'bt-suffix' }, suffix) : null
      )
    }

    function Empty({ text }) {
      return h('p', { className: 'bt-empty' }, text)
    }

    /** 兜住页签内容的渲染异常，避免一个坏组件把整个浮层卸载掉。 */
    class PanelBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
      }

      static getDerivedStateFromError(error) {
        return { error }
      }

      componentDidCatch(error, info) {
        console.error('[baby-diary] panel render failed', error, info)
      }

      render() {
        if (this.state.error) {
          return h('div', { className: 'bt-crash', role: 'alert' },
            h('strong', null, this.props.title),
            h('pre', { className: 'bt-crash-detail' }, String(this.state.error.message || this.state.error)),
            h('button', {
              type: 'button',
              className: 'bt-secondary',
              onClick: () => this.setState({ error: null }),
            }, this.props.retryLabel)
          )
        }
        return this.props.children
      }
    }

    // ───────────────────────────── 图表 ─────────────────────────────

    function ChartCard({ title, legend, hint, children }) {
      return h('section', { className: 'bt-chart-card' },
        h('div', { className: 'bt-chart-head' },
          h('h3', { className: 'bt-chart-title' }, title),
          legend ? h('div', { className: 'bt-legend' }, legend) : null
        ),
        children,
        hint ? h('span', { className: 'bt-chart-hint' }, hint) : null
      )
    }

    function Swatch({ color, label }) {
      return h('span', { className: 'bt-legend-item' },
        h('span', { className: 'bt-swatch', style: { background: color } }),
        label
      )
    }

    function GrowthChart({ entries, t, valueOf, formatValue, unit, summaryLabel, title, minPad, color, gradientId, countLabel }) {
      const [ref, width] = useElementWidth()
      const points = React.useMemo(() => entries
        .slice()
        .sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
        .map(entry => ({ time: Date.parse(entry.at), value: valueOf(entry), at: entry.at, tooltip: entry.tooltip })), [entries, valueOf])

      if (points.length === 0) {
        return h('div', { ref, className: 'bt-chart' }, h(Empty, { text: t('noData') }))
      }

      const height = 210
      const margin = { left: 46, right: 14, top: 24, bottom: 26 }
      const w = Math.max(width || 320, 260)
      const innerW = Math.max(10, w - margin.left - margin.right)
      const innerH = height - margin.top - margin.bottom
      const first = points[0].time
      const last = points[points.length - 1].time
      const single = points.length === 1
      const span = Math.max(last - first, 86400000)
      let low = Math.min(...points.map(point => point.value))
      let high = Math.max(...points.map(point => point.value))
      const pad = Math.max(minPad, Math.round((high - low) * 0.25))
      low -= pad
      high += pad
      if (high === low) { low -= minPad; high += minPad }

      const xOf = time => single
        ? margin.left + innerW / 2
        : margin.left + ((time - first) / span) * innerW
      const yOf = value => margin.top + innerH - ((value - low) / (high - low)) * innerH
      const line = points.map((point, index) => (index === 0 ? 'M' : 'L') + xOf(point.time).toFixed(1) + ' ' + yOf(point.value).toFixed(1)).join(' ')
      const baseline = (margin.top + innerH).toFixed(1)
      const area = line + ' L' + xOf(last).toFixed(1) + ' ' + baseline + ' L' + xOf(first).toFixed(1) + ' ' + baseline + ' Z'
      const ticks = [low, (low + high) / 2, high]
      const xLabels = []
      if (single) xLabels.push({ time: first, anchor: 'middle' })
      else {
        xLabels.push({ time: first, anchor: 'start' })
        if (points.length > 2) xLabels.push({ time: (first + last) / 2, anchor: 'middle' })
        xLabels.push({ time: last, anchor: 'end' })
      }

      const latestPoint = points[points.length - 1]
      const chartLabel = title + ' · ' + summaryLabel + ' ' + formatValue(latestPoint.value) + ' ' + unit

      return h('div', { ref, className: 'bt-chart' },
        h('div', { className: 'bt-chart-summary' },
          h('span', null, summaryLabel),
          h('b', null, formatValue(latestPoint.value) + ' ' + unit),
          h('span', { className: 'bt-chart-sep' }, '·'),
          h('span', null, countLabel ? countLabel(points.length) : t('weightRecords', { n: points.length }))
        ),
        h('svg', { viewBox: '0 0 ' + w + ' ' + height, width: '100%', height, role: 'img', 'aria-label': chartLabel, style: { display: 'block' } },
          h('defs', null,
            h('linearGradient', { id: gradientId, x1: '0', y1: '0', x2: '0', y2: '1' },
              h('stop', { offset: '0%', style: { stopColor: color, stopOpacity: 0.22 } }),
              h('stop', { offset: '100%', style: { stopColor: color, stopOpacity: 0 } })
            )
          ),
          ticks.map((tick, index) => h('g', { key: 'y' + index },
            h('line', {
              x1: margin.left, x2: w - margin.right,
              y1: yOf(tick), y2: yOf(tick),
              style: { stroke: 'var(--dsw-alias-border-l1)' },
              strokeDasharray: index === ticks.length - 1 ? '0' : '3 4',
            }),
            h('text', {
              x: margin.left - 8, y: yOf(tick) + 3, textAnchor: 'end',
              style: { fill: 'var(--dsw-alias-label-tertiary)', fontSize: '10px' },
            }, formatValue(tick))
          )),
          xLabels.map((label, index) => h('text', {
            key: 'x' + index,
            x: xOf(label.time),
            y: height - 8,
            textAnchor: label.anchor,
            style: { fill: 'var(--dsw-alias-label-tertiary)', fontSize: '10px' },
          }, dayShortLabel(new Date(label.time), 'zh'))),
          h('path', { d: area, style: { fill: 'url(#' + gradientId + ')', stroke: 'none' } }),
          h('path', {
            d: line,
            style: { fill: 'none', stroke: color },
            strokeWidth: 2,
            strokeLinejoin: 'round',
            strokeLinecap: 'round',
          }),
          points.map((point, index) => {
            const labelY = Math.max(10, yOf(point.value) - (index % 2 === 0 ? 9 : 21))
            return h('g', { key: 'p' + index },
              h('circle', {
                cx: xOf(point.time),
                cy: yOf(point.value),
                r: index === points.length - 1 ? 4 : 3,
                style: { fill: 'var(--dsw-alias-bg-layer-1)', stroke: color },
                strokeWidth: 2,
              }, h('title', null, point.tooltip || (formatValue(point.value) + ' ' + unit + ' · ' + dayShortLabel(new Date(point.time), 'zh')))),
              h('text', {
                x: xOf(point.time),
                y: labelY,
                textAnchor: 'middle',
                style: { fill: 'var(--dsw-alias-label-secondary)', fontSize: '9px', fontWeight: 600 },
              }, formatValue(point.value))
            )
          })
        )
      )
    }

    function WeightChart({ entries, t }) {
      const days = dailyWeightPoints(entries).map(point => ({
        ...point,
        tooltip: formatKg(point.grams) + ' kg · ' + dayShortLabel(new Date(point.at), 'zh')
          + (point.count > 1 ? ' · ' + t('weightDailyAverage', { n: point.count }) : ''),
      }))
      return h(GrowthChart, {
        entries: days, t,
        valueOf: entry => entry.grams,
        formatValue: formatKg,
        unit: 'kg',
        summaryLabel: t('latestWeight'),
        title: t('weightTrend'),
        minPad: 80,
        color: SERIES_PRIMARY,
        gradientId: 'bt-weight-fill',
        countLabel: n => t('weightDays', { n }),
      })
    }

    function HeightChart({ entries, t }) {
      return h(GrowthChart, {
        entries, t,
        valueOf: entry => entry.mm,
        formatValue: formatCm,
        unit: 'cm',
        summaryLabel: t('latestHeight'),
        title: t('heightTrend'),
        minPad: 2,
        color: SERIES_SECONDARY,
        gradientId: 'bt-height-fill',
      })
    }

    function axisEvery(count) {
      return Math.max(1, Math.ceil(count / 6))
    }

    function MilkBars({ days, t }) {
      const [ref, width] = useElementWidth()
      const hasData = days.some(day => day.breast + day.formula > 0)
      if (!hasData) return h('div', { ref, className: 'bt-chart' }, h(Empty, { text: t('noData') }))
      const height = 210
      const margin = { left: 44, right: 12, top: 22, bottom: 24 }
      const w = Math.max(width || 320, 260)
      const innerW = Math.max(10, w - margin.left - margin.right)
      const innerH = height - margin.top - margin.bottom
      const totals = days.map(day => day.breast + day.formula)
      const max = Math.max(1, ...totals)
      const slot = innerW / days.length
      const barWidth = Math.max(3, Math.min(18, slot * 0.55))
      const yOf = value => margin.top + innerH - (value / max) * innerH
      const every = axisEvery(days.length)
      const milkTotal = days.reduce((sum, day) => sum + day.breast + day.formula, 0)
      const todayTotal = totals[totals.length - 1] || 0
      const recordedDays = totals.filter(total => total > 0).length
      const average = recordedDays > 0 ? Math.round(milkTotal / recordedDays) : 0
      const nurseTotal = days.reduce((sum, day) => sum + (day.nurseMin || 0), 0)
      const labelEvery = days.length <= 10

      return h('div', { ref, className: 'bt-chart' },
        h('div', { className: 'bt-chart-summary' },
          h('span', null, t('todayLabel')),
          h('b', null, todayTotal + ' ml'),
          h('span', { className: 'bt-chart-sep' }, '·'),
          h('span', { title: t('milkAverageHint') }, t('milkAverageLabel')),
          h('b', { title: t('milkAverageHint') }, average + ' ml'),
          nurseTotal > 0 ? h('span', { className: 'bt-chart-sep' }, '·') : null,
          nurseTotal > 0 ? h('span', null, t('nurseShort') + ' ' + nurseTotal + ' ' + t('minutes')) : null
        ),
        h('svg', {
          viewBox: '0 0 ' + w + ' ' + height,
          width: '100%',
          height,
          role: 'img',
          'aria-label': t('milkTrend') + ' · ' + t('todayLabel') + ' ' + todayTotal + ' ml · ' + t('milkAverageLabel') + ' ' + average + ' ml',
          style: { display: 'block' },
        },
          [0, max / 2, max].map((tick, index) => h('g', { key: 'y' + index },
            h('line', {
              x1: margin.left, x2: w - margin.right, y1: yOf(tick), y2: yOf(tick),
              style: { stroke: 'var(--dsw-alias-border-l1)' },
              strokeDasharray: index === 0 ? '0' : '3 4',
            }),
            h('text', {
              x: margin.left - 6, y: yOf(tick) + 3, textAnchor: 'end',
              style: { fill: 'var(--dsw-alias-label-tertiary)', fontSize: '10px' },
            }, String(Math.round(tick)))
          )),
          days.map((day, index) => {
            const center = margin.left + slot * (index + 0.5)
            const breastHeight = (day.breast / max) * innerH
            const formulaHeight = (day.formula / max) * innerH
            const base = margin.top + innerH
            const total = day.breast + day.formula
            const showValue = labelEvery || index === days.length - 1 || total === max
            return h('g', { key: day.key },
              day.breast > 0 ? h('rect', {
                x: center - barWidth / 2,
                y: base - breastHeight,
                width: barWidth,
                height: breastHeight,
                rx: day.formula > 0 ? 0 : 2,
                style: { fill: SERIES_PRIMARY },
              }, h('title', null, day.key + ' · ' + t('breastMilk') + ' ' + day.breast + ' ml')) : null,
              day.formula > 0 ? h('rect', {
                x: center - barWidth / 2,
                y: base - breastHeight - formulaHeight,
                width: barWidth,
                height: formulaHeight,
                rx: 2,
                style: { fill: SERIES_SECONDARY },
              }, h('title', null, day.key + ' · ' + t('formula') + ' ' + day.formula + ' ml')) : null,
              labelEvery && barWidth >= 12 && day.breast > 0 && breastHeight >= 9 ? h('text', {
                x: center,
                y: base - breastHeight / 2 + 3,
                textAnchor: 'middle',
                style: SERIES_TEXT_PRIMARY,
              }, String(day.breast)) : null,
              labelEvery && barWidth >= 12 && day.formula > 0 && formulaHeight >= 9 ? h('text', {
                x: center,
                y: base - breastHeight - formulaHeight / 2 + 3,
                textAnchor: 'middle',
                style: SERIES_TEXT_SECONDARY,
              }, String(day.formula)) : null,
              index % every === 0 ? h('text', {
                x: center,
                y: height - 7,
                textAnchor: 'middle',
                style: { fill: 'var(--dsw-alias-label-tertiary)', fontSize: '9px' },
              }, dayShortLabel(day.date, 'zh')) : null,
              showValue && total > 0 ? h('text', {
                x: center,
                y: Math.max(11, base - breastHeight - formulaHeight - 5),
                textAnchor: 'middle',
                style: { fill: 'var(--dsw-alias-label-secondary)', fontSize: '9px', fontWeight: 600 },
              }, String(total)) : null
            )
          })
        )
      )
    }

    function FeedAmountChart({ entries, t, lang, todayOnly }) {
      const [selectedDay, setSelectedDay] = React.useState(() => dateKeyOf(new Date()))
      const [ref, width] = useElementWidth()
      const todayKey = dateKeyOf(new Date())
      const dayKey = todayOnly ? todayKey : selectedDay
      const isToday = dayKey === todayKey
      const feeds = entries
        .filter(entry => entry.kind === 'feed' && dateKeyOf(entry.at) === dayKey && entry.breastMl + entry.formulaMl > 0)
        .sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
      const shift = delta => {
        const [year, month, day] = dayKey.split('-').map(Number)
        const date = new Date(year, month - 1, day)
        date.setDate(date.getDate() + delta)
        setSelectedDay(dateKeyOf(date))
      }
      const selector = todayOnly ? null : h('div', { className: 'bt-day-nav' },
        h('button', { type: 'button', className: 'bt-day-button', 'aria-label': t('previousDay'), onClick: () => shift(-1) }, '‹'),
        h('span', { className: 'bt-day-label' }, dayHeading(dayKey, t, lang)),
        h('button', {
          type: 'button',
          className: 'bt-day-button',
          'aria-label': t('nextDay'),
          disabled: isToday,
          onClick: () => shift(1),
        }, '›'),
        isToday ? null : h('button', { type: 'button', className: 'bt-link', onClick: () => setSelectedDay(todayKey) }, t('dayToday'))
      )
      if (feeds.length === 0) {
        return h('div', { ref, className: 'bt-chart' }, selector, h(Empty, { text: t('noFeedAmount') }))
      }

      const amounts = feeds.map(entry => entry.breastMl + entry.formulaMl)
      const maxAmount = Math.max(...amounts)
      const top = Math.max(10, Math.ceil((maxAmount * 1.15) / 10) * 10)
      const height = 230
      const margin = { left: 40, right: 14, top: 26, bottom: 30 }
      const w = Math.max(width || 320, 260)
      const innerW = Math.max(10, w - margin.left - margin.right)
      const innerH = height - margin.top - margin.bottom
      const count = feeds.length
      const xOf = index => count === 1
        ? margin.left + innerW / 2
        : margin.left + (index / (count - 1)) * innerW
      const yOf = value => margin.top + innerH - (value / top) * innerH
      const points = feeds.map((entry, index) => ({
        amount: entry.breastMl + entry.formulaMl,
        label: timeOf(entry.at),
        x: xOf(index),
        y: yOf(entry.breastMl + entry.formulaMl),
        title: timeOf(entry.at) + ' · ' + (entry.breastMl > 0 ? t('breastMilk') + ' ' + entry.breastMl + ' · ' : '')
          + (entry.formulaMl > 0 ? t('formula') + ' ' + entry.formulaMl + ' · ' : '')
          + (entry.breastMl + entry.formulaMl) + ' ml',
      }))
      const line = points.map((point, index) => (index === 0 ? 'M' : 'L') + point.x.toFixed(1) + ' ' + point.y.toFixed(1)).join(' ')
      const sum = amounts.reduce((total, amount) => total + amount, 0)
      const average = Math.round(sum / count)
      const tickValues = [0, top / 2, top]
      // 一天通常 8–15 次：20 次以内每次奶量和时间都标出来，更多时才抽稀。
      const every = Math.max(1, Math.ceil(count / 14))
      const valueEvery = Math.max(1, Math.ceil(count / 20))
      const showValue = index => count <= 20 || index % valueEvery === 0 || index === count - 1

      return h('div', { ref, className: 'bt-chart' },
        selector,
        h('div', { className: 'bt-chart-summary' },
          h('span', null, t('feedCount', { n: count })),
          h('span', { className: 'bt-chart-sep' }, '·'),
          h('span', null, t('feedSum', { sum })),
          h('span', { className: 'bt-chart-sep' }, '·'),
          h('span', null, t('feedAverage', { avg: average }))
        ),
        h('svg', {
          viewBox: '0 0 ' + w + ' ' + height,
          width: '100%',
          height,
          role: 'img',
          'aria-label': t('feedAmountTrend') + ' · ' + dayHeading(dayKey, t, lang) + ' · ' + t('feedCount', { n: count }),
          style: { display: 'block' },
        },
          tickValues.map((tick, index) => h('g', { key: 'y' + index },
            h('line', {
              x1: margin.left, x2: w - margin.right, y1: yOf(tick), y2: yOf(tick),
              style: { stroke: 'var(--dsw-alias-border-l1)' },
              strokeDasharray: index === 0 ? '0' : '3 4',
            }),
            h('text', {
              x: margin.left - 6, y: yOf(tick) + 3, textAnchor: 'end',
              style: { fill: 'var(--dsw-alias-label-tertiary)', fontSize: '10px' },
            }, String(Math.round(tick)))
          )),
          h('line', {
            x1: margin.left,
            x2: w - margin.right,
            y1: yOf(average),
            y2: yOf(average),
            style: { stroke: SERIES_SECONDARY },
            strokeWidth: 1,
            strokeDasharray: '5 4',
          }),
          h('text', {
            x: w - margin.right,
            y: Math.max(11, yOf(average) - 5),
            textAnchor: 'end',
            style: { fill: SERIES_SECONDARY, fontSize: '9px', fontWeight: 600 },
          }, t('feedAverage', { avg: average })),
          h('path', { d: line, style: { fill: 'none', stroke: SERIES_PRIMARY }, strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' }),
          points.map((point, index) => h('g', { key: 'p' + index },
            h('circle', {
              cx: point.x,
              cy: point.y,
              r: index === points.length - 1 ? 4 : 3,
              style: { fill: 'var(--dsw-alias-bg-layer-1)', stroke: SERIES_PRIMARY },
              strokeWidth: 2,
            }, h('title', null, point.title)),
            showValue(index) ? h('text', {
              x: point.x,
              y: Math.max(10, point.y - 9),
              textAnchor: 'middle',
              style: { fill: 'var(--dsw-alias-label-secondary)', fontSize: '9px', fontWeight: 600 },
            }, String(point.amount)) : null,
            index % every === 0 || index === points.length - 1 ? h('text', {
              x: point.x,
              y: height - 8,
              textAnchor: index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle',
              style: { fill: 'var(--dsw-alias-label-tertiary)', fontSize: '9px' },
            }, point.label) : null
          ))
        )
      )
    }

    function DiaperBars({ days, t }) {
      const [ref, width] = useElementWidth()
      const totals = days.map(day => day.pee + day.poop)
      const hasData = totals.some(total => total > 0)
      if (!hasData) return h('div', { ref, className: 'bt-chart' }, h(Empty, { text: t('noData') }))
      const height = 210
      const margin = { left: 36, right: 12, top: 22, bottom: 24 }
      const w = Math.max(width || 320, 240)
      const innerW = Math.max(10, w - margin.left - margin.right)
      const innerH = height - margin.top - margin.bottom
      const max = Math.max(1, ...totals)
      const slot = innerW / days.length
      const barWidth = Math.max(4, Math.min(20, slot * 0.5))
      const yOf = value => margin.top + innerH - (value / max) * innerH
      const every = axisEvery(days.length)
      const ticks = max <= 5 ? Array.from({ length: max + 1 }, (_, index) => index) : [0, Math.round(max / 2), max]
      const lastIndex = days.length - 1
      const today = days[lastIndex]
      const todayPee = today.pee
      const todayPoop = today.poop
      const labelEvery = days.length <= 10

      return h('div', { ref, className: 'bt-chart' },
        h('div', { className: 'bt-chart-summary' },
          h('span', null, t('todayLabel')),
          h('b', null, (todayPee + todayPoop) + ' ' + t('times')),
          h('span', { className: 'bt-chart-sep' }, '·'),
          h('span', null, t('pee') + ' ' + todayPee),
          h('span', { className: 'bt-chart-sep' }, '·'),
          h('span', null, t('poop') + ' ' + todayPoop)
        ),
        h('svg', {
          viewBox: '0 0 ' + w + ' ' + height,
          width: '100%',
          height,
          role: 'img',
          'aria-label': t('diaperTrend') + ' · ' + t('todayLabel') + ' ' + (todayPee + todayPoop) + ' ' + t('times'),
          style: { display: 'block' },
        },
          ticks.map((tick, index) => h('g', { key: 'y' + index },
            h('line', {
              x1: margin.left, x2: w - margin.right, y1: yOf(tick), y2: yOf(tick),
              style: { stroke: 'var(--dsw-alias-border-l1)' },
              strokeDasharray: index === 0 ? '0' : '3 4',
            }),
            h('text', {
              x: margin.left - 6, y: yOf(tick) + 3, textAnchor: 'end',
              style: { fill: 'var(--dsw-alias-label-tertiary)', fontSize: '10px' },
            }, String(tick))
          )),
          days.map((day, index) => {
            const center = margin.left + slot * (index + 0.5)
            const base = margin.top + innerH
            const total = day.pee + day.poop
            const peeHeight = (day.pee / max) * innerH
            const poopHeight = (day.poop / max) * innerH
            const showValue = labelEvery || index === lastIndex || total === max
            return h('g', { key: day.key },
              day.pee > 0 ? h('rect', {
                x: center - barWidth / 2,
                y: base - peeHeight,
                width: barWidth,
                height: peeHeight,
                rx: day.poop > 0 ? 0 : 2,
                style: { fill: SERIES_PRIMARY },
              }, h('title', null, day.key + ' · ' + t('pee') + ' ' + day.pee)) : null,
              day.poop > 0 ? h('rect', {
                x: center - barWidth / 2,
                y: base - peeHeight - poopHeight,
                width: barWidth,
                height: poopHeight,
                rx: 2,
                style: { fill: SERIES_SECONDARY },
              }, h('title', null, day.key + ' · ' + t('poop') + ' ' + day.poop)) : null,
              day.pee > 0 && peeHeight >= 9 ? h('text', {
                x: center,
                y: base - peeHeight / 2 + 3,
                textAnchor: 'middle',
                style: SERIES_TEXT_PRIMARY,
              }, String(day.pee)) : null,
              day.poop > 0 && poopHeight >= 9 ? h('text', {
                x: center,
                y: base - peeHeight - poopHeight / 2 + 3,
                textAnchor: 'middle',
                style: SERIES_TEXT_SECONDARY,
              }, String(day.poop)) : null,
              index % every === 0 ? h('text', {
                x: center,
                y: height - 7,
                textAnchor: 'middle',
                style: { fill: 'var(--dsw-alias-label-tertiary)', fontSize: '9px' },
              }, dayShortLabel(day.date, 'zh')) : null,
              showValue && total > 0 ? h('text', {
                x: center,
                y: Math.max(11, base - peeHeight - poopHeight - 5),
                textAnchor: 'middle',
                style: { fill: 'var(--dsw-alias-label-secondary)', fontSize: '9px', fontWeight: 600 },
              }, String(total)) : null
            )
          })
        )
      )
    }

    function PeriodBars({ buckets, t }) {
      const [ref, width] = useElementWidth()
      const total = buckets.reduce((sum, bucket) => sum + bucket.total, 0)
      if (total === 0) return h('div', { ref, className: 'bt-chart' }, h(Empty, { text: t('noData') }))
      const height = 190
      const margin = { left: 40, right: 10, top: 12, bottom: 24 }
      const w = Math.max(width || 320, 260)
      const innerW = Math.max(10, w - margin.left - margin.right)
      const innerH = height - margin.top - margin.bottom
      const max = Math.max(1, ...buckets.map(bucket => bucket.total))
      const slot = innerW / buckets.length
      const barWidth = Math.max(4, Math.min(20, slot * 0.5))
      const yOf = value => margin.top + innerH - (value / max) * innerH
      const peak = buckets.reduce((best, bucket) => (bucket.total > best.total ? bucket : best), buckets[0])

      return h('div', { ref, className: 'bt-chart' },
        h('svg', { viewBox: '0 0 ' + w + ' ' + height, width: '100%', height, role: 'img', 'aria-label': t('periodTrend') + ' · ' + peak.label + ' ' + peak.total + ' ml', style: { display: 'block' } },
          [0, max / 2, max].map((tick, index) => h('g', { key: 'y' + index },
            h('line', {
              x1: margin.left, x2: w - margin.right, y1: yOf(tick), y2: yOf(tick),
              style: { stroke: 'var(--dsw-alias-border-l1)' },
              strokeDasharray: index === 0 ? '0' : '3 4',
            }),
            h('text', {
              x: margin.left - 6, y: yOf(tick) + 3, textAnchor: 'end',
              style: { fill: 'var(--dsw-alias-label-tertiary)', fontSize: '10px' },
            }, String(Math.round(tick)))
          )),
          buckets.map((bucket, index) => {
            const center = margin.left + slot * (index + 0.5)
            const base = margin.top + innerH
            const barHeight = (bucket.total / max) * innerH
            return h('g', { key: bucket.label },
              h('rect', {
                x: center - barWidth / 2,
                y: base - barHeight,
                width: barWidth,
                height: Math.max(bucket.total > 0 ? 2 : 0, barHeight),
                rx: 2,
                style: { fill: SERIES_PRIMARY },
                fillOpacity: bucket.total > 0 ? 0.85 : 0,
              }, h('title', null, bucket.label + ' · ' + bucket.total + ' ml · ' + bucket.count + ' ' + t('times'))),
              h('text', {
                x: center,
                y: height - 7,
                textAnchor: 'middle',
                style: { fill: 'var(--dsw-alias-label-tertiary)', fontSize: '8.5px' },
              }, bucket.label)
            )
          })
        )
      )
    }

    function SupplementGrid({ days, entries, t }) {
      const byDay = new Map()
      for (const entry of entries) {
        if (entry.kind !== 'supplement') continue
        const key = dateKeyOf(entry.at)
        if (!byDay.has(key)) byDay.set(key, [])
        byDay.get(key).push(entry)
      }
      return h('div', { className: 'bt-supp' },
        h('div', { className: 'bt-supp-days' },
          h('span', null, ''),
          days.map(day => h('span', { key: day.key, className: 'bt-supp-day' }, dayShortLabel(day.date, 'zh')))
        ),
        ['d3', 'probiotic'].map(item => h('div', { key: item, className: 'bt-supp-row' },
          h('span', { className: 'bt-supp-name' }, t(item)),
          days.map(day => {
            const status = supplementStatus(byDay.get(day.key) || [], item)
            const detail = supplementDetail(status, t)
            return h('span', {
              key: day.key,
              className: 'bt-supp-cell',
              role: 'img',
              'data-done': status.done ? 'true' : undefined,
              'data-partial': status.partial ? 'true' : undefined,
              title: day.key + ' ' + t(item) + ' · ' + detail,
              'aria-label': day.key + ' ' + t(item) + ' ' + detail,
            }, status.target > 1
              ? h('span', { className: 'bt-supp-fraction' }, status.count + '/' + status.target)
              : status.done ? h(CheckIcon, { size: 12 }) : '')
          })
        ))
      )
    }

    // ───────────────────────────── 记录行 ─────────────────────────────

    function EntryRow({ entry, t, onEdit, onDelete }) {
      const [confirming, setConfirming] = React.useState(false)
      const [deleting, setDeleting] = React.useState(false)
      const confirmRef = React.useRef(null)
      React.useEffect(() => {
        if (!confirming) return undefined
        const timer = window.setTimeout(() => setConfirming(false), 6000)
        if (confirmRef.current) confirmRef.current.focus()
        return () => window.clearTimeout(timer)
      }, [confirming])
      const summary = describeEntry(entry, t)
      const remove = async () => {
        if (deleting) return
        setDeleting(true)
        const ok = await onDelete(entry)
        if (ok === false) {
          setDeleting(false)
          setConfirming(false)
        }
      }

      return h('li', { className: 'bt-entry' },
        h('span', { className: 'bt-entry-icon', 'aria-hidden': true }, kindIcon(entry.kind)),
        h('div', { className: 'bt-entry-body' },
          h('div', { className: 'bt-entry-line' },
            h('span', { className: 'bt-entry-time' }, timeOf(entry.at)),
            h('span', { className: 'bt-entry-text' }, summary.main),
            entry.note ? h('span', { className: 'bt-entry-note', title: entry.note }, entry.note) : null
          ),
          summary.sub ? h('div', { className: 'bt-entry-sub' }, summary.sub) : null
        ),
        h('div', { className: 'bt-entry-actions' + (confirming ? ' is-open' : '') },
          confirming
            ? [
              h('span', { key: 'ask', className: 'bt-confirm-label' }, t('confirmDelete')),
              h('button', {
                key: 'yes',
                ref: confirmRef,
                type: 'button',
                className: 'bt-link bt-link-danger',
                disabled: deleting,
                onClick: remove,
              }, deleting ? t('deleting') : t('delete')),
              h('button', { key: 'no', type: 'button', className: 'bt-link', disabled: deleting, onClick: () => setConfirming(false) }, t('cancel')),
            ]
            : [
              h(IconButton, { key: 'edit', label: t('edit'), onClick: () => onEdit(entry) }, h(EditIcon, { size: 14 })),
              h(IconButton, { key: 'del', label: t('delete'), onClick: () => setConfirming(true) }, h(TrashIcon, { size: 14 })),
            ]
        )
      )
    }

    // ───────────────────────────── 今日 ─────────────────────────────

    function QuickLogForm({ data, state, actions, t }) {
      const editing = state.editing
      const [mode, setMode] = React.useState('feed')
      const [at, setAt] = React.useState(() => toInputValue(new Date()))
      const [breast, setBreast] = React.useState('')
      const [formula, setFormula] = React.useState('')
      const [nurseMin, setNurseMin] = React.useState('')
      const [side, setSide] = React.useState('both')
      const [kg, setKg] = React.useState('')
      const [heightCm, setHeightCm] = React.useState('')
      const [pee, setPee] = React.useState('1')
      const [poop, setPoop] = React.useState('0')
      const [item, setItem] = React.useState('d3')
      const [dose, setDose] = React.useState('')
      const [note, setNote] = React.useState('')
      const [localError, setLocalError] = React.useState(null)
      const atTouched = React.useRef(false)

      React.useEffect(() => {
        if (!editing) return
        setMode(editing.kind)
        atTouched.current = true
        setAt(toInputValue(new Date(editing.at)))
        setBreast(editing.kind === 'feed' && editing.breastMl ? String(editing.breastMl) : '')
        setFormula(editing.kind === 'feed' && editing.formulaMl ? String(editing.formulaMl) : '')
        setNurseMin(editing.kind === 'feed' && editing.nurseMin ? String(editing.nurseMin) : '')
        setSide(editing.kind === 'feed' && editing.side ? editing.side : 'both')
        setKg(editing.kind === 'weight' ? formatKg(editing.grams) : '')
        setHeightCm(editing.kind === 'height' ? formatCm(editing.mm) : '')
        setPee(editing.kind === 'diaper' ? String(editing.pee) : '1')
        setPoop(editing.kind === 'diaper' ? String(editing.poop) : '0')
        setItem(editing.kind === 'supplement' ? editing.item : 'd3')
        setDose(editing.kind === 'supplement' && editing.dose ? editing.dose : '')
        setNote(editing.note || '')
        setLocalError(null)
      }, [editing])

      React.useEffect(() => {
        if (editing === null) {
          atTouched.current = false
          setAt(toInputValue(new Date()))
          setBreast('')
          setFormula('')
          setNurseMin('')
          setSide('both')
          setKg('')
          setHeightCm('')
          setPee('1')
          setPoop('0')
          setDose('')
          setNote('')
          setLocalError(null)
        }
      }, [editing])

      React.useEffect(() => {
        if (editing) return
        if (atTouched.current) return
        setAt(toInputValue(new Date()))
      }, [state.tick, editing])

      React.useEffect(() => {
        actions.setDirty(
          editing !== null
          || mode !== 'feed'
          || breast !== ''
          || formula !== ''
          || nurseMin !== ''
          || kg !== ''
          || heightCm !== ''
          || pee !== '1'
          || poop !== '0'
          || dose !== ''
          || note !== ''
          || atTouched.current,
        )
        return () => actions.setDirty(false)
      }, [actions, editing, mode, breast, formula, nurseMin, kg, heightCm, pee, poop, dose, note, at])

      const reset = () => {
        atTouched.current = false
        setAt(toInputValue(new Date()))
        setBreast('')
        setFormula('')
        setNurseMin('')
        setSide('both')
        setKg('')
        setHeightCm('')
        setPee('1')
        setPoop('0')
        setDose('')
        setNote('')
        setLocalError(null)
      }

      const submit = async event => {
        event.preventDefault()
        if (state.saving) return
        const date = parseInputValue(at)
        if (!date) { setLocalError(t('invalidTime')); return }
        const entry = { kind: mode, at: date.toISOString() }
        if (mode === 'feed') {
          const milk = numberOrZero(breast)
          const powder = numberOrZero(formula)
          const nurse = numberOrZero(nurseMin)
          if (milk + powder + nurse <= 0) { setLocalError(t('needFeed')); return }
          entry.breastMl = milk
          entry.formulaMl = powder
          entry.nurseMin = nurse
          if (nurse > 0) entry.side = side
        } else if (mode === 'weight') {
          const value = Number(kg)
          if (!Number.isFinite(value) || value <= 0) { setLocalError(t('needWeight')); return }
          entry.grams = Math.round(value * 1000)
        } else if (mode === 'height') {
          const value = Number(heightCm)
          if (!Number.isFinite(value) || value <= 0) { setLocalError(t('needHeight')); return }
          entry.mm = Math.round(value * 10)
        } else if (mode === 'diaper') {
          const wet = numberOrZero(pee)
          const dirty = numberOrZero(poop)
          if (wet + dirty <= 0) { setLocalError(t('needDiaper')); return }
          entry.pee = wet
          entry.poop = dirty
        } else {
          entry.item = item
          if (dose.trim() !== '') entry.dose = dose.trim()
        }
        if (note.trim() !== '') entry.note = note.trim()
        const wasEditing = editing !== null
        const ok = await actions.saveEntry(editing ? editing.id : null, entry)
        if (ok) {
          reset()
          actions.setNotice({ kind: 'success', text: wasEditing ? t('updated') : t('added') })
        }
      }

      const todaySupplements = data.entries.filter(entry => entry.kind === 'supplement' && dateKeyOf(entry.at) === dateKeyOf(new Date()))

      return h('form', { className: 'bt-form', onSubmit: submit },
        editing
          ? h('div', { className: 'bt-edit-banner' },
            h('span', null, t('editing')),
            h('button', { type: 'button', className: 'bt-link', onClick: actions.cancelEdit }, t('stopEditing'))
          )
          : null,
        h('div', { className: 'bt-types' },
          [['feed', t('feed')], ['weight', t('weight')], ['height', t('height')], ['diaper', t('diaper')], ['supplement', t('supplement')]].map(([kind, label]) => h('button', {
            key: kind,
            type: 'button',
            className: 'bt-type',
            'data-active': mode === kind ? 'true' : undefined,
            'aria-pressed': mode === kind ? 'true' : 'false',
            disabled: editing !== null,
            onClick: () => { setMode(kind); setLocalError(null) },
          }, kindIcon(kind), h('span', null, label)))
        ),
        h(Field, { label: t('time') },
          h('div', { className: 'bt-time-row' },
            h('input', {
              className: 'bt-input',
              type: 'datetime-local',
              value: at,
              max: toInputValue(new Date()),
              'aria-label': t('time'),
              onChange: event => { atTouched.current = true; setAt(event.target.value) },
            }),
            h('button', {
              type: 'button',
              className: 'bt-chip',
              onClick: () => { atTouched.current = false; setAt(toInputValue(new Date())) },
            }, t('now'))
          )
        ),
        mode === 'feed' ? h('div', { className: 'bt-feed-fields' },
          h('div', { className: 'bt-row' },
            h(Field, { label: t('breastMilk') }, h(NumberInput, { value: breast, onChange: setBreast, min: 0, max: 2000, step: 5, suffix: 'ml', placeholder: '0', ariaLabel: t('breastMilk') })),
            h(Field, { label: t('formula') }, h(NumberInput, { value: formula, onChange: setFormula, min: 0, max: 2000, step: 5, suffix: 'ml', placeholder: '0', ariaLabel: t('formula') }))
          ),
          h('div', { className: 'bt-row' },
            h(Field, { label: t('nurseMin') }, h(NumberInput, { value: nurseMin, onChange: setNurseMin, min: 0, max: 240, step: 1, suffix: t('minutes'), placeholder: '0', ariaLabel: t('nurseMin') })),
            h(Field, { label: t('side') },
              h('div', { className: 'bt-choice-row' },
                [['left', t('sideLeft')], ['right', t('sideRight')], ['both', t('sideBoth')]].map(([key, label]) => h('button', {
                  key,
                  type: 'button',
                  className: 'bt-choice',
                  'data-active': side === key ? 'true' : undefined,
                  'aria-pressed': side === key ? 'true' : 'false',
                  onClick: () => setSide(key),
                }, label))
              )
            )
          ),
          h('p', { className: 'bt-hint' }, t('nurseHint'))
        ) : null,
        mode === 'weight' ? h(Field, { label: t('weightKg') },
          h(NumberInput, { value: kg, onChange: setKg, min: 0.3, max: 40, step: 0.01, suffix: 'kg', placeholder: '5.20', ariaLabel: t('weightKg') })
        ) : null,
        mode === 'height' ? h(Field, { label: t('heightCm') },
          h(NumberInput, { value: heightCm, onChange: setHeightCm, min: 20, max: 150, step: 0.1, suffix: 'cm', placeholder: '50.0', ariaLabel: t('heightCm') })
        ) : null,
        mode === 'diaper' ? h('div', { className: 'bt-row' },
          h(Field, { label: t('pee') }, h(NumberInput, { value: pee, onChange: setPee, min: 0, max: 20, step: 1, suffix: t('times'), ariaLabel: t('pee') })),
          h(Field, { label: t('poop') }, h(NumberInput, { value: poop, onChange: setPoop, min: 0, max: 20, step: 1, suffix: t('times'), ariaLabel: t('poop') }))
        ) : null,
        mode === 'supplement' ? h('div', null,
          h(Field, { label: t('supplementType') },
            h('div', { className: 'bt-choice-row' },
              [['d3', t('d3')], ['probiotic', t('probiotic')]].map(([key, label]) => h('button', {
                key,
                type: 'button',
                className: 'bt-choice',
                'data-active': item === key ? 'true' : undefined,
                'aria-pressed': item === key ? 'true' : 'false',
                onClick: () => setItem(key),
              }, h(PillIcon, { size: 14 }), label))
            )
          ),
          h('p', { className: 'bt-hint' },
            [['d3', t('d3')], ['probiotic', t('probiotic')]].map(([key, label]) => {
              const status = supplementStatus(todaySupplements, key)
              const detail = key === 'probiotic'
                ? probioticDetail(status.count, status.target, lastSupplementAt(data.entries, 'probiotic'), t)
                : supplementDetail(status, t)
              return h('span', {
                key,
                className: 'bt-supp-chip' + (status.done ? ' is-done' : status.partial ? ' is-partial' : ''),
              }, label + ' · ' + detail)
            })
          ),
          h(Field, { label: t('dose') },
            h('input', { className: 'bt-input', type: 'text', value: dose, maxLength: 40, 'aria-label': t('dose'), onChange: event => setDose(event.target.value) })
          )
        ) : null,
        h(Field, { label: t('note') },
          h('input', { className: 'bt-input', type: 'text', value: note, maxLength: 200, 'aria-label': t('note'), onChange: event => setNote(event.target.value) })
        ),
        localError ? h('p', { className: 'bt-form-error', role: 'alert' }, localError) : null,
        h('button', { type: 'submit', className: 'bt-primary', disabled: state.saving }, state.saving ? t('saving') : editing ? t('saveEdit') : t('addRecord'))
      )
    }

    function TodayTab({ data, state, actions, t, lang }) {
      const todayKey = dateKeyOf(new Date())
      const today = data.entries
        .filter(entry => dateKeyOf(entry.at) === todayKey)
        .sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0))
      const milk = feedTotals(today)
      const diaper = diaperTotals(today)
      const allFeeds = data.entries
        .filter(entry => entry.kind === 'feed')
        .sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0))
      const lastFeed = allFeeds.length > 0 ? allFeeds[0] : null
      const weightDays = dailyWeightPoints(data.entries)
      const latest = weightDays[weightDays.length - 1]
      const previous = weightDays[weightDays.length - 2]
      const heights = data.entries.filter(entry => entry.kind === 'height').sort((a, b) => (a.at < b.at ? 1 : -1))
      const latestHeight = heights[0]
      const previousHeight = heights[1]
      const supplements = today.filter(entry => entry.kind === 'supplement')
      const milkFoot = []
      if (milk.breast > 0 || milk.formula > 0) {
        milkFoot.push(t('breastShort') + ' ' + milk.breast + ' · ' + t('formulaShort') + ' ' + milk.formula)
      }
      if (milk.nurseMin > 0) milkFoot.push(t('nurseShort') + ' ' + milk.nurseMin + ' ' + t('minutes'))

      return h('div', { className: 'bt-today' },
        h('div', { className: 'bt-form-col' },
          h(QuickLogForm, { data, state, actions, t })
        ),
        h('div', { className: 'bt-main-col' },
          h('div', { className: 'bt-last-feed' },
            h('span', { className: 'bt-last-feed-icon', 'aria-hidden': true }, h(BottleIcon, { size: 16 })),
            h('span', { className: 'bt-last-feed-label' }, t('lastFeedLabel')),
            lastFeed
              ? h('b', { className: 'bt-last-feed-time' }, lastTimeWhen(lastFeed.at, t))
              : h('span', { className: 'bt-last-feed-time' }, t('notYet')),
            lastFeed
              ? h('span', { className: 'bt-last-feed-amount' }, feedAmountText(lastFeed, t))
              : null,
            lastFeed
              ? h('span', { className: 'bt-last-feed-gap' },
                h('span', null, t('intervalLabel')),
                h('b', null, intervalText(minutesSince(lastFeed.at), t)))
              : null
          ),
          h('div', { className: 'bt-cards' },
            h(StatCard, {
              label: t('todayMilk'),
              value: milk.total > 0 ? String(milk.total) : t('noDataShort'),
              unit: milk.total > 0 ? 'ml' : '',
              foot: milkFoot.length > 0 ? milkFoot.join(' · ') : t('notYet'),
            }),
            h(StatCard, {
              label: t('todayFeeds'),
              value: String(milk.count),
              unit: t('timesUnit'),
              foot: lastFeed ? t('lastFeedShort', { time: lastTimeWhen(lastFeed.at, t) }) : t('notYet'),
            }),
            h(StatCard, {
              label: t('todayDiaper'),
              value: diaper.pee + ' / ' + diaper.poop,
              unit: t('timesUnit'),
              foot: t('pee') + ' ' + diaper.pee + ' · ' + t('poop') + ' ' + diaper.poop,
            }),
            h(StatCard, {
              label: t('latestWeight'),
              value: latest ? formatKg(latest.grams) : t('noDataShort'),
              unit: latest ? 'kg' : '',
              foot: latest
                ? (previous ? t('weightDelta', { delta: formatDelta(latest.grams - previous.grams) }) : t('recordedAt', { date: dayHeading(dateKeyOf(latest.at), t, lang) }))
                : t('notYet'),
            }),
            h(StatCard, {
              label: t('latestHeight'),
              value: latestHeight ? formatCm(latestHeight.mm) : t('noDataShort'),
              unit: latestHeight ? 'cm' : '',
              foot: latestHeight
                ? (previousHeight ? t('heightDelta', { delta: formatCmDelta(latestHeight.mm - previousHeight.mm) }) : t('recordedAt', { date: dayHeading(dateKeyOf(latestHeight.at), t, lang) }))
                : t('notYet'),
            })
          ),
          h('div', { className: 'bt-supp-strip' },
            [['d3', t('d3')], ['probiotic', t('probiotic')]].map(([key, label]) => {
              const status = supplementStatus(supplements, key)
              const detail = key === 'probiotic'
                ? probioticDetail(status.count, status.target, lastSupplementAt(data.entries, 'probiotic'), t)
                : supplementDetail(status, t)
              return h('span', {
                key,
                className: 'bt-supp-chip' + (status.done ? ' is-done' : status.partial ? ' is-partial' : ''),
              },
                status.done ? h(CheckIcon, { size: 13 }) : h(PillIcon, { size: 13 }),
                label,
                h('span', { className: 'bt-supp-time' }, detail)
              )
            })
          ),
          h('section', { className: 'bt-section' },
            h('div', { className: 'bt-section-head' },
              h('h3', { className: 'bt-section-title' }, t('todayFeedAmount')),
              h('span', { className: 'bt-section-meta' }, t('todayFeedHint'))
            ),
            h('div', { className: 'bt-chart-card' },
              h(FeedAmountChart, { entries: data.entries, t, lang, todayOnly: true })
            )
          ),
          h('section', { className: 'bt-section' },
            h('div', { className: 'bt-section-head' },
              h('h3', { className: 'bt-section-title' }, t('todayRecords')),
              h('span', { className: 'bt-section-meta' }, String(today.length))
            ),
            today.length > 0
              ? h('ul', { className: 'bt-timeline' }, today.map(entry => h(EntryRow, {
                key: entry.id, entry, t,
                onEdit: actions.edit,
                onDelete: entryToDelete => actions.deleteEntry(entryToDelete.id),
              })))
              : h('div', { className: 'bt-empty' },
                h('strong', null, t('noRecordsToday')),
                h('span', null, t('noRecordsHint'))
              )
          )
        )
      )
    }

    // ───────────────────────────── 趋势 ─────────────────────────────

    function TrendsTab({ data, t, lang }) {
      const [range, setRange] = React.useState(7)
      const days = buildDays(data.entries, range)
      const weights = data.entries.filter(entry => entry.kind === 'weight')
      const heights = data.entries.filter(entry => entry.kind === 'height')
      const rangeStart = new Date()
      rangeStart.setHours(0, 0, 0, 0)
      rangeStart.setDate(rangeStart.getDate() - (range - 1))
      const inRange = data.entries.filter(entry => Date.parse(entry.at) >= rangeStart.getTime())
      const buckets = periodBuckets(inRange)
      const supplementDays = buildDays(data.entries, 7)

      return h('div', { className: 'bt-trends' },
        h('div', { className: 'bt-trends-head' },
          h('span', { className: 'bt-section-meta' }, t('trendsRange')),
          h('div', { className: 'bt-range' },
            [[7, t('range7')], [30, t('range30')]].map(([value, label]) => h('button', {
              key: value,
              type: 'button',
              'data-active': range === value ? 'true' : undefined,
              'aria-pressed': range === value ? 'true' : 'false',
              onClick: () => setRange(value),
            }, label))
          )
        ),
        h('div', { className: 'bt-charts' },
          h(ChartCard, {
            title: t('weightTrend'),
            hint: t('weightHint'),
          }, h(WeightChart, { entries: weights, t })),
          h(ChartCard, {
            title: t('heightTrend'),
            hint: t('heightHint'),
          }, h(HeightChart, { entries: heights, t })),
          h(ChartCard, {
            title: t('milkTrend'),
            hint: t('milkHint'),
            legend: [
              h(Swatch, { key: 'b', color: SERIES_PRIMARY, label: t('breastShort') }),
              h(Swatch, { key: 'f', color: SERIES_SECONDARY, label: t('formulaShort') }),
            ],
          }, h(MilkBars, { days, t })),
          h(ChartCard, {
            title: t('feedAmountTrend'),
            hint: t('feedAmountHint'),
          }, h(FeedAmountChart, { entries: data.entries, t, lang })),
          h(ChartCard, {
            title: t('diaperTrend'),
            hint: t('diaperHint'),
            legend: [
              h(Swatch, { key: 'p', color: SERIES_PRIMARY, label: t('pee') }),
              h(Swatch, { key: 'o', color: SERIES_SECONDARY, label: t('poop') }),
            ],
          }, h(DiaperBars, { days, t })),
          h(ChartCard, {
            title: t('periodTrend'),
            hint: t('periodHint', { n: range }),
          }, h(PeriodBars, { buckets, t })),
          h(ChartCard, {
            title: t('supplementTrend'),
            hint: t('supplementHint'),
          }, h(SupplementGrid, { days: supplementDays, entries: data.entries, t }))
        )
      )
    }

    // ───────────────────────────── 历史 ─────────────────────────────

    function HistoryTab({ data, t, lang, actions }) {
      const groups = new Map()
      const cutoff = new Date()
      cutoff.setHours(0, 0, 0, 0)
      cutoff.setDate(cutoff.getDate() - 29)
      const cutoffMs = cutoff.getTime()
      for (const entry of data.entries) {
        if (Date.parse(entry.at) < cutoffMs) continue
        const key = dateKeyOf(entry.at)
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key).push(entry)
      }
      const keys = [...groups.keys()].sort().reverse()

      if (keys.length === 0) {
        return h('div', { className: 'bt-empty' }, h('strong', null, t('historyEmpty')))
      }

      return h('div', { className: 'bt-history' },
        h('div', { className: 'bt-section-head' },
          h('h3', { className: 'bt-section-title' }, t('historyTitle')),
          h('span', { className: 'bt-section-meta' }, String(keys.length))
        ),
        h('div', { className: 'bt-days' },
        keys.map(key => {
          const entries = groups.get(key).slice().sort((a, b) => (a.at < b.at ? 1 : -1))
          const milk = feedTotals(entries)
          const diaper = diaperTotals(entries)
          return h('section', { key, className: 'bt-day' },
            h('div', { className: 'bt-day-head' },
              h('span', { className: 'bt-day-title' }, dayHeading(key, t, lang)),
              h('span', { className: 'bt-day-meta' }, t('historyMeta', {
                milk: (() => {
                  const parts = []
                  if (milk.total > 0) parts.push(milk.total + ' ml')
                  if (milk.nurseMin > 0) parts.push(t('nurseShort') + ' ' + milk.nurseMin + ' ' + t('minutes'))
                  return parts.length > 0 ? parts.join(' · ') : t('noDataShort')
                })(),
                pee: diaper.pee,
                poop: diaper.poop,
              }))
            ),
            h('ul', { className: 'bt-timeline' }, entries.map(entry => h(EntryRow, {
              key: entry.id, entry, t,
              onEdit: actions.edit,
              onDelete: entryToDelete => actions.deleteEntry(entryToDelete.id),
            })))
          )
        })
        )
      )
    }

    // ───────────────────────────── 设置 ─────────────────────────────

    // ───────────────────────────── Excel 导出 ─────────────────────────────
    // 浏览器内生成真正的 .xlsx：OOXML 各部件 + stored（不压缩）ZIP 打包，
    // 不依赖任何第三方表格库。Excel / Numbers / WPS / LibreOffice 均可打开。

    const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'

    const CRC_TABLE = (() => {
      const table = new Uint32Array(256)
      for (let index = 0; index < 256; index += 1) {
        let value = index
        for (let bit = 0; bit < 8; bit += 1) {
          value = value & 1 ? 0xEDB88320 ^ (value >>> 1) : value >>> 1
        }
        table[index] = value >>> 0
      }
      return table
    })()

    function crc32(bytes) {
      let crc = 0xFFFFFFFF
      for (let index = 0; index < bytes.length; index += 1) {
        crc = CRC_TABLE[(crc ^ bytes[index]) & 0xFF] ^ (crc >>> 8)
      }
      return (crc ^ 0xFFFFFFFF) >>> 0
    }

    /** 把若干 {name, data} 打包成 store 方式的 ZIP（xlsx 容器）。 */
    function zipStore(files) {
      const encoder = new TextEncoder()
      const records = files.map(file => {
        const name = encoder.encode(file.name)
        const data = typeof file.data === 'string' ? encoder.encode(file.data) : file.data
        return { name, data, crc: crc32(data) }
      })
      let size = 22
      for (const record of records) size += 30 + record.name.length + record.data.length + 46 + record.name.length
      const output = new Uint8Array(size)
      const view = new DataView(output.buffer)
      let offset = 0
      const written = []

      for (const record of records) {
        const localOffset = offset
        view.setUint32(offset, 0x04034b50, true); offset += 4
        view.setUint16(offset, 20, true); offset += 2
        view.setUint16(offset, 0x0800, true); offset += 2
        view.setUint16(offset, 0, true); offset += 2
        view.setUint16(offset, 0, true); offset += 2
        view.setUint16(offset, 0x0021, true); offset += 2
        view.setUint32(offset, record.crc, true); offset += 4
        view.setUint32(offset, record.data.length, true); offset += 4
        view.setUint32(offset, record.data.length, true); offset += 4
        view.setUint16(offset, record.name.length, true); offset += 2
        view.setUint16(offset, 0, true); offset += 2
        output.set(record.name, offset); offset += record.name.length
        output.set(record.data, offset); offset += record.data.length
        written.push({ record, localOffset })
      }

      const directoryStart = offset
      for (const item of written) {
        view.setUint32(offset, 0x02014b50, true); offset += 4
        view.setUint16(offset, 20, true); offset += 2
        view.setUint16(offset, 20, true); offset += 2
        view.setUint16(offset, 0x0800, true); offset += 2
        view.setUint16(offset, 0, true); offset += 2
        view.setUint16(offset, 0, true); offset += 2
        view.setUint16(offset, 0x0021, true); offset += 2
        view.setUint32(offset, item.record.crc, true); offset += 4
        view.setUint32(offset, item.record.data.length, true); offset += 4
        view.setUint32(offset, item.record.data.length, true); offset += 4
        view.setUint16(offset, item.record.name.length, true); offset += 2
        view.setUint16(offset, 0, true); offset += 2
        view.setUint16(offset, 0, true); offset += 2
        view.setUint16(offset, 0, true); offset += 2
        view.setUint16(offset, 0, true); offset += 2
        view.setUint32(offset, 0, true); offset += 4
        view.setUint32(offset, item.localOffset, true); offset += 4
        output.set(item.record.name, offset); offset += item.record.name.length
      }

      const directorySize = offset - directoryStart
      view.setUint32(offset, 0x06054b50, true); offset += 4
      view.setUint16(offset, 0, true); offset += 2
      view.setUint16(offset, 0, true); offset += 2
      view.setUint16(offset, records.length, true); offset += 2
      view.setUint16(offset, records.length, true); offset += 2
      view.setUint32(offset, directorySize, true); offset += 4
      view.setUint32(offset, directoryStart, true); offset += 4
      view.setUint16(offset, 0, true); offset += 2
      if (offset !== size) throw new Error('xlsx zip size mismatch')
      return output
    }

    function xmlEscape(value) {
      return String(value)
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
    }

    function columnName(index) {
      let name = ''
      let number = index + 1
      while (number > 0) {
        const remainder = (number - 1) % 26
        name = String.fromCharCode(65 + remainder) + name
        number = Math.floor((number - 1) / 26)
      }
      return name
    }

    function rowXml(rowIndex, values, style) {
      const cells = values.map((value, columnIndex) => {
        if (value === null || value === undefined || value === '') return ''
        const ref = columnName(columnIndex) + rowIndex
        const styleAttr = style ? ' s="' + style + '"' : ''
        if (typeof value === 'number' && Number.isFinite(value)) {
          return '<c r="' + ref + '"' + styleAttr + '><v>' + value + '</v></c>'
        }
        return '<c r="' + ref + '"' + styleAttr + ' t="inlineStr"><is><t xml:space="preserve">'
          + xmlEscape(value) + '</t></is></c>'
      }).join('')
      return '<row r="' + rowIndex + '">' + cells + '</row>'
    }

    function sheetXml(sheet) {
      const header = rowXml(1, sheet.columns.map(column => column.header), 1)
      const body = sheet.rows.map((values, index) => rowXml(index + 2, values, 0)).join('')
      const lastColumn = columnName(Math.max(0, sheet.columns.length - 1))
      const filterRef = 'A1:' + lastColumn + Math.max(1, sheet.rows.length + 1)
      const cols = sheet.columns.map((column, index) => '<col min="' + (index + 1) + '" max="' + (index + 1)
        + '" width="' + (column.width || 12) + '" customWidth="1"/>').join('')
      return XML_HEADER
        + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        + '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
        + '<sheetFormatPr defaultRowHeight="15"/>'
        + '<cols>' + cols + '</cols>'
        + '<sheetData>' + header + body + '</sheetData>'
        + '<autoFilter ref="' + filterRef + '"/>'
        + '</worksheet>'
    }

    const STYLES_XML = XML_HEADER
      + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
      + '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font>'
      + '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts>'
      + '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>'
      + '<fill><patternFill patternType="solid"><fgColor rgb="FF247BBF"/><bgColor indexed="64"/></patternFill></fill></fills>'
      + '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
      + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
      + '<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
      + '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">'
      + '<alignment vertical="center"/></xf></cellXfs>'
      + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
      + '</styleSheet>'

    function buildWorkbook(sheets) {
      const count = sheets.length
      const overrides = sheets.map((sheet, index) => '<Override PartName="/xl/worksheets/sheet'
        + (index + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join('')
      const contentTypes = XML_HEADER
        + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        + '<Default Extension="xml" ContentType="application/xml"/>'
        + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
        + overrides + '</Types>'
      const rootRels = XML_HEADER
        + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
        + '</Relationships>'
      const workbook = XML_HEADER
        + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'
        + sheets.map((sheet, index) => '<sheet name="' + xmlEscape(sheet.name) + '" sheetId="' + (index + 1)
          + '" r:id="rId' + (index + 1) + '"/>').join('')
        + '</sheets></workbook>'
      const workbookRels = XML_HEADER
        + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + sheets.map((sheet, index) => '<Relationship Id="rId' + (index + 1)
          + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'
          + (index + 1) + '.xml"/>').join('')
        + '<Relationship Id="rId' + (count + 1)
        + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
        + '</Relationships>'

      const files = [
        { name: '[Content_Types].xml', data: contentTypes },
        { name: '_rels/.rels', data: rootRels },
        { name: 'xl/workbook.xml', data: workbook },
        { name: 'xl/_rels/workbook.xml.rels', data: workbookRels },
        { name: 'xl/styles.xml', data: STYLES_XML },
      ]
      sheets.forEach((sheet, index) => {
        files.push({ name: 'xl/worksheets/sheet' + (index + 1) + '.xml', data: sheetXml(sheet) })
      })
      return zipStore(files)
    }

    const EXCEL_TEXT = {
      zh: {
        daily: '每日汇总', feed: '喂奶明细', diaper: '尿布明细', weightSheet: '体重记录', supplementSheet: '补充剂',
        date: '日期', time: '时间', milkTotal: '奶量合计(ml)', breast: '母乳(ml)', formula: '奶粉(ml)',
        heightSheet: '身高记录', heightCm: '身高(cm)',
        nurseMin: '亲喂(分钟)', side: '侧别', sideLeft: '左', sideRight: '右', sideBoth: '双',
        feedCount: '喂奶次数', pee: '小便(次)', poop: '大便(次)', diaperTotal: '尿布合计(次)',
        weightKg: '体重(kg)', d3Count: '维生素D3(次)', probioticCount: '益生菌(次)', milk: '奶量(ml)',
        note: '备注', type: '类型', dose: '剂量', d3: '维生素D3', probiotic: '益生菌',
      },
      en: {
        daily: 'Daily summary', feed: 'Feedings', diaper: 'Diapers', weightSheet: 'Weight', supplementSheet: 'Supplements',
        date: 'Date', time: 'Time', milkTotal: 'Milk (ml)', breast: 'Breast milk (ml)', formula: 'Formula (ml)',
        heightSheet: 'Height', heightCm: 'Height (cm)',
        nurseMin: 'Nursing (min)', side: 'Side', sideLeft: 'Left', sideRight: 'Right', sideBoth: 'Both',
        feedCount: 'Feedings', pee: 'Pee (times)', poop: 'Poop (times)', diaperTotal: 'Diapers (times)',
        weightKg: 'Weight (kg)', d3Count: 'Vitamin D3 (times)', probioticCount: 'Probiotic (times)', milk: 'Milk (ml)',
        note: 'Note', type: 'Type', dose: 'Dose', d3: 'Vitamin D3', probiotic: 'Probiotic',
      },
    }

    function dateTimeOf(iso) {
      return dateKeyOf(iso) + ' ' + timeOf(iso)
    }

    function excelSheets(data, lang) {
      const H = EXCEL_TEXT[String(lang).indexOf('zh') === 0 ? 'zh' : 'en']
      const entries = data.entries.slice().sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
      const byDay = new Map()
      for (const entry of entries) {
        const key = dateKeyOf(entry.at)
        if (!byDay.has(key)) byDay.set(key, [])
        byDay.get(key).push(entry)
      }

      const dailyRows = []
      if (entries.length > 0) {
        const first = new Date(entries[0].at)
        first.setHours(0, 0, 0, 0)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const cursor = new Date(first)
        let guard = 0
        while (cursor.getTime() <= today.getTime() && guard < 4000) {
          guard += 1
          const key = dateKeyOf(cursor)
          const dayEntries = byDay.get(key) || []
          const milk = feedTotals(dayEntries)
          const diaper = diaperTotals(dayEntries)
          const weights = dayEntries.filter(entry => entry.kind === 'weight').sort((a, b) => (a.at < b.at ? -1 : 1))
          const heights = dayEntries.filter(entry => entry.kind === 'height').sort((a, b) => (a.at < b.at ? -1 : 1))
          const supplements = dayEntries.filter(entry => entry.kind === 'supplement')
          dailyRows.push([
            key,
            milk.total,
            milk.breast,
            milk.formula,
            milk.count,
            milk.nurseMin,
            diaper.pee,
            diaper.poop,
            diaper.pee + diaper.poop,
            weights.length > 0
              ? Number(formatKg(Math.round(weights.reduce((sum, entry) => sum + entry.grams, 0) / weights.length)))
              : null,
            heights.length > 0 ? Number(formatCm(heights[heights.length - 1].mm)) : null,
            supplements.filter(entry => entry.item === 'd3').length,
            supplements.filter(entry => entry.item === 'probiotic').length,
          ])
          cursor.setDate(cursor.getDate() + 1)
        }
      }

      const sideLabel = entry => entry.side === 'left' ? H.sideLeft
        : entry.side === 'right' ? H.sideRight
          : entry.side === 'both' ? H.sideBoth : ''
      const feedRows = entries.filter(entry => entry.kind === 'feed')
        .map(entry => [dateTimeOf(entry.at), entry.breastMl, entry.formulaMl, entry.nurseMin || 0,
          (entry.nurseMin || 0) > 0 ? sideLabel(entry) : '', entry.breastMl + entry.formulaMl, entry.note || ''])
      const diaperRows = entries.filter(entry => entry.kind === 'diaper')
        .map(entry => [dateTimeOf(entry.at), entry.pee, entry.poop, entry.pee + entry.poop, entry.note || ''])
      const weightRows = entries.filter(entry => entry.kind === 'weight')
        .map(entry => [dateTimeOf(entry.at), Number(formatKg(entry.grams)), entry.note || ''])
      const heightRows = entries.filter(entry => entry.kind === 'height')
        .map(entry => [dateTimeOf(entry.at), Number(formatCm(entry.mm)), entry.note || ''])
      const supplementRows = entries.filter(entry => entry.kind === 'supplement')
        .map(entry => [dateTimeOf(entry.at), entry.item === 'd3' ? H.d3 : H.probiotic, entry.dose || '', entry.note || ''])

      return [
        {
          name: H.daily,
          columns: [
            { header: H.date, width: 12 }, { header: H.milkTotal, width: 14 }, { header: H.breast, width: 11 },
            { header: H.formula, width: 11 }, { header: H.feedCount, width: 11 }, { header: H.nurseMin, width: 12 },
            { header: H.pee, width: 11 }, { header: H.poop, width: 11 }, { header: H.diaperTotal, width: 13 },
            { header: H.weightKg, width: 11 }, { header: H.heightCm, width: 11 }, { header: H.d3Count, width: 14 },
            { header: H.probioticCount, width: 13 },
          ],
          rows: dailyRows,
        },
        {
          name: H.feed,
          columns: [
            { header: H.time, width: 18 }, { header: H.breast, width: 11 }, { header: H.formula, width: 11 },
            { header: H.nurseMin, width: 12 }, { header: H.side, width: 8 }, { header: H.milk, width: 11 },
            { header: H.note, width: 30 },
          ],
          rows: feedRows,
        },
        {
          name: H.diaper,
          columns: [
            { header: H.time, width: 18 }, { header: H.pee, width: 11 }, { header: H.poop, width: 11 },
            { header: H.diaperTotal, width: 13 }, { header: H.note, width: 30 },
          ],
          rows: diaperRows,
        },
        {
          name: H.weightSheet,
          columns: [
            { header: H.time, width: 18 }, { header: H.weightKg, width: 12 }, { header: H.note, width: 30 },
          ],
          rows: weightRows,
        },
        {
          name: H.heightSheet,
          columns: [
            { header: H.time, width: 18 }, { header: H.heightCm, width: 12 }, { header: H.note, width: 30 },
          ],
          rows: heightRows,
        },
        {
          name: H.supplementSheet,
          columns: [
            { header: H.time, width: 18 }, { header: H.type, width: 13 }, { header: H.dose, width: 13 },
            { header: H.note, width: 30 },
          ],
          rows: supplementRows,
        },
      ]
    }

    function exportExcel(data, lang) {
      const bytes = buildWorkbook(excelSheets(data, lang))
      const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'baby-diary-' + dateKeyOf(new Date()) + '.xlsx'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1500)
    }

    function exportJson(data) {
      const payload = {
        version: data.version,
        baby: data.baby,
        entries: data.entries,
        exportedAt: new Date().toISOString(),
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'baby-diary-' + dateKeyOf(new Date()) + '.json'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1500)
    }

    function SettingsTab({ data, state, actions, t, lang }) {
      const [name, setName] = React.useState(data.baby.name || '')
      const [birthDate, setBirthDate] = React.useState(data.baby.birthDate || '')
      const [importing, setImporting] = React.useState(false)
      const [confirmingImport, setConfirmingImport] = React.useState(false)
      const fileRef = React.useRef(null)

      React.useEffect(() => {
        setName(data.baby.name || '')
        setBirthDate(data.baby.birthDate || '')
      }, [data.baby.name, data.baby.birthDate])

      const dirty = name !== (data.baby.name || '') || birthDate !== (data.baby.birthDate || '')

      const pickFile = async event => {
        const file = event.target.files && event.target.files[0]
        event.target.value = ''
        if (!file) return
        setImporting(true)
        try {
          const text = await file.text()
          const parsed = JSON.parse(text)
          const entries = Array.isArray(parsed) ? parsed : parsed.entries
          if (!Array.isArray(entries)) throw new Error('entries')
          const baby = Array.isArray(parsed) ? data.baby : (parsed.baby || data.baby)
          const submitted = entries.length
          const next = await actions.replaceData({ baby, entries })
          if (next) {
            const imported = next.entries.length
            actions.setNotice({
              kind: 'success',
              text: imported < submitted
                ? t('importPartial', { imported, skipped: submitted - imported })
                : t('importDone', { n: imported }),
            })
            setConfirmingImport(false)
          }
        } catch {
          actions.setNotice({ kind: 'error', text: t('importFailed') })
        } finally {
          setImporting(false)
        }
      }

      return h('div', { className: 'bt-settings' },
        h('section', { className: 'bt-settings-group' },
          h('h3', { className: 'bt-settings-title' }, t('settingsProfile')),
          h(Field, { label: t('babyName') },
            h('input', { className: 'bt-input', type: 'text', value: name, maxLength: 40, 'aria-label': t('babyName'), onChange: event => setName(event.target.value) })
          ),
          h(Field, { label: t('birthDate') },
            h('input', { className: 'bt-input', type: 'date', value: birthDate, 'aria-label': t('birthDate'), onChange: event => setBirthDate(event.target.value) })
          ),
          h('div', { className: 'bt-actions-row' },
            h('button', {
              type: 'button',
              className: 'bt-primary',
              disabled: !dirty || state.saving,
              onClick: async () => {
                const ok = await actions.saveBaby({ name, birthDate: birthDate || null })
                if (ok) actions.setNotice({ kind: 'success', text: t('profileSaved') })
              },
            }, state.saving ? t('saving') : t('saveProfile'))
          )
        ),
        h('section', { className: 'bt-settings-group' },
          h('h3', { className: 'bt-settings-title' }, t('settingsData')),
          h('p', { className: 'bt-hint' }, t('dataHint')),
          h('span', { className: 'bt-field-label' }, t('dataFile')),
          h('p', { className: 'bt-mono' }, data.dataFile || ''),
          h('div', { className: 'bt-actions-row' },
            h('button', { type: 'button', className: 'bt-primary', onClick: () => exportExcel(data, lang) }, t('exportExcel')),
            h('button', { type: 'button', className: 'bt-secondary', onClick: () => exportJson(data) }, t('exportJson')),
            h('button', {
              type: 'button',
              className: 'bt-secondary',
              disabled: importing,
              onClick: () => setConfirmingImport(true),
            }, t('importJson'))
          ),
          h('p', { className: 'bt-hint' }, t('excelHint')),
          confirmingImport
            ? h('div', { className: 'bt-import-confirm' },
              h('span', null, t('importConfirm')),
              h('button', { type: 'button', className: 'bt-primary', onClick: () => fileRef.current && fileRef.current.click() }, t('confirm')),
              h('button', { type: 'button', className: 'bt-secondary', onClick: () => setConfirmingImport(false) }, t('cancel'))
            )
            : null,
          h('input', { ref: fileRef, type: 'file', accept: 'application/json,.json', style: { display: 'none' }, onChange: pickFile })
        ),
        h('section', { className: 'bt-settings-group' },
          h('h3', { className: 'bt-settings-title' }, t('settingsAbout')),
          h('p', { className: 'bt-hint' }, t('aboutText'))
        )
      )
    }

    // ───────────────────────────── 面板 ─────────────────────────────

    function Panel() {
      const app = useApp()
      const { store, actions, t, lang } = app
      const state = useStoreState(store)
      const localeId = lang()
      const modalRef = React.useRef(null)
      const bodyRef = React.useRef(null)

      React.useEffect(() => {
        if (!state.open) return undefined
        const previousFocus = document.activeElement
        const onKey = event => {
          if (event.key === 'Escape') {
            actions.close()
            return
          }
          if (event.key !== 'Tab' || !modalRef.current) return
          const nodes = modalRef.current.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])')
          const focusable = [...nodes].filter(node => !node.disabled && node.offsetParent !== null)
          if (focusable.length === 0) return
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          const atContainer = document.activeElement === modalRef.current
          if (event.shiftKey && (document.activeElement === first || atContainer)) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }
        window.addEventListener('keydown', onKey)
        const timer = window.setTimeout(() => {
          if (modalRef.current) modalRef.current.focus()
        }, 0)
        return () => {
          window.removeEventListener('keydown', onKey)
          window.clearTimeout(timer)
          if (previousFocus && typeof previousFocus.focus === 'function' && previousFocus.isConnected) previousFocus.focus()
        }
      }, [state.open, actions])

      // 面板常开时刷新时间上下文：今日、上次喂养、默认时间都跟着走。
      React.useEffect(() => {
        if (!state.open) return undefined
        const timer = window.setInterval(() => store.set({ tick: Date.now() }), 60000)
        return () => window.clearInterval(timer)
      }, [state.open, store])

      React.useEffect(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = 0
      }, [state.tab, state.editing, state.open])

      if (!state.open) return null

      const data = state.data
      const tabs = [['today', t('tabsToday')], ['trends', t('tabsTrends')], ['history', t('tabsHistory')], ['settings', t('tabsSettings')]]
      let subtitle = ''
      if (data) {
        const parts = [data.baby.name || t('defaultBaby')]
        const days = ageInDays(data.baby.birthDate)
        if (days !== null && days >= 0) parts.push(t('ageDays', { n: days }))
        else if (data.baby.birthDate) parts.push(data.baby.birthDate)
        subtitle = parts.join(' · ')
      }

      let body = null
      if (!data && (state.phase === 'loading' || state.phase === 'idle')) {
        body = h('div', { className: 'bt-state' }, t('loading'))
      } else if (!data && state.phase === 'error') {
        body = h('div', { className: 'bt-state' },
          h('p', { className: 'bt-state-error', role: 'alert' }, t('loadFailed') + '：' + state.error),
          h('button', { type: 'button', className: 'bt-primary', onClick: () => actions.refresh() }, t('retry'))
        )
      } else if (data) {
        if (state.tab === 'trends') body = h(TrendsTab, { data, t })
        else if (state.tab === 'history') body = h(HistoryTab, { data, t, lang: localeId, actions })
        else if (state.tab === 'settings') body = h(SettingsTab, { data, state, actions, t, lang: localeId })
        else body = h(TodayTab, { data, state, actions, t, lang: localeId })
      }

      return h('div', {
        className: 'bt-backdrop',
        onMouseDown: event => {
          if (event.target !== event.currentTarget) return
          if (state.editing || state.dirty || state.saving) return
          actions.close()
        },
      },
        h('div', {
          className: 'bt-modal',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-label': t('title'),
          tabIndex: -1,
          ref: modalRef,
        },
          h('header', { className: 'bt-header' },
            h('div', { className: 'bt-heading' },
              h('span', { className: 'bt-title' }, t('title')),
              subtitle ? h('span', { className: 'bt-subtitle' }, subtitle) : null
            ),
            h('div', { className: 'bt-header-actions' },
              h(IconButton, { label: t('refresh'), onClick: () => actions.refresh(), disabled: state.phase === 'loading' }, h(RefreshIcon, { size: 16 })),
              h(IconButton, { label: t('close'), onClick: actions.close }, h(CloseIcon, { size: 16 }))
            )
          ),
          h('nav', { className: 'bt-tabs', role: 'tablist', 'aria-label': t('title') },
            tabs.map(([key, label]) => h('button', {
              key,
              type: 'button',
              role: 'tab',
              className: 'bt-tab',
              'data-active': state.tab === key ? 'true' : undefined,
              'aria-selected': state.tab === key ? 'true' : 'false',
              onClick: () => actions.setTab(key),
            }, label))
          ),
          state.notice ? h('div', { className: 'bt-notice bt-notice-' + state.notice.kind, role: 'status' }, state.notice.text) : null,
          h('div', { className: 'bt-body', ref: bodyRef },
            h(PanelBoundary, { title: t('renderError'), retryLabel: t('retry') }, body)
          )
        )
      )
    }

    function FooterAction({ wide }) {
      const app = useApp()
      const { store, actions, t } = app
      const state = useStoreState(store)
      return h('div', { className: 'bt-footer' + (wide ? '' : ' bt-footer-rail') },
        h('button', {
          type: 'button',
          className: 'bt-footer-button',
          'aria-label': t('title'),
          'aria-expanded': state.open ? 'true' : 'false',
          title: t('title'),
          onClick: () => actions.toggle(),
        },
          h('span', { className: 'bt-footer-icon', 'aria-hidden': true }, h(BottleIcon, { size: 18 })),
          wide ? h('span', { className: 'bt-footer-label' }, t('title')) : null
        )
      )
    }

    // ───────────────────────────── 样式 ─────────────────────────────

    const CSS = `
.bt-footer { position: relative; flex: none; display: flex; align-items: center; width: 100%; height: 42px; margin: 8px 0 0; }
.bt-footer-rail { width: 36px; height: 36px; margin: 0; }
.bt-footer-button { display: inline-flex; align-items: center; gap: 8px; width: calc(100% + 4px); height: 42px; margin: 0 -2px; padding: 0 10px 0 8px; border: none; border-radius: 12px; background: transparent; color: var(--dsw-alias-label-primary); font-family: inherit; font-size: 14px; cursor: pointer; overflow: hidden; }
@media (hover: hover) { .bt-footer-button:hover { background: var(--dsw-alias-interactive-bg-hover); } }
.bt-footer-rail .bt-footer-button { justify-content: center; width: 36px; height: 36px; padding: 0; border-radius: 50%; }
.bt-footer-icon { display: inline-flex; flex: none; color: var(--dsw-alias-label-secondary); }
.bt-footer-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.bt-backdrop { pointer-events: auto; position: fixed; inset: 0; z-index: 60; display: flex; align-items: center; justify-content: center; padding: 22px; background: var(--dsw-alias-bg-mask-1, rgba(0, 0, 0, 0.38)); }
.bt-modal { display: flex; flex-direction: column; width: min(1040px, 100%); max-height: min(88vh, 900px); overflow: hidden; border: 0.5px solid var(--dsw-alias-border-l1); border-radius: 16px; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); box-shadow: var(--dsw-elevation-prominent); outline: none; }
.bt-header { flex: none; display: flex; align-items: flex-start; gap: 16px; padding: 16px 18px 10px; }
.bt-heading { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.bt-title { font-size: 16px; font-weight: 600; line-height: 22px; }
.bt-subtitle { font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.bt-header-actions { flex: none; display: flex; gap: 4px; }
.bt-icon-button { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; padding: 0; border: none; border-radius: 999px; background: transparent; color: var(--dsw-alias-label-tertiary); cursor: pointer; }
.bt-icon-button:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.bt-icon-button:disabled { opacity: 0.4; cursor: default; }
.bt-tabs { flex: none; display: flex; gap: 4px; padding: 0 18px; border-bottom: 0.5px solid var(--dsw-alias-border-l1); }
.bt-tab { position: relative; padding: 8px 12px 10px; border: none; border-radius: 8px 8px 0 0; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 13px; cursor: pointer; }
.bt-tab:hover { background: var(--dsw-alias-interactive-bg-hover); }
.bt-tab[data-active] { color: var(--dsw-alias-label-primary); font-weight: 500; }
.bt-tab[data-active]::after { content: ''; position: absolute; left: 12px; right: 12px; bottom: -0.5px; height: 2px; border-radius: 2px; background: var(--dsw-alias-brand-primary); }
.bt-notice { flex: none; margin: 10px 18px 0; padding: 8px 10px; border-radius: 8px; font-size: 12px; line-height: 18px; }
.bt-notice-error { background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent); color: var(--dsw-alias-state-error-primary); }
.bt-notice-success { background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 12%, transparent); color: var(--dsw-alias-state-success-primary); }
.bt-body { flex: 1; min-height: 0; overflow-y: auto; padding: 16px 18px 22px; }

.bt-today { display: grid; grid-template-columns: 320px minmax(0, 1fr); gap: 18px; align-items: start; }
@media (max-width: 880px) { .bt-today { grid-template-columns: 1fr; } }
.bt-form-col { min-width: 0; }
.bt-main-col { min-width: 0; }
.bt-form { display: flex; flex-direction: column; gap: 12px; padding: 14px; border: 0.5px solid var(--dsw-alias-border-l1); border-radius: 14px; background: var(--dsw-alias-bg-layer-2); }
.bt-edit-banner { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px; border-radius: 8px; background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent); color: var(--dsw-alias-brand-primary); font-size: 12px; }
.bt-types { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
.bt-type { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 0; padding: 8px 4px; border: 0.5px solid var(--dsw-alias-border-l1); border-radius: 10px; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 11px; cursor: pointer; }
.bt-type span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bt-type[data-active] { border-color: var(--dsw-alias-brand-primary); background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent); color: var(--dsw-alias-brand-primary); }
.bt-type:disabled { opacity: 0.55; cursor: default; }
.bt-field { display: flex; flex-direction: column; gap: 6px; }
.bt-field-label { font-size: 12px; line-height: 16px; color: var(--dsw-alias-label-secondary); }
.bt-input-wrap { display: flex; align-items: center; gap: 6px; min-width: 0; }
.bt-input { width: 100%; min-width: 0; height: 34px; padding: 0 10px; box-sizing: border-box; border: 0.5px solid var(--dsw-alias-border-l2); border-radius: 9px; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font: inherit; font-size: 13px; }
.bt-input:focus { outline: 2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 38%, transparent); outline-offset: 1px; border-color: var(--dsw-alias-brand-primary); }
.bt-suffix { flex: none; font-size: 12px; color: var(--dsw-alias-label-tertiary); }
.bt-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.bt-time-row { display: flex; gap: 6px; align-items: center; }
.bt-chip { flex: none; height: 30px; padding: 0 10px; border: 0.5px solid var(--dsw-alias-border-l2); border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12px; cursor: pointer; }
.bt-chip:hover { background: var(--dsw-alias-interactive-bg-hover); }
.bt-choice-row { display: flex; gap: 6px; }
.bt-choice { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 5px; height: 32px; border: 0.5px solid var(--dsw-alias-border-l2); border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12px; cursor: pointer; }
.bt-choice[data-active] { border-color: var(--dsw-alias-brand-primary); background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent); color: var(--dsw-alias-brand-primary); }
.bt-primary { display: inline-flex; align-items: center; justify-content: center; height: 38px; padding: 0 14px; border: none; border-radius: 10px; background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-bg-base); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; }
.bt-primary:disabled { opacity: 0.5; cursor: default; }
.bt-secondary { display: inline-flex; align-items: center; justify-content: center; height: 34px; padding: 0 12px; border: 0.5px solid var(--dsw-alias-border-l2); border-radius: 10px; background: transparent; color: var(--dsw-alias-label-primary); font: inherit; font-size: 12px; cursor: pointer; }
.bt-secondary:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.bt-secondary:disabled { opacity: 0.5; cursor: default; }
.bt-link { padding: 0; border: none; background: transparent; color: var(--dsw-alias-brand-primary); font: inherit; font-size: 12px; cursor: pointer; }
.bt-link-danger { color: var(--dsw-alias-state-error-primary); }
.bt-form-error { margin: 0; font-size: 12px; line-height: 18px; color: var(--dsw-alias-state-error-primary); }
.bt-hint { margin: 0; display: flex; flex-wrap: wrap; gap: 6px; font-size: 11px; line-height: 17px; color: var(--dsw-alias-label-tertiary); }

.bt-last-feed { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px; margin-bottom: 10px; padding: 9px 12px; border: 0.5px solid var(--dsw-alias-border-l1); border-radius: 12px; background: var(--dsw-alias-bg-layer-2); font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.bt-last-feed-icon { align-self: center; display: inline-flex; color: var(--dsw-alias-brand-primary); }
.bt-last-feed-label { font-weight: 500; }
.bt-last-feed-time { font-size: 14px; font-weight: 600; color: var(--dsw-alias-label-primary); font-variant-numeric: tabular-nums; }
.bt-last-feed-amount { color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; }
.bt-last-feed-gap { display: inline-flex; align-items: baseline; gap: 4px; margin-left: auto; }
.bt-last-feed-gap b { font-size: 14px; color: var(--dsw-alias-brand-primary); font-variant-numeric: tabular-nums; }
.bt-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
@media (max-width: 700px) { .bt-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) { .bt-cards { grid-template-columns: 1fr; } }
.bt-card { display: flex; flex-direction: column; gap: 2px; min-width: 0; padding: 12px 14px; border: 0.5px solid var(--dsw-alias-border-l1); border-radius: 14px; background: var(--dsw-alias-bg-layer-2); }
.bt-card-label { font-size: 12px; color: var(--dsw-alias-label-secondary); }
.bt-card-value { display: flex; align-items: baseline; gap: 4px; font-size: 22px; font-weight: 600; line-height: 30px; font-variant-numeric: tabular-nums; }
.bt-card-unit { font-size: 12px; font-weight: 400; color: var(--dsw-alias-label-tertiary); }
.bt-card-foot { font-size: 11px; line-height: 16px; color: var(--dsw-alias-label-tertiary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.bt-supp-strip { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.bt-supp-chip { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 5px; max-width: 100%; padding: 5px 10px; border: 0.5px solid var(--dsw-alias-border-l1); border-radius: 999px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.bt-supp-time { white-space: normal; }
.bt-supp-chip.is-done { border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary) 42%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 9%, transparent); color: var(--dsw-alias-state-success-primary); }
.bt-supp-chip.is-partial { border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 45%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 9%, transparent); color: var(--dsw-alias-state-warn-primary); }
.bt-supp-time { font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.bt-supp-chip.is-done .bt-supp-time { color: var(--dsw-alias-state-success-primary); opacity: 0.8; }

.bt-section { margin-top: 18px; }
.bt-section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
.bt-section-title { margin: 0; font-size: 13px; font-weight: 500; }
.bt-section-meta { font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.bt-periods { display: flex; flex-direction: column; gap: 6px; margin: 0; padding: 0; list-style: none; }
.bt-period { display: grid; grid-template-columns: 46px minmax(0, 1fr) auto; align-items: center; gap: 10px; font-size: 12px; }
.bt-period-label { color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; }
.bt-period-track { height: 8px; border-radius: 999px; background: var(--dsw-alias-bg-layer-2); overflow: hidden; }
.bt-period-fill { display: block; height: 100%; min-width: 2px; border-radius: 999px; background: var(--dsw-alias-brand-primary); opacity: 0.85; }
.bt-period-value { color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; white-space: nowrap; }

.bt-timeline { display: flex; flex-direction: column; gap: 2px; margin: 0; padding: 0; list-style: none; }
.bt-entry { display: flex; align-items: center; gap: 10px; padding: 7px 6px; border-radius: 10px; }
@media (hover: hover) { .bt-entry:hover { background: var(--dsw-alias-interactive-bg-hover); } }
.bt-entry-icon { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent); color: var(--dsw-alias-brand-primary); }
.bt-entry-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.bt-entry-line { display: flex; align-items: baseline; gap: 8px; min-width: 0; }
.bt-entry-time { flex: none; font-size: 12px; color: var(--dsw-alias-label-tertiary); font-variant-numeric: tabular-nums; }
.bt-entry-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
.bt-entry-note { flex: none; max-width: 40%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.bt-entry-sub { font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.bt-entry-actions { flex: none; display: flex; align-items: center; gap: 2px; opacity: 0; }
.bt-entry:hover .bt-entry-actions, .bt-entry:focus-within .bt-entry-actions, .bt-entry-actions.is-open { opacity: 1; }
@media (hover: none) { .bt-entry-actions { opacity: 1; } }
.bt-confirm-label { font-size: 11px; line-height: 16px; color: var(--dsw-alias-state-error-primary); white-space: nowrap; }

.bt-empty { display: flex; flex-direction: column; gap: 4px; margin: 8px 0; padding: 18px 12px; border: 0.5px dashed var(--dsw-alias-border-l2); border-radius: 12px; text-align: center; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-tertiary); }
.bt-empty strong { color: var(--dsw-alias-label-secondary); font-weight: 500; }

.bt-trends-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
.bt-range { display: flex; gap: 4px; padding: 2px; border-radius: 999px; background: var(--dsw-alias-bg-layer-2); }
.bt-range button { height: 26px; padding: 0 10px; border: none; border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12px; cursor: pointer; }
.bt-range button[data-active] { background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); box-shadow: 0 0 0 0.5px var(--dsw-alias-border-l1); }
.bt-charts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
@media (max-width: 860px) { .bt-charts { grid-template-columns: 1fr; } }
.bt-chart-card { display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 12px 14px 14px; border: 0.5px solid var(--dsw-alias-border-l1); border-radius: 14px; background: var(--dsw-alias-bg-layer-2); }
.bt-chart-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.bt-chart-title { margin: 0; font-size: 13px; font-weight: 500; }
.bt-chart-hint { font-size: 11px; line-height: 16px; color: var(--dsw-alias-label-tertiary); }
.bt-chart { width: 100%; min-height: 120px; }
.bt-chart-summary { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px; margin-bottom: 2px; font-size: 11px; line-height: 16px; color: var(--dsw-alias-label-secondary); }
.bt-day-nav { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.bt-day-button { flex: none; width: 26px; height: 26px; padding: 0; border: 0.5px solid var(--dsw-alias-border-l1); border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: 16px; line-height: 1; cursor: pointer; }
.bt-day-button:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.bt-day-button:disabled { opacity: 0.35; cursor: default; }
.bt-day-label { font-size: 12px; color: var(--dsw-alias-label-primary); }
.bt-chart-summary b { font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--dsw-alias-label-primary); }
.bt-chart-sep { color: var(--dsw-alias-label-tertiary); margin: 0 2px; }
.bt-legend { display: flex; flex-wrap: wrap; gap: 10px; }
.bt-legend-item { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--dsw-alias-label-tertiary); }
.bt-swatch { width: 8px; height: 8px; border-radius: 2px; }

.bt-days { display: flex; flex-direction: column; gap: 18px; }
.bt-day-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; padding-bottom: 6px; border-bottom: 0.5px solid var(--dsw-alias-border-l1); }
.bt-day-title { font-size: 13px; font-weight: 500; }
.bt-day-meta { font-size: 11px; color: var(--dsw-alias-label-tertiary); }

.bt-settings { display: flex; flex-direction: column; gap: 20px; max-width: 520px; }
.bt-settings-group { display: flex; flex-direction: column; gap: 10px; }
.bt-settings-title { margin: 0; font-size: 13px; font-weight: 500; }
.bt-actions-row { display: flex; flex-wrap: wrap; gap: 8px; }
.bt-mono { margin: 0; font-family: var(--dsh-font-mono, ui-monospace, monospace); font-size: 11px; line-height: 17px; word-break: break-all; color: var(--dsw-alias-label-secondary); }
.bt-import-confirm { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 10px; border-radius: 10px; background: var(--dsw-alias-bg-layer-2); font-size: 12px; color: var(--dsw-alias-label-secondary); }
.bt-state { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding: 28px 8px; font-size: 13px; color: var(--dsw-alias-label-secondary); }
.bt-state-error { margin: 0; color: var(--dsw-alias-state-error-primary); }
.bt-crash { display: flex; flex-direction: column; gap: 10px; padding: 16px; border: 0.5px solid var(--dsw-alias-state-error-primary); border-radius: 12px; }
.bt-crash-detail { margin: 0; max-height: 180px; overflow: auto; font-family: var(--dsh-font-mono, ui-monospace, monospace); font-size: 11px; line-height: 17px; white-space: pre-wrap; color: var(--dsw-alias-state-error-primary); }

.bt-supp { display: flex; flex-direction: column; gap: 6px; padding-top: 4px; }
.bt-supp-days { display: grid; grid-template-columns: 62px repeat(7, minmax(0, 1fr)); gap: 4px; }
.bt-supp-row { display: grid; grid-template-columns: 62px repeat(7, minmax(0, 1fr)); gap: 4px; align-items: center; }
.bt-supp-name { font-size: 11px; color: var(--dsw-alias-label-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bt-supp-day { font-size: 9px; text-align: center; color: var(--dsw-alias-label-tertiary); }
.bt-supp-cell { display: flex; align-items: center; justify-content: center; height: 22px; border-radius: 6px; background: var(--dsw-alias-bg-base); font-size: 10px; color: var(--dsw-alias-label-tertiary); }
.bt-supp-cell[data-done] { background: color-mix(in srgb, var(--dsw-alias-state-success-primary) 16%, transparent); color: var(--dsw-alias-state-success-primary); }
.bt-supp-cell[data-partial] { background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 14%, transparent); color: var(--dsw-alias-state-warn-primary); }
.bt-supp-fraction { font-size: 9px; font-weight: 600; font-variant-numeric: tabular-nums; }
`

    // ───────────────────────────── 装配 ─────────────────────────────

    return {
      inject: ['slots', 'connection'],
      apply(ctx) {
        const store = createStore(START)
        let loading = null
        let noticeTimer = null

        // 走 Connection 的传输层：普通网页用同源 fetch，桌面静态壳用
        // __DSH_TRANSPORT__.fetch 解析文档相对路径。
        const transport = typeof globalThis !== 'undefined' ? globalThis.__DSH_TRANSPORT__ : undefined
        const send = transport && typeof transport.fetch === 'function'
          ? (input, init) => transport.fetch(input, init)
          : (input, init) => globalThis.fetch(input, init)

        const call = async (endpoint, payload) => {
          const response = await send(ROUTE, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ endpoint, payload: payload === undefined ? null : payload }),
          })
          if (!response || !response.ok) {
            const status = response ? response.status : 0
            if (status === 401 || status === 403) throw new Error(t('authFailed'))
            if (status === 0 || status >= 500) throw new Error(t('networkFailed'))
            throw new Error('HTTP ' + status)
          }
          const result = await response.json()
          if (!result || result.ok !== true) {
            const error = result && result.error ? result.error : { message: 'request failed' }
            throw new Error(error.message || 'request failed')
          }
          return result.value
        }

        const load = force => {
          if (loading) return loading
          const current = store.get()
          if (!force && current.data && Date.now() - current.loadedAt < 30000) return Promise.resolve()
          store.set({ phase: 'loading', error: null })
          loading = call('state/read').then(
            data => { store.set({ data, phase: 'ready', error: null, loadedAt: Date.now() }) },
            error => {
              const message = messageOf(error, key => DICT.zh[key] || key)
              if (store.get().data) {
                store.set({ phase: 'ready', error: null })
                setNotice({ kind: 'error', text: message })
              } else {
                store.set({ phase: 'error', error: message })
              }
            }
          ).then(() => { loading = null })
          return loading
        }

        const setNotice = notice => {
          if (noticeTimer) window.clearTimeout(noticeTimer)
          noticeTimer = null
          store.set({ notice })
          if (notice) {
            noticeTimer = window.setTimeout(() => {
              noticeTimer = null
              store.set({ notice: null })
            }, 5000)
          }
        }

        const actions = {
          toggle() {
            if (store.get().open) actions.close()
            else {
              store.set({ open: true, tab: store.get().tab || 'today' })
              load(false)
            }
          },
          close() { store.set({ open: false, editing: null, dirty: false }) },
          setTab(tab) { store.set({ tab }) },
          refresh() { return load(true) },
          setNotice,
          setDirty(flag) {
            if (store.get().dirty === flag) return
            store.set({ dirty: flag })
          },
          edit(entry) { store.set({ editing: entry, tab: 'today' }) },
          cancelEdit() { store.set({ editing: null }) },
          async saveEntry(id, entry) {
            store.set({ saving: true, notice: null })
            try {
              const data = await call('entry/save', { id: id || null, entry })
              store.set({ data, saving: false, editing: null, loadedAt: Date.now() })
              return true
            } catch (error) {
              store.set({ saving: false })
              setNotice({ kind: 'error', text: messageOf(error, key => DICT.zh[key] || key) })
              return false
            }
          },
          async deleteEntry(id) {
            try {
              const data = await call('entry/delete', { id })
              store.set({ data, editing: null, loadedAt: Date.now() })
              setNotice({ kind: 'success', text: t('deleted') })
              return true
            } catch (error) {
              setNotice({ kind: 'error', text: messageOf(error, key => DICT.zh[key] || key) })
              return false
            }
          },
          async saveBaby(baby) {
            store.set({ saving: true })
            try {
              const data = await call('baby/save', baby)
              store.set({ data, saving: false, loadedAt: Date.now() })
              return true
            } catch (error) {
              store.set({ saving: false })
              setNotice({ kind: 'error', text: messageOf(error, key => DICT.zh[key] || key) })
              return false
            }
          },
          async replaceData(payload) {
            store.set({ saving: true })
            try {
              const data = await call('data/replace', { data: payload })
              store.set({ data, saving: false, editing: null, loadedAt: Date.now() })
              return data
            } catch (error) {
              store.set({ saving: false })
              setNotice({ kind: 'error', text: messageOf(error, key => DICT.zh[key] || key) })
              return null
            }
          },
        }

        const locale = ctx.get('locale')
        let t = (key, params) => {
          let text = DICT.zh[key] || key
          if (params) for (const name of Object.keys(params)) text = text.split('{' + name + '}').join(String(params[name]))
          return text
        }
        const lang = () => {
          try { return locale ? locale.getSnapshot().id : 'zh' } catch { return 'zh' }
        }

        ctx.effect(() => {
          const style = document.createElement('style')
          style.setAttribute('data-baby-diary', '')
          style.textContent = CSS
          document.head.appendChild(style)
          return () => style.remove()
        }, 'baby-diary: styles')

        if (locale) {
          ctx.effect(() => {
            const offZh = locale.register(NS, 'zh', DICT.zh)
            const offEn = locale.register(NS, 'en', DICT.en)
            t = locale.bind(NS)
            return () => { offZh(); offEn() }
          }, 'baby-diary: locale dictionaries')
          ctx.effect(() => locale.subscribe(() => store.set({ tick: Date.now() })), 'baby-diary: locale changes')
        }

        const app = { store, actions, t: (key, params) => t(key, params), lang }
        const WithApp = Component => props => h(AppContext.Provider, { value: app }, h(Component, props))

        ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
          name: 'sidebar.footer.action',
          id: 'baby-diary',
          order: 5,
          label: () => app.t('title'),
        }, WithApp(FooterAction)))

        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'baby-diary-panel',
          order: 40,
          label: () => app.t('title'),
        }, WithApp(Panel)))

        // 启动时静默预热一次，让入口的首次点击直接有内容。
        ctx.effect(() => {
          void load(false)
        }, 'baby-diary: initial read')
      },
    }
  },
})
