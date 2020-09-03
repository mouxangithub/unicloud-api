'use strict';
/**
 * 生成小程序码api
 */
exports.main = async (event, context) => {
	let {
		data,
		tool,
		config
	} = event;
	var mode = data.mode
	delete data.mode
	if (mode != 'imageSync') {
		if (config['mp-weixin'].oauth.weixin.appid == 'weixin appid' || config['mp-weixin'].oauth.weixin.appsecret ==
			'weixin appsecret' || !config['mp-weixin'].oauth.weixin.appid || !config['mp-weixin'].oauth.weixin.appsecret) {
			return {
				code: 404,
				msg: '请配置正确的appid和appsecret'
			}
		}
		// 初始化 openapiWeixin
		const openapiWeixins = tool.openapi.initWeixin({
			appId: config['mp-weixin'].oauth.weixin.appid,
			secret: config['mp-weixin'].oauth.weixin.appsecret
		})
		// 写入accessToken初始化
		const {
			accessToken
		} = await openapiWeixins.auth.getAccessToken()
		const openapiWeixin = tool.openapi.initWeixin({
			appId: config['mp-weixin'].oauth.weixin.appid,
			secret: config['mp-weixin'].oauth.weixin.appsecret,
			accessToken
		})
	}
	try {
		switch (mode) {
			case 'createQRCode':
				var res = await openapiWeixin.wxacode.createQRCode(data)
				break;
			case 'get':
				var res = await openapiWeixin.wxacode.get(data)
				break;
			case 'getUnlimited':
				var res = await openapiWeixin.wxacode.getUnlimited(data)
				break;
			case 'imageSync':
				/**
				 * text —要编码的文本；
				 * ec_level—纠错级别。一L，M，Q，H。默认M。
				 * options —图像选项对象：{
				 * ec_level—默认M。
				 * type- 图像类型。可能的值png（默认值）svg，pdf和eps。
				 * size（仅限png和svg）-一个模块的大小，以像素为单位。5png和undefinedsvg的默认设置。
				 * margin—模块中QR图像周围的空白。默认4为png和1他人。
				 * customize （仅png）—用于在编码为PNG之前自定义qr位图的功能。
				 * parse_url（实验性的，默认设置false）-尝试优化URL的QR码。 
				 * }
				 */
				var qr_img = tool.qr.imageSync(data.content, {
					type: 'png',
					size: 330,
					margin: 1
				})
				var res = {
					buffer: Buffer(qr_img),
					contentType: 'image/png',
					errCode: 0,
					errMsg: "imageSync ok"
				}
				break;
			default:
				return {
					code: 404,
					msg: '生成方式错误: Generation mode error'
				}
				break;
		}
		return {
			code: 0,
			msg: '生成成功',
			data: res
		}
	} catch (err) {
		return err
	}
}
