'use strict';
module.exports = {
	// 请求拦截器
	request: async (event) => {
		let {
			url,
			token,
			tool
		} = event
		let json = {
			code: -1,
			msg: ''
		};
		if (url.indexOf('login/') == 0) {
			json.code = 0;
			json.msg = 'ok';
		} else if (url.indexOf('common/') == 0) {
			json.code = 0;
			json.msg = 'ok';
		} else {
			// 除白名单外，其他函数需要刷新token
			json = await tool.admin.checkToken(token)
			delete json.err
		}
		return json;
	},
	// 响应拦截器
	response: async (event) => {
		let {
			url,
			token,
			tool,
			data
		} = event
		let newtoken
		if (url.indexOf('login/') != 0 && url.indexOf('common/') != 0) {
			// 除白名单外，其他函数需要刷新token，重置token时间
			var res = await tool.admin.refreshToken(token)
			newtoken = res.data.token
		}
		if (data.token) {
			newtoken = data.token
		}
		data.token = newtoken
		return data
	}
}
