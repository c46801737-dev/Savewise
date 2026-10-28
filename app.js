/* ==========================================================
   SaveWise — app logic
   一个纯前端的记账应用：数据存在浏览器 localStorage 里。
   分四块：词典 → 数据 → 计算 → 渲染 & 事件
   ========================================================== */

/* ---------------- 1. 词典 ---------------- */

const STRINGS = {
  en: {
    'nav.add': 'Add',
    'nav.records': 'Records',
    'nav.insights': 'Insights',
    'nav.ai': 'AI advice',

    'entry.expense': 'Expense',
    'entry.income': 'Income',
    'entry.savings': 'To savings',
    'entry.category': 'Category',
    'entry.date': 'Date',
    'entry.note': 'Note (optional)',
    'entry.notePh': 'e.g. hotpot with roommates',
    'entry.fixed': 'Essential spending',
    'entry.fixedSub': 'Canteen, phone bill, medicine — money you cannot avoid',
    'entry.save': 'Save this entry',
    'entry.saved': 'Saved. Takes three seconds.',
    'entry.pickAmount': 'Enter an amount first.',
    'entry.pickCat': 'Pick a category.',
    'entry.savingsHint': 'Moving money into savings is not spending. It only counts towards your monthly rule.',

    'list.balance': 'Left this month',
    'list.spent': 'Spent',
    'list.received': 'Received',
    'list.entries': 'Entries',
    'list.empty': 'Nothing here yet.\nTap “Add” and record your first expense.',
    'list.total': 'day total',
    'list.today': 'Today',
    'list.yesterday': 'Yesterday',

    'ai.title': 'Ask the AI',
    'ai.tag': 'summarised first',
    'ai.desc': 'SaveWise turns your raw entries into a clean spending snapshot — no shop names, no personal notes. Paste it into any AI chat. That is what makes the advice specific instead of generic.',
    'ai.generate': 'Build the brief',
    'ai.copyHint': 'Copy this and paste it into any AI chat',
    'ai.copy': 'Copy',
    'ai.copied': 'Copied',
    'ai.noData': 'Record at least a few entries first, so there is something to analyse.',

    'note.title': 'Bring the answer back',
    'note.desc': 'Paste what the AI said and keep it with the month. Chat windows forget; your ledger does not.',
    'note.ph': 'Paste the AI’s advice here…',
    'note.save': 'Save for this month',
    'note.saved': 'Saved for this month.',
    'note.empty': 'Nothing saved for this month yet.',
    'note.savedAt': 'Saved {d}',

    'sav.title': 'Savings',
    'sav.tag': 'your own rule',
    'sav.aim': 'I put aside each month',
    'sav.put': 'Put aside this month',
    'sav.free': 'Free after essentials',
    'sav.cap': 'Cap for flexible spending',
    'sav.actual': 'Flexible spending so far',
    'sav.over': 'Over your cap by {gap}. That is the number to take to the AI.',
    'sav.ok': 'Under your cap by {gap}. Nothing needs fixing this month.',
    'sav.noIncome': 'No income recorded this month — using {m} instead.',
    'sav.needIncome': 'Record your allowance or part-time pay, then this page can do the maths.',
    'sav.hint': 'This is a rule you set, not a form to fill. Change it any time — the cap moves with it.',

    'method.title': 'How the numbers work',
    'method.income': 'Income recorded',
    'method.essential': 'Essential spending',
    'method.free': 'Money you can actually choose',
    'method.needed': 'Your monthly savings rule',
    'method.cap': 'Spending cap for flexible items',
    'method.note': 'These five figures are pure arithmetic — done by the app, not by the AI. The AI is only asked one question: where inside that cap should the money come from?',

    'stat.title': 'Where the money went',
    'stat.fixed': 'Essential',
    'stat.flex': 'Flexible',
    'stat.rate': 'Saved rate',
    'stat.none': 'No spending recorded this month.',

    'set.sample': 'Load sample data',
    'set.sampleTip': 'Sample data loaded for the last two months.',

    'data.title': 'Your data',
    'data.export': 'Export backup',
    'data.import': 'Restore backup',
    'data.clear': 'Clear all',
    'data.stats': '{n} entries recorded. Everything stays in this browser — nothing is uploaded.',
    'data.statsWarn': '{n} entries. This browser is the only copy — export a backup before you switch device.',
    'data.confirmClear': 'Delete all entries and settings? This cannot be undone.',
    'data.cleared': 'All data removed.',
    'data.importBad': 'That file is not a SaveWise backup. Nothing was changed.',
    'data.importDone': 'Restored {added} entries from the backup. {skipped} were already here.',
    'data.importNone': 'Every entry in that backup is already in this browser.',
    'data.restoreHint': 'Restoring adds the backup\u2019s entries to what is already here and skips duplicates. It never deletes anything.',
    'data.privacy': 'Nothing leaves this browser. There is no account, no server, and no upload.'
  },

  zh: {
    'nav.add': '记一笔',
    'nav.records': '账单',
    'nav.insights': '分析',
    'nav.ai': 'AI 建议',

    'entry.expense': '支出',
    'entry.income': '收入',
    'entry.savings': '存入存款',
    'entry.category': '分类',
    'entry.date': '日期',
    'entry.note': '备注（可选）',
    'entry.notePh': '例如：和室友吃火锅',
    'entry.fixed': '计入刚性支出',
    'entry.fixedSub': '食堂、话费、买药这类躲不掉的钱',
    'entry.save': '保存这笔',
    'entry.saved': '已记录，三秒钟搞定。',
    'entry.pickAmount': '请先填写金额。',
    'entry.pickCat': '请选择一个分类。',
    'entry.savingsHint': '转入存款不算花掉，它只用来对照你每月给自己定的那个数。',

    'list.balance': '本月结余',
    'list.spent': '支出',
    'list.received': '收入',
    'list.entries': '笔数',
    'list.empty': '还没有记录。\n点「记一笔」开始记第一笔吧。',
    'list.total': '当日合计',
    'list.today': '今天',
    'list.yesterday': '昨天',

    'ai.title': '问 AI',
    'ai.tag': '先聚合再提问',
    'ai.desc': '系统已把流水汇总成结构化的消费快照——不包含店铺名和私人备注。复制出去贴给任何 AI 都行。这才是建议能具体、而不是空话的原因。',
    'ai.generate': '生成分析数据',
    'ai.copyHint': '复制下面这段，粘贴到任意 AI 对话框',
    'ai.copy': '复制',
    'ai.copied': '已复制',
    'ai.noData': '先记几笔，才有东西可分析。',

    'note.title': '把回答存回来',
    'note.desc': '把 AI 说的贴进来，和这个月一起存着。聊天窗口会忘，账本不会。',
    'note.ph': '把 AI 的建议粘贴到这里…',
    'note.save': '存到本月',
    'note.saved': '已存到本月。',
    'note.empty': '这个月还没存过。',
    'note.savedAt': '存于 {d}',

    'sav.title': '储蓄',
    'sav.tag': '你自己定的规矩',
    'sav.aim': '我每月打算存',
    'sav.put': '本月已存',
    'sav.free': '可自由支配',
    'sav.cap': '弹性支出上限',
    'sav.actual': '实际弹性支出',
    'sav.over': '超出上限 {gap}。这就是要拿去问 AI 的那个数。',
    'sav.ok': '比上限低 {gap}，这个月没什么要修的。',
    'sav.noIncome': '本月还没记收入，暂用 {m} 的数据。',
    'sav.needIncome': '先把生活费或兼职记一笔，这一页才算得出来。',
    'sav.hint': '这是你给自己定的规矩，不是一张要填的表。随时能改，上限跟着动。',

    'method.title': '这些数字怎么来的',
    'method.income': '本月记下的收入',
    'method.essential': '刚性支出',
    'method.free': '真正可自由支配的钱',
    'method.needed': '你每月打算存',
    'method.cap': '弹性支出上限',
    'method.note': '这五个数字是纯算术，由应用算，不交给 AI。AI 只被问一个问题：在这个上限之内，钱该从哪一类里省出来？',

    'stat.title': '钱花在哪了',
    'stat.fixed': '刚性',
    'stat.flex': '弹性',
    'stat.rate': '储蓄率',
    'stat.none': '本月还没有支出记录。',

    'set.sample': '载入示例数据',
    'set.sampleTip': '已载入最近两个月的示例数据。',

    'data.title': '数据管理',
    'data.export': '导出备份',
    'data.import': '恢复备份',
    'data.clear': '清空全部',
    'data.stats': '共 {n} 笔记录。全部存在这台设备的浏览器里，不会上传到任何地方。',
    'data.statsWarn': '共 {n} 笔。这份数据只在这个浏览器里 —— 换设备前请先导出备份。',
    'data.confirmClear': '确定删除全部记录和设置？此操作无法撤销。',
    'data.cleared': '已清空全部数据。',
    'data.importBad': '这个文件不是 SaveWise 的备份，数据没有被改动。',
    'data.importDone': '已从备份恢复 {added} 笔，跳过 {skipped} 笔已存在的记录。',
    'data.importNone': '这份备份里的记录，这个浏览器里已经全都有了。',
    'data.restoreHint': '恢复是把备份里的记录并入现有数据，重复的自动跳过，不会删掉任何东西。',
    'data.privacy': '数据不离开这个浏览器。没有账号，没有服务器，也不上传。'
  }
};

/* ---------------- 2. 分类与常量 ---------------- */

const CATS = {
  expense: [
    { id: 'delivery',  en: 'Delivery',   zh: '外卖', fixed: false },
    { id: 'canteen',   en: 'Canteen',    zh: '食堂', fixed: true  },
    { id: 'eatingout', en: 'Eating out', zh: '外食', fixed: false },
    { id: 'snacks',    en: 'Snacks',     zh: '零食', fixed: false },
    { id: 'transport', en: 'Transport',  zh: '交通', fixed: false },
    { id: 'clothing',  en: 'Clothing',   zh: '服饰', fixed: false },
    { id: 'daily',     en: 'Daily',      zh: '日用', fixed: false },
    { id: 'fun',       en: 'Fun',        zh: '娱乐', fixed: false },
    { id: 'study',     en: 'Study',      zh: '学习', fixed: false },
    { id: 'phone',     en: 'Phone',      zh: '话费', fixed: true  },
    { id: 'health',    en: 'Health',     zh: '医疗', fixed: true  },
    { id: 'other',     en: 'Other',      zh: '其他', fixed: false }
  ],
  income: [
    { id: 'allowance',   en: 'Allowance',   zh: '生活费', fixed: true  },
    { id: 'parttime',    en: 'Part-time',   zh: '兼职',   fixed: false },
    { id: 'scholarship', en: 'Scholarship', zh: '奖学金', fixed: false },
    { id: 'otherIn',     en: 'Other',       zh: '其他',   fixed: false }
  ],
  /* 存款不是花掉，也不是收入：它是一笔转账，只用来对照每月的规矩 */
  savings: [
    { id: 'deposit', en: 'Moved to savings', zh: '存入存款', fixed: false }
  ]
};

const STORE_KEY = 'savewise.v3';

/* ---------------- 3. 数据层 ---------------- */

let data = loadData();

function loadData() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        tx: Array.isArray(parsed.tx) ? parsed.tx : [],
        settings: Object.assign(defaultSettings(), parsed.settings || {}),
        aiNotes: (parsed.aiNotes && typeof parsed.aiNotes === 'object') ? parsed.aiNotes : {},
        lang: parsed.lang === 'zh' ? 'zh' : 'en'
      };
    }
  } catch (e) {
    console.warn('读取本地数据失败，使用空白数据。', e);
  }
  return { tx: [], settings: defaultSettings(), aiNotes: {}, lang: 'en' };
}

function defaultSettings() {
  return {
    monthlySave: 0
  };
}

function saveData() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('保存失败，可能是浏览器存储空间已满。', e);
  }
}

/* 临时界面状态（不持久化） */
const state = { view: 'entry', type: 'expense', cat: null, month: thisMonthKey() };

/* ---------------- 4. 工具函数 ---------------- */

function t(key) {
  const dict = STRINGS[data.lang] || STRINGS.en;
  return dict[key] !== undefined ? dict[key] : (STRINGS.en[key] || key);
}

function allCats() {
  return CATS.expense.concat(CATS.income).concat(CATS.savings);
}

function catName(id) {
  const c = allCats().find(x => x.id === id);
  if (!c) return id;
  return data.lang === 'en' ? c.en : c.zh;
}

function catFixed(id) {
  const c = allCats().find(x => x.id === id);
  return c ? c.fixed : false;
}

function money(n, decimals) {
  const d = decimals === undefined ? 2 : decimals;
  return '¥' + Number(n || 0).toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function pad(n) { return n < 10 ? '0' + n : String(n); }

function thisMonthKey() {
  const d = new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1);
}

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

function prevMonthKey(ym) {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1);
}

function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  if (data.lang === 'zh') return y + ' 年 ' + m + ' 月';
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function dayLabel(dateStr) {
  if (dateStr === todayStr()) return t('list.today');
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yest = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  if (dateStr === yest) return t('list.yesterday');

  const [y, m, dd] = dateStr.split('-').map(Number);
  if (data.lang === 'zh') return m + ' 月 ' + dd + ' 日';
  return new Date(y, m - 1, dd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ---------------- 5. 计算 ---------------- */

function monthStats(ym) {
  const tx = data.tx.filter(x => (x.date || '').slice(0, 7) === ym);
  let expense = 0, income = 0, saved = 0, fixed = 0, flex = 0;
  const byCat = {};

  for (const x of tx) {
    const amt = Number(x.amount) || 0;
    if (x.type === 'income') {
      income += amt;
    } else if (x.type === 'savings') {
      saved += amt;
    } else {
      expense += amt;
      byCat[x.cat] = (byCat[x.cat] || 0) + amt;
      if (x.fixed) fixed += amt; else flex += amt;
    }
  }

  return {
    tx: tx,
    expense: expense,
    income: income,
    saved: saved,
    balance: income - expense,
    count: tx.length,
    fixed: fixed,
    flex: flex,
    byCat: byCat
  };
}

/* 收入从记录里来。当月没记，就沿用最近一个有收入的月份，并标记出来。 */
function incomeFor (ym) {
  const direct = monthStats(ym).income;
  if (direct > 0) return { amount: direct, from: ym, carried: false };

  let k = ym;
  for (let i = 0; i < 6; i++) {
    k = prevMonthKey(k);
    const v = monthStats(k).income;
    if (v > 0) return { amount: v, from: k, carried: true };
  }
  return { amount: 0, from: '', carried: false };
}

/* 五个数字——纯算术，不经过 AI */
function planNumbers(cur, ym) {
  const inc = incomeFor(ym || state.month);
  const income = inc.amount;
  const essential = cur.fixed;
  const free = income - essential;
  const monthlySave = Number(data.settings.monthlySave) || 0;
  const cap = free - monthlySave;

  return {
    income: income,
    incomeFrom: inc.from,
    incomeCarried: inc.carried,
    essential: essential,
    free: free,
    monthlySave: monthlySave,
    cap: cap,
    saved: cur.saved,
    gap: cur.flex - cap
  };
}

/* ---------------- 6. 渲染：通用 ---------------- */

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val.indexOf('\n') >= 0) {
      el.innerHTML = val.split('\n').map(l => esc(l)).join('<br>');
    } else {
      el.textContent = val;
    }
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
  });
  document.documentElement.lang = data.lang === 'zh' ? 'zh-CN' : 'en';
  document.getElementById('lang-btn').textContent = data.lang === 'en' ? '中文' : 'EN';
}

function renderCategories() {
  const grid = document.getElementById('category-grid');
  const list = CATS[state.type] || CATS.expense;
  grid.innerHTML = list.map(c => {
    const active = state.cat === c.id ? ' active' : '';
    return '<button class="cat-btn' + active + '" data-cat="' + c.id + '">' +
             '<span class="dot"></span><span>' + esc(data.lang === 'en' ? c.en : c.zh) + '</span>' +
           '</button>';
  }).join('');
  syncEntryForm();
}

/* 分类和「刚性/弹性」都只属于支出：收入不分躲不躲，存款只有一个去向 */
function syncEntryForm() {
  const isExpense = state.type === 'expense';
  const isSavings = state.type === 'savings';

  const fixedRow = document.getElementById('fixed-row');
  if (fixedRow) {
    fixedRow.classList.toggle('hidden', !isExpense);
    if (!isExpense) document.getElementById('is-fixed').checked = false;
  }

  const catField = document.getElementById('cat-field');
  if (catField) catField.classList.toggle('hidden', isSavings);

  const hint = document.getElementById('savings-hint');
  if (hint) hint.classList.toggle('hidden', !isSavings);

  if (isSavings) state.cat = 'deposit';
}

function renderAll() {
  applyI18n();
  renderCategories();
  renderList();
  renderAnalysis();
  renderAI();
  renderDataStats();
  updateTitle();
}

function updateTitle() {
  const map = { entry: 'nav.add', list: 'nav.records', analysis: 'nav.insights', ai: 'nav.ai' };
  document.getElementById('page-title').textContent = t(map[state.view] || 'nav.add');
}

/* ---------------- 7. 渲染：账单 ---------------- */

function renderList() {
  const ym = state.month;
  const cur = monthStats(ym);

  document.getElementById('current-month').textContent = monthLabel(ym);
  document.getElementById('month-balance').textContent = money(cur.balance);
  document.getElementById('month-expense').textContent = money(cur.expense, 0);
  document.getElementById('month-income').textContent = money(cur.income, 0);
  document.getElementById('month-count').textContent = cur.count;

  const container = document.getElementById('list-container');

  if (!cur.tx.length) {
    container.innerHTML = '<div class="empty">' + esc(t('list.empty')).replace(/\n/g, '<br>') + '</div>';
    return;
  }

  // 按日期分组，日期从新到旧
  const groups = {};
  for (const x of cur.tx) {
    const d = x.date || '';
    if (!groups[d]) groups[d] = [];
    groups[d].push(x);
  }

  const dates = Object.keys(groups).sort().reverse();
  let html = '';

  for (const d of dates) {
    const items = groups[d].slice().sort((a, b) => (b.ts || 0) - (a.ts || 0));
    const dayTotal = items.reduce((s, x) => s + (x.type === 'expense' ? Number(x.amount) : 0), 0);

    html += '<div class="day-group">';
    html += '<div class="day-head"><span>' + esc(dayLabel(d)) + '</span>' +
            '<span>' + money(dayTotal, 0) + '</span></div>';

    for (const x of items) {
      const sign = x.type === 'income' ? '+' : (x.type === 'savings' ? '→' : '−');
      const amtCls = x.type === 'income' ? ' income' : (x.type === 'savings' ? ' savings' : '');

      // 副行：刚性标记 + 备注，两者都没有就不占位
      const bits = [];
      if (x.fixed && x.type === 'expense') bits.push(t('stat.fixed'));
      if (x.note) bits.push(x.note);
      const sub = bits.join(' · ');

      html += '<div class="entry">' +
                '<div class="entry-line">' +
                  '<span class="entry-name">' + esc(catName(x.cat)) + '</span>' +
                  '<span class="dots"></span>' +
                  '<span class="entry-amt' + amtCls + '">' + sign + money(x.amount, 0) + '</span>' +
                '</div>' +
                (sub ? '<div class="entry-sub">' + esc(sub) + '</div>' : '') +
                '<button class="entry-del" data-del="' + x.id + '" aria-label="delete">×</button>' +
              '</div>';
    }
    html += '</div>';
  }

  container.innerHTML = html;
}

/* ---------------- 8. 渲染：分析 ---------------- */

function renderAnalysis() {
  const ym = state.month;
  const cur = monthStats(ym);
  const prev = monthStats(prevMonthKey(ym));
  const plan = planNumbers(cur, ym);

  /* --- 顶部三个数字 --- */
  const saveRate = cur.income > 0 ? Math.round((cur.balance / cur.income) * 100) : 0;
  const fixedPct = cur.expense > 0 ? Math.round((cur.fixed / cur.expense) * 100) : 0;

  let statHtml = '<div class="kpi-row">' +
    '<div class="kpi"><span class="kpi-label">' + esc(t('list.spent')) + '</span>' +
      '<span class="kpi-value">' + money(cur.expense, 0) + '</span></div>' +
    '<div class="kpi"><span class="kpi-label">' + esc(t('stat.fixed')) + '</span>' +
      '<span class="kpi-value">' + fixedPct + '%</span></div>' +
    '<div class="kpi"><span class="kpi-label">' + esc(t('stat.rate')) + '</span>' +
      '<span class="kpi-value">' + saveRate + '%</span></div>' +
  '</div>';

  /* --- 分类条形 --- */
  const cats = Object.keys(cur.byCat)
    .map(id => ({ id: id, amount: cur.byCat[id] }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  if (!cats.length) {
    statHtml += '<div class="bar-block"><div class="empty">' + esc(t('stat.none')) + '</div></div>';
  } else {
    const max = cats[0].amount || 1;
    let bars = '<div class="bar-block"><h2>' + esc(t('stat.title')) + '</h2>';

    for (const c of cats) {
      const pct = cur.expense > 0 ? Math.round((c.amount / cur.expense) * 100) : 0;
      const width = Math.max(4, Math.round((c.amount / max) * 100));
      const isFixed = catFixed(c.id);
      const before = prev.byCat[c.id] || 0;
      let delta = '';
      if (before > 0) {
        const change = Math.round(((c.amount - before) / before) * 100);
        if (Math.abs(change) >= 5) {
          delta = '<span class="delta ' + (change > 0 ? 'up' : 'down') + '">' +
                  (change > 0 ? '+' : '') + change + '%</span>';
        }
      }

      bars += '<div class="bar-row">' +
                '<div class="bar-label">' +
                  '<span class="name">' + esc(catName(c.id)) + delta + '</span>' +
                  '<span class="val">' + money(c.amount, 0) + ' · ' + pct + '%</span>' +
                '</div>' +
                '<div class="bar-track">' +
                  '<div class="bar-fill' + (isFixed ? ' fixed' : '') + '" style="width:' + width + '%"></div>' +
                '</div>' +
              '</div>';
    }
    bars += '</div>';
    statHtml += bars;
  }

  document.getElementById('stat-block').innerHTML = statHtml;

  renderSavings(cur, plan);

  /* --- 公式区 --- */
  document.getElementById('f-income').textContent = plan.income ? money(plan.income, 0) : '—';
  document.getElementById('f-essential').textContent = cur.expense ? '−' + money(plan.essential, 0) : '—';
  document.getElementById('f-free').textContent = plan.income ? money(plan.free, 0) : '—';
  document.getElementById('f-needed').textContent = plan.monthlySave ? '−' + money(plan.monthlySave, 0) : '—';
  document.getElementById('f-cap').textContent = plan.income ? money(plan.cap, 0) : '—';
}

/* ---------------- 9. 渲染：储蓄 ---------------- */

function renderSavings(cur, plan) {
  const box = document.getElementById('savings-block');
  if (!box) return;

  const aim = Number(data.settings.monthlySave) || 0;

  let html = '<div class="sav-aim">' +
    '<label for="monthly-save">' + esc(t('sav.aim')) + '</label>' +
    '<div class="sav-input"><span>¥</span>' +
      '<input id="monthly-save" type="number" inputmode="decimal" min="0" step="10" value="' +
      (aim ? aim : '') + '" placeholder="800">' +
    '</div>' +
  '</div>';

  if (!plan.income) {
    html += '<p class="card-desc" style="margin:14px 0 0">' + esc(t('sav.needIncome')) + '</p>';
    box.innerHTML = html;
    return;
  }

  const gap = plan.gap;

  html += '<div class="sav-figures">' +
    row(t('sav.put'), money(cur.saved, 0), cur.saved > 0 ? 'good' : '') +
    row(t('sav.free'), money(plan.free, 0), '') +
    row(t('sav.cap'), money(plan.cap, 0), '') +
    row(t('sav.actual'), money(cur.flex, 0), gap > 0 ? 'warn' : '') +
  '</div>';

  const statusCls = gap > 0 ? 'tight' : 'ok';
  const statusTxt = gap > 0
    ? t('sav.over').replace('{gap}', money(gap, 0))
    : t('sav.ok').replace('{gap}', money(-gap, 0));

  html += '<div class="goal-status ' + statusCls + '">' + esc(statusTxt) + '</div>';

  if (plan.incomeCarried) {
    html += '<p class="sav-note">' + esc(t('sav.noIncome').replace('{m}', monthLabel(plan.incomeFrom))) + '</p>';
  }

  html += '<p class="card-desc small">' + esc(t('sav.hint')) + '</p>';

  box.innerHTML = html;

  function row(label, value, cls) {
    return '<div class="sav-row">' +
             '<span>' + esc(label) + '</span>' +
             '<b class="' + cls + '">' + value + '</b>' +
           '</div>';
  }
}

/* ---------------- 9b. 渲染：AI 页 ---------------- */

function renderAI() {
  const box = document.getElementById('note-text');
  if (!box) return;

  const rec = data.aiNotes[state.month];
  box.value = rec && rec.text ? rec.text : '';

  document.getElementById('note-status').textContent =
    rec && rec.text ? t('note.savedAt').replace('{d}', shortDate(rec.ts)) : t('note.empty');
}

function shortDate(ts) {
  const d = new Date(Number(ts) || Date.now());
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

/* ---------------- 9c. 渲染：数据管理弹层 ---------------- */

function renderDataStats() {
  const el = document.getElementById('data-stats');
  if (!el) return;
  el.textContent = (data.tx.length ? t('data.statsWarn') : t('data.stats'))
    .replace('{n}', data.tx.length);
}

/* ---------------- 10. AI：生成数据包 ---------------- */

function buildPrompt() {
  const ym = state.month;
  const cur = monthStats(ym);
  const prev = monthStats(prevMonthKey(ym));
  const plan = planNumbers(cur, ym);
  const isEn = data.lang === 'en';

  if (!cur.tx.length) return '';

  const rows = Object.keys(cur.byCat)
    .map(id => ({ id: id, amount: cur.byCat[id] }))
    .sort((a, b) => b.amount - a.amount)
    .map(c => {
      const pct = cur.expense > 0 ? Math.round((c.amount / cur.expense) * 100) : 0;
      const before = prev.byCat[c.id] || 0;
      let change = isEn ? 'no data last month' : '上月无数据';
      if (before > 0) {
        const d = Math.round(((c.amount - before) / before) * 100);
        change = (d > 0 ? '+' : '') + d + '%';
      }
      const kind = catFixed(c.id) ? (isEn ? 'essential' : '刚性') : (isEn ? 'flexible' : '弹性');
      return '  ' + padCol(catName(c.id), isEn ? 14 : 6) + padCol(money(c.amount, 0), 9) + '  ' +
             padCol(pct + '%', 5) + '  ' + padCol(change, 18) + '  ' + kind;
    }).join('\n');

  const fixedPct = cur.expense > 0 ? Math.round((cur.fixed / cur.expense) * 100) : 0;

  const gapEn = plan.gap > 0
    ? 'My flexible spending is over my cap by ' + money(plan.gap, 0) + '.'
    : 'My flexible spending is still inside my cap.';
  const gapZh = plan.gap > 0
    ? '我的弹性支出超出上限 ' + money(plan.gap, 0) + '。'
    : '我的弹性支出还在上限之内。';

  if (isEn) {
    return [
      'You are a practical personal-finance coach for a university student in Beijing.',
      'The figures below are for ' + monthLabel(ym) + '. Give advice that a student can actually follow.',
      '',
      'INCOME THIS MONTH: ' + money(cur.income, 0),
      'TOTAL SPENT: ' + money(cur.expense, 0),
      'LEFT OVER: ' + money(cur.balance, 0),
      '',
      'SPENDING BY CATEGORY',
      '  category      amount     share   change vs last month   type',
      rows,
      '',
      'ESSENTIAL VS FLEXIBLE',
      '  Essential: ' + money(cur.fixed, 0) + ' (' + fixedPct + '%)',
      '  Flexible:  ' + money(cur.flex, 0) + ' (' + (100 - fixedPct) + '%)',
      '',
      'MY SAVINGS RULE',
      '  I put aside ' + money(plan.monthlySave, 0) + ' per month',
      '  Actually moved to savings this month: ' + money(cur.saved, 0),
      '  Cap left for flexible spending: ' + money(plan.cap, 0),
      '  Flexible spending so far: ' + money(cur.flex, 0),
      '',
      'WHAT I NEED FROM YOU',
      '1. ' + gapEn + ' Pick the two categories where I could realistically cut, and say how much each could free up per month.',
      '2. For each, give one concrete substitution I can actually do as a student. Be specific, not "spend less".',
      '3. Tell me honestly whether my monthly savings rule is realistic. If not, say so and suggest a number that is.',
      '4. Under 300 words. No generic tips like "make a budget".'
    ].join('\n');
  }

  return [
    '你是一位给大学生提供实用建议的个人财务顾问。',
    '以下是' + monthLabel(ym) + '的数据，请给出学生真正做得到的建议。',
    '',
    '本月收入：' + money(cur.income, 0),
    '本月总支出：' + money(cur.expense, 0),
    '本月结余：' + money(cur.balance, 0),
    '',
    '分类支出',
    '  分类        金额      占比    环比上月        属性',
    rows,
    '',
    '刚性与弹性',
    '  刚性：' + money(cur.fixed, 0) + '（' + fixedPct + '%）',
    '  弹性：' + money(cur.flex, 0) + '（' + (100 - fixedPct) + '%）',
    '',
    '我自己定的储蓄规矩',
    '  每月打算存：' + money(plan.monthlySave, 0),
    '  本月实际转入存款：' + money(cur.saved, 0),
    '  弹性支出剩余空间：' + money(plan.cap, 0),
    '  本月弹性支出：' + money(cur.flex, 0),
    '',
    '我需要你给出',
    '1. ' + gapZh + '挑出两类最可能省下钱的支出，说明每类每月大约能省多少。',
    '2. 每类给一个学生真正能执行的替代方案，要具体，不要说“少花点”。',
    '3. 诚实评估我这个每月存款的规矩是否现实。如果不现实，直接说，并给出一个可行的数字。',
    '4. 三百字以内。不要“做好预算”这类空话。'
  ].join('\n');
}

function padCol(str, len) {
  str = String(str);
  let width = 0;
  for (const ch of str) width += /[\u4e00-\u9fa5]/.test(ch) ? 2 : 1;
  return str + ' '.repeat(Math.max(1, len - width));
}

/* ---------------- 11. （已移除）浏览器直连 AI 接口 ----------------
   原因：那需要让用户在界面上填 API Key / Endpoint / Model 三个技术字段，
   而它同时是整个应用里唯一会在演示现场报错的按钮。
   现在的路线是「生成数据包 → 粘贴到任何 AI → 把回答存回来」，零配置、零失败点。
   ------------------------------------------------------------- */

/* ---------------- 12. 示例数据 ---------------- */

function loadSampleData() {
  const now = new Date();
  const curYm = now.getFullYear() + '-' + pad(now.getMonth() + 1);
  const prevD = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevYm = prevD.getFullYear() + '-' + pad(prevD.getMonth() + 1);

  // 本月只铺到今天，避免出现未来日期
  const dayLimit = Math.min(Math.max(now.getDate(), 12), 28);
  let sampleIndex = 0;
  const existingIds = new Set(data.tx.map(x => x.id));

  const add = (ym, day, cat, amount, fixed, type, note) => {
    const [y, m] = ym.split('-').map(Number);
    const maxDay = new Date(y, m, 0).getDate();
    const d = Math.min(day, maxDay);
    const id = 'sample:' + ym + ':' + (type || 'expense') + ':' + cat + ':' + d + ':' + sampleIndex++;
    if (existingIds.has(id)) return;
    existingIds.add(id);
    data.tx.push({
      id: id,
      amount: Math.round(amount * 100) / 100,
      type: type || 'expense',
      cat: cat,
      date: ym + '-' + pad(d),
      note: note || '',
      fixed: !!fixed,
      ts: Date.now() + Math.floor(Math.random() * 100000)
    });
  };

  // 把 n 笔均匀铺在一个月里
  const spread = (n, limit) => Array.from({ length: n }, (_, i) =>
    Math.max(1, Math.round((i + 1) * limit / n)));

  /* ============ 上月：以食堂为主，几乎不点外卖 ============ */
  spread(24, 28).forEach((d, i) =>
    add(prevYm, d, 'canteen', 12 + (i % 5), true));

  [4, 11, 18, 25, 28].forEach((d, i) =>
    add(prevYm, d, 'delivery', 25 + i * 3, false));

  add(prevYm, 8, 'eatingout', 52, false, 'expense', '室友生日');
  add(prevYm, 21, 'eatingout', 58, false);

  [2, 9, 16, 23].forEach((d, i) => add(prevYm, d, 'snacks', 9 + i * 2, false));
  [3, 6, 10, 13, 17, 20, 24, 27].forEach(d => add(prevYm, d, 'transport', 4, false));
  [7, 15, 26].forEach((d, i) => add(prevYm, d, 'daily', 18 + i * 4, false));
  add(prevYm, 14, 'fun', 55, false, 'expense', '电影');
  add(prevYm, 22, 'study', 45, false, 'expense', '打印装订');
  add(prevYm, 1, 'phone', 39, true);

  add(prevYm, 1, 'allowance', 1500, true, 'income', '生活费');
  add(prevYm, 12, 'parttime', 800, false, 'income', '家教');

  /* ============ 本月：食堂吃得少，外卖和外食翻倍 ============ */
  spread(18, dayLimit).forEach((d, i) =>
    add(curYm, d, 'canteen', 12 + (i % 5), true));

  spread(14, dayLimit).forEach((d, i) =>
    add(curYm, d, 'delivery', 24 + (i % 4) * 4, false));

  add(curYm, Math.round(dayLimit * 0.15), 'eatingout', 68, false, 'expense', '和同学聚餐');
  add(curYm, Math.round(dayLimit * 0.35), 'eatingout', 45, false);
  add(curYm, Math.round(dayLimit * 0.55), 'eatingout', 72, false, 'expense', '生日请客');
  add(curYm, Math.round(dayLimit * 0.75), 'eatingout', 62, false);
  add(curYm, Math.round(dayLimit * 0.92), 'eatingout', 69, false);

  spread(6, dayLimit).forEach((d, i) =>
    add(curYm, d, 'snacks', 8 + (i % 5), false));

  spread(10, dayLimit).forEach((d, i) =>
    add(curYm, d, 'transport', i % 3 === 0 ? 7 : 3, false));

  add(curYm, Math.round(dayLimit * 0.4), 'clothing', 189, false, 'expense', '换季外套');

  spread(5, dayLimit).forEach((d, i) =>
    add(curYm, d, 'daily', 18 + (i % 4) * 5, false));

  add(curYm, Math.round(dayLimit * 0.25), 'fun', 78, false, 'expense', '剧本杀');
  add(curYm, Math.round(dayLimit * 0.6), 'fun', 45, false);
  add(curYm, Math.round(dayLimit * 0.8), 'fun', 62, false, 'expense', 'KTV');
  add(curYm, Math.round(dayLimit * 0.98), 'fun', 40, false);

  add(curYm, Math.round(dayLimit * 0.3), 'study', 45, false, 'expense', '打印装订');
  add(curYm, Math.round(dayLimit * 0.7), 'study', 75, false, 'expense', '专业课参考书');

  add(curYm, 1, 'phone', 39, true);
  add(curYm, Math.round(dayLimit * 0.5), 'health', 45, true, 'expense', '感冒药');

  add(curYm, 1, 'allowance', 1500, true, 'income', '生活费');
  add(curYm, Math.round(dayLimit * 0.45), 'parttime', 800, false, 'income', '家教');

  /* ============ 目标设定 ============ */
  /* ============ 存款：每月转一笔进去 ============ */
  add(prevYm, 5, 'deposit', 300, false, 'savings', '转进零钱通');
  add(curYm, Math.round(dayLimit * 0.4), 'deposit', 500, false, 'savings', '转进零钱通');

  /* ============ 规矩：每月存 800 ============ */
  data.settings.monthlySave = 800;

  saveData();
}

/* ---------------- 13. 事件绑定 ---------------- */

function bindEvents() {

  /* --- 底部导航 --- */
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.view = btn.getAttribute('data-view');
      document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.view').forEach(v =>
        v.classList.toggle('active', v.id === 'view-' + state.view));
      updateTitle();
      document.getElementById('content').scrollTop = 0;
    });
  });

  /* --- 语言切换 --- */
  document.getElementById('lang-btn').addEventListener('click', () => {
    data.lang = data.lang === 'en' ? 'zh' : 'en';
    saveData();
    renderAll();
  });

  /* --- 支出 / 收入 / 存款 切换 --- */
  document.querySelectorAll('.seg').forEach(btn => {
    btn.addEventListener('click', () => {
      state.type = btn.getAttribute('data-type');
      state.cat = null;
      document.querySelectorAll('.seg').forEach(b => b.classList.toggle('active', b === btn));
      document.getElementById('is-fixed').checked = false;
      renderCategories();
    });
  });

  /* --- 选择分类 --- */
  document.getElementById('category-grid').addEventListener('click', e => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;
    state.cat = btn.getAttribute('data-cat');
    if (state.type === 'expense') {
      document.getElementById('is-fixed').checked = catFixed(state.cat);
    }
    renderCategories();
  });

  /* --- 保存一笔 --- */
  document.getElementById('save-btn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const tip = document.getElementById('save-tip');

    if (!amount || amount <= 0) {
      tip.style.color = '#C94A4A';
      tip.textContent = t('entry.pickAmount');
      return;
    }
    if (!state.cat) {
      tip.style.color = '#C94A4A';
      tip.textContent = t('entry.pickCat');
      return;
    }

    data.tx.push({
      id: 'x' + Date.now() + Math.random().toString(36).slice(2, 6),
      amount: Math.round(amount * 100) / 100,
      type: state.type,
      cat: state.cat,
      date: document.getElementById('date').value || todayStr(),
      note: document.getElementById('note').value.trim(),
      fixed: state.type === 'expense' ? document.getElementById('is-fixed').checked : false,
      ts: Date.now()
    });

    saveData();

    // 记完自动跳到当月，避免用户找不到刚记的账
    state.month = (document.getElementById('date').value || todayStr()).slice(0, 7);

    document.getElementById('amount').value = '';
    document.getElementById('note').value = '';
    document.getElementById('is-fixed').checked = false;
    state.cat = null;
    renderCategories();

    tip.style.color = '#2F8F5B';
    tip.textContent = t('entry.saved');
    setTimeout(() => { tip.textContent = ''; }, 2200);

    renderList();
    renderAnalysis();
    renderDataStats();
  });

  /* --- 删除一笔 --- */
  document.getElementById('list-container').addEventListener('click', e => {
    const btn = e.target.closest('[data-del]');
    if (!btn) return;
    const id = btn.getAttribute('data-del');
    data.tx = data.tx.filter(x => x.id !== id);
    saveData();
    renderList();
    renderAnalysis();
    renderDataStats();
  });

  /* --- 月份切换 --- */
  document.getElementById('prev-month').addEventListener('click', () => {
    state.month = prevMonthKey(state.month);
    renderList();
    renderAnalysis();
    renderAI();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    const [y, m] = state.month.split('-').map(Number);
    const d = new Date(y, m, 1);
    state.month = d.getFullYear() + '-' + pad(d.getMonth() + 1);
    renderList();
    renderAnalysis();
    renderAI();
  });

  /* --- 生成分析数据 --- */
  document.getElementById('gen-prompt').addEventListener('click', () => {
    const prompt = buildPrompt();
    const box = document.getElementById('prompt-box');

    if (!prompt) {
      box.classList.add('hidden');
      alert(t('ai.noData'));
      return;
    }
    document.getElementById('prompt-text').textContent = prompt;
    box.classList.remove('hidden');
    if (box.scrollIntoView) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  /* --- 复制 --- */
  document.getElementById('copy-prompt').addEventListener('click', async () => {
    const text = document.getElementById('prompt-text').textContent;
    const btn = document.getElementById('copy-prompt');
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // 部分浏览器在非 HTTPS 下没有 clipboard，退回到老办法
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    btn.textContent = t('ai.copied');
    setTimeout(() => { btn.textContent = t('ai.copy'); }, 1600);
  });

  /* --- 每月存款规矩：就地改，改完上限跟着动 --- */
  document.getElementById('savings-block').addEventListener('change', (e) => {
    if (!e.target || e.target.id !== 'monthly-save') return;
    const v = parseFloat(e.target.value);
    data.settings.monthlySave = (!v || v < 0) ? 0 : Math.round(v * 100) / 100;
    saveData();
    renderAnalysis();
  });

  /* --- 把 AI 的回答存回本月 --- */
  document.getElementById('save-note').addEventListener('click', () => {
    const box = document.getElementById('note-text');
    const text = box.value.trim();

    if (!text) {
      data.aiNotes[state.month] = { text: '', ts: Date.now() };
      saveData();
      renderAI();
      return;
    }

    data.aiNotes[state.month] = { text: text, ts: Date.now() };
    saveData();
    renderAI();
    document.getElementById('note-status').textContent = t('note.saved');
  });

  /* --- 数据管理弹层 --- */
  const overlay = document.getElementById('gear-overlay');

  document.getElementById('gear-btn').addEventListener('click', () => {
    renderDataStats();
    overlay.classList.remove('hidden');
  });

  document.getElementById('gear-close').addEventListener('click', () => {
    overlay.classList.add('hidden');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') overlay.classList.add('hidden');
  });

  /* --- 示例数据 --- */
  document.getElementById('load-sample').addEventListener('click', () => {
    loadSampleData();
    state.month = thisMonthKey();
    renderAll();
    alert(t('set.sampleTip'));
  });

  /* --- 导出 --- */
  document.getElementById('export-json').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'savewise-backup-' + todayStr() + '.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  /* --- 导入（恢复备份）：并入现有数据，按 id 去重，绝不删除 --- */
  document.getElementById('import-json').addEventListener('click', () => {
    document.getElementById('import-file').click();
  });

  document.getElementById('import-file').addEventListener('change', (ev) => {
    const file = ev.target.files && ev.target.files[0];
    ev.target.value = '';
    if (!file) return;

    const reader = new FileReader();

    reader.onerror = () => alert(t('data.importBad'));

    reader.onload = () => {
      let parsed;
      try {
        parsed = JSON.parse(String(reader.result));
      } catch (e) {
        alert(t('data.importBad'));
        return;
      }
      if (!parsed || !Array.isArray(parsed.tx)) {
        alert(t('data.importBad'));
        return;
      }

      const known = new Set(data.tx.map(x => x.id));
      let added = 0;
      let skipped = 0;

      for (const raw of parsed.tx) {
        if (!raw || typeof raw !== 'object') { skipped++; continue; }

        const amount = Number(raw.amount);
        if (!isFinite(amount) || amount <= 0 || !raw.date || !raw.cat) { skipped++; continue; }

        const id = raw.id ? String(raw.id) : 'i' + Math.random().toString(36).slice(2, 9);
        if (known.has(id)) { skipped++; continue; }
        known.add(id);

        data.tx.push({
          id: id,
          amount: amount,
          type: (raw.type === 'income' || raw.type === 'savings') ? raw.type : 'expense',
          cat: String(raw.cat),
          date: String(raw.date),
          note: raw.note ? String(raw.note) : '',
          fixed: raw.fixed === undefined ? catFixed(String(raw.cat)) : !!raw.fixed,
          ts: Number(raw.ts) || Date.now()
        });
        added++;
      }

      if (!added) {
        alert(t('data.importNone'));
        return;
      }

      /* 规矩只补空缺，不覆盖你在这台设备上已经定好的数 */
      if (parsed.settings && typeof parsed.settings === 'object') {
        if (!Number(data.settings.monthlySave) && parsed.settings.monthlySave !== undefined) {
          data.settings.monthlySave = Number(parsed.settings.monthlySave) || 0;
        }
      }

      /* AI 存的回答一并恢复，按月合并，本地已有的不覆盖 */
      if (parsed.aiNotes && typeof parsed.aiNotes === 'object') {
        for (const k of Object.keys(parsed.aiNotes)) {
          if (!data.aiNotes[k]) data.aiNotes[k] = parsed.aiNotes[k];
        }
      }

      saveData();
      renderAll();
      alert(t('data.importDone')
        .replace('{added}', added)
        .replace('{skipped}', skipped));
    };

    reader.readAsText(file);
  });

  /* --- 清空 --- */
  document.getElementById('clear-data').addEventListener('click', () => {
    if (!confirm(t('data.confirmClear'))) return;
    data.tx = [];
    data.settings = defaultSettings();
    data.aiNotes = {};
    saveData();
    renderAll();
    alert(t('data.cleared'));
  });
}

/* ---------------- 14. 启动 ---------------- */

(function init() {
  document.getElementById('date').value = todayStr();
  bindEvents();
  renderAll();
})();

