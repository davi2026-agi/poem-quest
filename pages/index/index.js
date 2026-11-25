const app = getApp();

Page({
  data: {
    best: 0,
    bestTitle: ''
  },
  onShow() {
    this.setData({
      best: app.globalData.best,
      bestTitle: app.globalData.bestTitle
    });
  },
  start() {
    wx.navigateTo({ url: '/pages/play/play' });
  },
  onShareAppMessage() {
    return {
      title: '十五句唐诗宋词，你能补全几句？',
      path: '/pages/index/index'
    };
  },
  onShareTimeline() {
    return {
      title: '十五句唐诗宋词，你能补全几句？'
    };
  }
});
