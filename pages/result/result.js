Page({
  data: {
    score: 0,
    correct: 0,
    combo: 0,
    title: '秀才',
    total: 15,
    isNew: false,
    comment: ''
  },

  onLoad(options) {
    const score = Number(options.score || 0);
    const correct = Number(options.correct || 0);
    const combo = Number(options.combo || 0);
    const title = options.title || '白丁';
    const isNew = options.isNew === '1';

    const comments = {
      '状元': '十五句全中，读过千卷的人也不过如此。',
      '进士': '只差一两句，离满贯只隔一层纸。',
      '举人': '名篇记得七七八八，再刷一遍就上去了。',
      '秀才': '底子已经有了，输的都输在生僻的那几句。',
      '童生': '唐诗宋词的大门才推开一条缝，再来一局。',
      '白丁': '别灰心，这局碰上的都是硬茬。'
    };

    this.setData({
      score,
      correct,
      combo,
      title,
      isNew,
      comment: comments[title] || ''
    });
  },

  again() {
    wx.redirectTo({ url: '/pages/play/play' });
  },

  home() {
    wx.reLaunch({ url: '/pages/index/index' });
  },

  onShareAppMessage() {
    const t = this.data.title;
    return {
      title: `我在诗词闯关中了「${t}」，${this.data.total} 题对 ${this.data.correct} 题，来挑战我`,
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return {
      title: `我在诗词闯关中了「${this.data.title}」，来挑战我`
    };
  }
});
