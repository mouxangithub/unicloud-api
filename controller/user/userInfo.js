'use strict';
exports.main = async (event, context) => {
	let {
		data,
		token,
		tool,
		db
	} = event;
	var collection = db.collection('admin')
	var payload = await tool.admin.checkToken(token)
	var res = (await collection.aggregate()
		// 关联权限表
		.lookup({
			from: 'roles',
			localField: 'roles_id',
			foreignField: '_id',
			as: 'access'
		})
		// 判断权限
		.match({
			_id: payload.uid,
			status: 0,
			'access.status': 0
		})
		.project({
			password: 0,
			roles_id: 0,
			status: 0,
			token: 0
		})
		.end()).data[0];
	if (!res) {
		return {
			code: 404,
			msg: '您没有权限访问'
		}
	}
	return {
		msg: 'success',
		code: 0,
		data: res
	}
}
