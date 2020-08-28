'use strict';
exports.main = async (event, context) => {
	let {
		data,
		method,
		tool,
		db,
		_
	} = event;
	const collection = db.collection('roles')
	switch (method) {
		// 查询角色列表
		case 'get':
			if (data.id) {
				var res = (await collection.doc(data.id).get()).data[0];
				return {
					code: 0,
					msg: 'success',
					data: res
				}
			} else {
				var page = data.page ? data.page : 1,
					pageSize = data.pageSize ? data.pageSize : 100,
					search = {
						name: data.search ? new RegExp(data.search) : _.exists(true)
					},
					total = (await collection.where(search).count()).total,
					res = (await collection.aggregate()
						.lookup({
							from: 'admin',
							localField: '_id',
							foreignField: 'roles_id',
							as: 'user'
						})
						.project({
							node: 0,
							'user.avatar': 0,
							'user.last_login_date': 0,
							'user.last_login_ip': 0,
							'user.password': 0,
							'user.register_date': 0,
							'user.register_ip': 0,
							'user.roles_id': 0,
							'user.status': 0,
							'user.token': 0,
							'user.username': 0
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
			await collection.add(data);
			return {
				code: 0,
				msg: 'success'
			}
			break;
		case 'put':
			var id = data._id
			delete data._id;
			await collection.doc(id).update(data);
			return {
				code: 0,
				msg: 'success'
			}
			break;
		case 'delete':
			if (data.ids) {
				for (var item of data.ids) {
					const data = await db.collection('admin').where({
						roles_id: item
					}).count()
					if (data.total > 0) {
						return {
							code: 204,
							msg: '存在关联信息，请处理妥当再操作'
						};
					}
					await collection.doc(item).remove();
				}
				return {
					code: 0,
					msg: 'success'
				}
			} else if (data.id) {
				var res = await db.collection('admin').where({
					roles_id: data.id
				}).count()
				if (res.total > 0) {
					return {
						code: 204,
						msg: '存在关联信息，请处理妥当再操作'
					};
				}
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
