'use strict';
const db = uniCloud.database()
const _ = db.command
exports.main = async (event, context) => {
	let url = event.url;
	let data = event.data;
	let token = event.uniIdToken;
	let method = event.method;
	// 工具包 common 为工具包目录
	const tool = {
		admin: require(__dirname + '/common/uni-id.js'),
		openapi: require(__dirname + '/common/mp-cloud-openapi.js')
	};
	const before = require(__dirname + '/libs/before.js');
	// 守卫拦截
	try {
		let json = await before.main({
			url,
			token,
			tool
		});
		if (json.code != 0) {
			return json;
		}
	} catch (err) {
		return err
		return {
			code: 404,
			msg: '拦截出错: Intercept error',
		}
	}
	// 加载业务函数
	let controller;
	try {
		controller = require(__dirname + '/controller/' + url); // __dirname是为了兼容阿里云
	} catch (err) {
		return err
		return {
			code: 404,
			msg: '请求错误: Request error',
		}
	}
	// 执行业务函数
	return await controller.main({
		data,
		token,
		method,
		tool,
		db,
		_
	}, context);
};
