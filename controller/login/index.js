'use strict';
exports.main = async (event, context) => {
	let {
		data,
		tool
	} = event;
	return await tool.admin.login({
		...data,
		queryField: ['username']
	});
}
