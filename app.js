App({
  globalData: {
    best: 0,
    bestTitle: ''
  },
  onLaunch() {
    try {
      const best = wx.getStorageSync('pq_best') || 0;
      const bestTitle = wx.getStorageSync('pq_best_title') || '';
      this.globalData.best = best;
      this.globalData.bestTitle = bestTitle;
    } catch (e) {}
  },
  saveBest(score, title) {
    if (score > this.globalData.best) {
      this.globalData.best = score;
      this.globalData.bestTitle = title;
      try {
        wx.setStorageSync('pq_best', score);
        wx.setStorageSync('pq_best_title', title);
      } catch (e) {}
      return true;
    }
    return false;
  }
});
