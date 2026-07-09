# Tovigor 用户小程序

这是 Tovigor 的微信小程序端。当前第一阶段只实现“扫码确认设备登录”，后续可以继续扩展用户训练信息、训练报告、历史记录等页面。

## 项目位置

```text
tovigor-user-miniprogram
```

## 当前登录流程

设备端显示二维码，小程序扫码后打开：

```text
pages/login/scan-login
```

该页面会：

1. 读取微信小程序码传入的 `scene`，也就是后端生成的 `sessionId`。
2. 调用 `wx.login()` 获取微信登录 `code`。
3. 请求认证后端确认登录：

```http
POST http://122.51.155.6:10086/api/auth/wechat/confirm
```

4. 后端确认后，设备端轮询到 `CONFIRMED`，二维码页面关闭并进入首页。

## 后端对应配置

后端需要配置真实微信小程序信息：

```text
WECHAT_APP_ID=你的小程序AppID
WECHAT_APP_SECRET=你的小程序AppSecret
WECHAT_QR_CODE_PAGE=pages/login/scan-login
WECHAT_QR_CODE_ENV_VERSION=develop
```

开发阶段建议先用：

```text
WECHAT_QR_CODE_ENV_VERSION=develop
```

发布后再改成：

```text
WECHAT_QR_CODE_ENV_VERSION=release
```

## 小程序 AppID

当前 `project.config.json` 里已经有 AppID：

```json
"appid": "wxeabfb7f1b52f4f67"
```

导入微信开发者工具时确认它就是你要使用的小程序 AppID。如果不是，再改成正确的小程序 AppID。

## 注意

正式微信小程序请求后端时，需要在微信小程序后台配置 request 合法域名。开发阶段可以先在微信开发者工具中关闭 URL 校验。
