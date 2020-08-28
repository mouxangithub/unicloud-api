'use strict';
exports.main = async (event, context) => {
	let {
		data,
		token,
		tool
	} = event;
	try {
		var res = await tool.admin.logout(token)
		if (res.code === 0) {
			return res
		} else {
			throw res
		}
	} catch (err) {
		return {
			code: 505,
			msg: 'Token状态异常'
		}
	}
}
