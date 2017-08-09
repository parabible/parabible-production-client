import DataFlow from './DataFlow'
import { Xhr, apiEndpoints } from './Xhr'

DataFlow.watch("reference", () => {
	ApiRequest("chapterText")
}).watch("activeWid", () => {
	ApiRequest("wordLookup")
})

const ApiRequest = (endpoint) => {
	let payload = {}
	return new Promise((resolve, reject) =>{
		switch (endpoint) {
			case "wordLookup":
				payload = { "wid": DataFlow.get("activeWid") }
				Xhr(endpoint, payload).then(result => {
					DataFlow.set("worddata", result.results)
				})
				break
			case "chapterText":
				payload = { "reference": DataFlow.get("reference") }
				Xhr(endpoint, payload).then(result => {
					DataFlow.set("bibledata", result.text)
					// DataFlow.set("reference", result.reference)
				})
				break
			case "termSearch":
				Xhr(endpoint, payload).then(result => {

				}).catch(err => {

				})
				break
			default:
				if (apiEndpoints.indexOf(endpoint) !== -1) {
					console.error("strange, we don't seem to handle this endpoint but apparently it's available")
					console.error(endpoint)
				}
				else {
					console.error("sorry, this endpoint is not available")
					console.error(endpoint)
				}
		}
	})
}
export default ApiRequest