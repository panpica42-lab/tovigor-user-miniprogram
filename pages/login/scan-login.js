const app = getApp()

Page({
  data: {
    sessionId: '',
    statusText: '正在读取二维码信息...',
    showRetry: false
  },

  onLoad(options) {
    const sessionId = this.readSessionId(options)
    if (!sessionId) {
      this.setData({
        statusText: '二维码信息无效，请在设备端重新获取二维码',
        showRetry: false
      })
      return
    }
    this.setData({
      sessionId,
      statusText: '正在确认登录...',
      showRetry: false
    })
    this.confirmLogin()
  },

  readSessionId(options) {
    const scene = decodeURIComponent(options.scene || '')
    if (scene) return scene
    return options.sessionId || ''
  },

  confirmLogin() {
    if (!this.data.sessionId) return
    this.setData({
      statusText: '正在获取微信身份...',
      showRetry: false
    })
    wx.login({
      success: (loginResult) => {
        if (!loginResult.code) {
          this.showError('微信登录失败，请重试')
          return
        }
        this.postConfirm(loginResult.code)
      },
      fail: () => {
        this.showError('微信登录失败，请重试')
      }
    })
  },

  postConfirm(code) {
    wx.request({
      url: app.globalData.authApiBaseUrl + '/api/auth/wechat/confirm',
      method: 'POST',
      data: {
        sessionId: this.data.sessionId,
        code,
        nickname: '',
        avatarUrl: ''
      },
      success: (res) => {
        const body = res.data || {}
        if (res.statusCode >= 200 && res.statusCode < 300 && body.success) {
          this.setData({
            statusText: '登录成功，请返回设备端继续使用',
            showRetry: false
          })
          return
        }
        this.showError(body.message || '确认登录失败，请重试')
      },
      fail: () => {
        this.showError('无法连接登录服务，请检查网络')
      }
    })
  },

  showError(message) {
    this.setData({
      statusText: message,
      showRetry: true
    })
  }
})
