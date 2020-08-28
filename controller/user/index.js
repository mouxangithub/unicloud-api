'use strict';
exports.main = async (event, context) => {
	let {
		data,
		method,
		tool,
		db,
		_
	} = event;
	const collection = db.collection('admin')
	switch (method) {
		// 查询角色列表
		case 'get':
			if (data.id) {
				var res = (await collection.doc(data.id).get()).data[0]
				return {
					code: 0,
					msg: 'success',
					data: res
				}
			} else {
				var page = data.page ? data.page : 1,
					pageSize = data.pageSize ? data.pageSize : 100,
					search = {
						roles_id: data.rolesid ? data.rolesid : _.exists(true),
						username: data.username ? new RegExp(data.username) : _.exists(true)
					},
					total = (await collection.where(search).count()).total,
					res = (await collection.aggregate()
						.lookup({
							from: 'roles',
							localField: 'roles_id',
							foreignField: '_id',
							as: 'roles'
						})
						.project({
							password: 0,
							token: 0,
							last_login_date: 0,
							last_login_ip: 0,
							register_date: 0,
							register_ip: 0,
							'roles._id': 0,
							'roles.node': 0,
							'roles.status': 0
						})
						.match(search)
						.skip((page - 1) * pageSize)
						.limit(pageSize)
						.end()).data;
				return {
					code: 0,
					msg: 'success',
					data: {
						total,
						page,
						pageSize,
						data: res
					}
				}
			}
			break;
		case 'post':
			if (data._id) {
				delete data._id;
			}
			data.password = tool.admin.encryptPwd(data.password)
			await collection.add(data);
			return {
				code: 0,
				msg: 'success'
			}
			break;
		case 'put':
			var id = data._id
			delete data._id;
			var res = await collection.doc(id).get();
			if (tool.admin.encryptPwd(data.password) != res.data[0].password) {
				data.password = tool.admin.encryptPwd(data.password)
			}
			await collection.doc(id).update(data);
			return {
				code: 0,
				msg: 'success'
			}
			break;
		case 'delete':
			if (data.ids) {
				for (var item of data.ids) {
					await collection.doc(item).remove();
				}
				return {
					code: 0,
					msg: 'success'
				}
			} else if (data.id) {
				await collection.doc(data.id).remove();
				return {
					code: 0,
					msg: 'success'
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
