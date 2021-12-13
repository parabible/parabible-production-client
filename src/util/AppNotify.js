import DataFlow from '@util/DataFlow'

const messageTypes = ["info", "success", "blocked", "error", "remove", "warning", "severeWarning"]
class AppNotify {
	static remove(mid) {
		const msgList = DataFlow.get("appMessages")
		DataFlow.set("appMessages", msgList.filter(m => m.mid !== mid))
	}
	static send({ message, type = null }) {
		const msgType = type && messageTypes.indexOf(type) > -1 ? type : messageTypes[0]
		const msgList = DataFlow.get("appMessages")
		const mid = Date.now().toString()
		msgList.push({
			type: msgType,
			message: message,
			mid: mid
		})
		DataFlow.set("appMessages", msgList)
		return mid
	}
}
export default AppNotify