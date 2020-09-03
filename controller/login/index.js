'use strict';
exports.main = async (event, context) => {
	let {
		data,
		db,
		tool
	} = event;
	const collection = db.collection('admin')
	if (data.uid) {
		var res = (await collection.doc(data.uid).get()).data[0],
		    token = res.token;
		if (res) {
			var tokens = await tool.admin.createToken({
				_id: res._id
			})
			token.push(tokens.token)
			await collection.doc(data.uid).update({
				last_login_date: (new Date).getTime(),
				last_login_ip: context.CLIENTIP,
				token
			})
			return {
				code: 0,
				msg: "登录成功",
				token: tokens.token,
				tokenExpired: tokens.tokenExpired,
				uid: data._id,
				username: res.username
			}
		} else {
			return {
				code: 404,
				msg: "登录失败"
			}
		}
	} else {
		return await tool.admin.login({
			...data,
			queryField: ['username']
		});
	}
}
