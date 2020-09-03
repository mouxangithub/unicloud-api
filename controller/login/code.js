'use strict';
/**
 * 小程序app扫码登录后台管理系统
 * codeType为weixin时是小程序菊花码
 */
exports.main = async (event, context) => {
	let {
		data,
		method,
		tool,
		config,
		db,
		_
	} = event;
	const collection = db.collection('code')
	switch (method) {
		case 'get':
			if (data.codeId) {
				var res = (await collection.doc(data.codeId).get()).data[0]
				if (!res) {
					return {
						code: 500,
						msg: 'codeId不存在'
					}
				}
				if (res.uid) {
					await collection.doc(data.codeId).remove();
				}
				return {
					code: 0,
					msg: 'success',
					data: res
				}
			} else {
				var createTime = (new Date()).getTime(),
					gdata = {
						codeType: data.codeType,
						uid: '',
						createTime,
						dueDate: createTime + 600000
					},
					res = await collection.add(gdata),
					codes = require('../common/code.js').main
				if (data.codeType == 'weixin') {
					var list = {
						mode: 'getUnlimited',
						path: 'pages/adminlogin/adminlogin', // 必须是已线上已经存在的页面
						width: 330,
						scene: res.id
					};
				} else {
					var list = {
						mode: 'imageSync',
						content: 'pages/adminlogin/adminlogin?codeId=' + res.id
					};
				}
				var code = await codes({
					data: list,
					tool,
					config
				})
				return {
					code: 0,
					msg: 'success',
					data: {
						code,
						codeId: res.id
					}
				}
			}
			break;
		default:
			return {
				code: 404,
				msg: '请求方式错误: Request mode error'
			}
			break;
	}
}
