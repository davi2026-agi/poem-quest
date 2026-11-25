const bank = require('../../utils/bank.js');
const app = getApp();

const TOTAL = 15;
const LIMIT = 12;

Page({
  data: {
    idx: 0,
    total: TOTAL,
    score: 0,
    combo: 0,
    maxCombo: 0,
    correct: 0,
    timeLeft: LIMIT,
    timePct: 100,
    cur: null,
    opts: [],
    answered: false,
    lastCorrect: false
  },

  onLoad() {
    this.list = bank.slice().sort(() => Math.random() - 0.5).slice(0, TOTAL);
    this.idx = -1;
    this.setData({ score: 0, combo: 0, maxCombo: 0, correct: 0 });
    this.next();
  },

  next() {
    this.clearTimer();
    this.idx++;
    if (this.idx >= this.list.length) {
      this.finish();
      return;
    }
    const raw = this.list[this.idx];
    const parts = raw.q.split('＿');
    const opts = raw.o.slice().sort(() => Math.random() - 0.5).map(t => ({ t, state: '' }));
    this.setData({
      idx: this.idx,
      cur: { pre: parts[0], post: parts[1] || '', a: raw.a, hint: raw.hint, s: raw.s, f: raw.f },
      opts,
      answered: false,
      lastCorrect: false,
      timeLeft: LIMIT,
      timePct: 100
    });
    this.startTimer(LIMIT);
  },

  startTimer(left) {
    this.clearTimer();
    this.left = left;
    this.t0 = Date.now();
    this.setData({ timeLeft: Math.round(left), timePct: left / LIMIT * 100 });
    this.timer = setInterval(() => {
      this.left = Math.max(0, left - (Date.now() - this.t0) / 1000);
      this.setData({ timeLeft: Math.round(this.left), timePct: this.left / LIMIT * 100 });
      if (this.left <= 0) {
        this.clearTimer();
        this.judge(-1);
      }
    }, 100);
  },

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  onHide() {
    if (!this.data.answered) {
      this.pauseLeft = this.left;
      this.clearTimer();
    }
  },

  onShow() {
    if (this.pauseLeft > 0 && !this.data.answered) {
      this.startTimer(this.pauseLeft);
      this.pauseLeft = 0;
    }
  },

  choose(e) {
    if (this.data.answered) return;
    this.judge(Number(e.currentTarget.dataset.i));
  },

  judge(i) {
    const raw = this.list[this.idx];
    const picked = i >= 0 ? this.data.opts[i].t : '';
    const ok = picked === raw.a;
    this.clearTimer();

    const opts = this.data.opts.map((o, k) => {
      let state = '';
      if (ok) {
        state = k === i ? 'ok' : 'dim';
      } else {
        state = k === i ? 'no' : (o.t === raw.a ? 'ok' : 'dim');
      }
      return { t: o.t, state };
    });

    let { score, combo, maxCombo, correct } = this.data;
    if (ok) {
      combo++;
      score += 10 + Math.min(combo - 1, 5) * 2 + Math.round(this.left);
      maxCombo = Math.max(maxCombo, combo);
      correct++;
      wx.vibrateShort();
    } else {
      combo = 0;
      wx.vibrateLong();
    }

    this.setData({ opts, answered: true, lastCorrect: ok, score, combo, maxCombo, correct });
    setTimeout(() => this.next(), ok ? 1100 : 2400);
  },

  finish() {
    const { score, correct, maxCombo } = this.data;
    let title = '白丁';
    if (correct >= 15) title = '状元';
    else if (correct >= 13) title = '进士';
    else if (correct >= 11) title = '举人';
    else if (correct >= 8) title = '秀才';
    else if (correct >= 5) title = '童生';
    const isNew = score > app.globalData.best && score > 0;
    app.saveBest(score, title);
    wx.redirectTo({
      url: `/pages/result/result?score=${score}&correct=${correct}&combo=${maxCombo}&title=${title}&isNew=${isNew ? 1 : 0}`
    });
  },

  onUnload() {
    this.clearTimer();
  },

  onShareAppMessage() {
    return {
      title: '我正在补全唐诗宋词，来比比谁记得多',
      path: '/pages/index/index'
    };
  }
});
