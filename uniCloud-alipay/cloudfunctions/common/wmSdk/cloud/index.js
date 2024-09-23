const wmCloudSdk = {

	// 添加日志
	async addErrLog(event) {
		const db = uniCloud.database();
		const collection = db.collection('err-log');
		let date = new Date()
		await collection.add({
			...event,
			_add_date: date.getTime()
		})
	}
}
module.exports = wmCloudSdk;