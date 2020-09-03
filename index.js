'use strict';
const db = uniCloud.database()
const _ = db.command
// __dirname是为了兼容阿里云
const openapi = require(__dirname + '/common/mp-cloud-openapi.js')
const config = require(__dirname + '/config/index.json')
const qr = require('qr-image');
const interceptors = require(__dirname + '/libs/interceptors.js');
exports.main = async (event, context) => {
	let url = event.url;
	let data = event.data;
	let token = event.uniIdToken;
	let method = event.method;
	// 工具包 common 为工具包目录
	const tool = {
		admin: require(__dirname + '/common/uni-id.js'),
		qr,
		openapi
	};
	// 请求拦截
	let requestJson
	try {
		requestJson = await interceptors.request({
			url,
			token,
			tool
		});
		if (requestJson.code != 0 || (!requestJson.code && requestJson.code != 0)) {
			return requestJson;
		}
	} catch (err) {
		return {
			code: 404,
			msg: '请求拦截出错: Request interception error',
		}
	}
	// 加载业务函数
	let controller;
	try {
		controller = require(__dirname + '/controller/' + url);
		var res = await controller.main({
			data,
			token,
			method,
			config,
			tool,
			db,
			_
		}, context);
	} catch (err) {
		return {
			code: 404,
			msg: '请求错误: Request error',
		}
	}
	// 响应拦截
	try {
		return await interceptors.response({
			url,
			token,
			tool,
			data: res
		});
	} catch (err) {
		return {
			code: 404,
			msg: '响应拦截出错: Response interception error',
		}
	}
};
