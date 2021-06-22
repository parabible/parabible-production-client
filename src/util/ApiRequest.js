import DataFlow from './DataFlow'
import { Xhr, apiEndpoints } from './Xhr'
import AppNotify from 'util/AppNotify'
import { isNewTestament } from 'util/ReferenceHelper'


import bookDetails from 'data/bookDetails'
const referenceText = (currentReference, screenSizeIndex) => {
	if (!currentReference) {
		return "Select a chapter"
	}
	else {
		const bk = currentReference.book
		const ch = currentReference.chapter
		if (screenSizeIndex < 2) {
			return bookDetails.find(b => b.name === bk).abbreviation + " " + ch
		}
		else {
			return bk + " " + ch
		}
	}
}

const chapterReload = () => {
	ApiRequest("chapterText")
}
DataFlow
	.watch("textsToDisplayMainOT", () => {
		const ref = DataFlow.get("reference")
		if (!isNewTestament(ref)) {
			chapterReload()
		}
	})
	.watch("textsToDisplayMainNT", () => {
		const ref = DataFlow.get("reference")
		if (isNewTestament(ref)) {
			chapterReload()
		}
	})
	.watch("reference", () => {
		chapterReload()
		ga('send', {
			hitType: 'event',
			eventCategory: 'navigate'
		})
		window.ackeeInstance.action('3133ae59-b238-4752-82e4-7f7c9022cd4a', {
			key: 'navigate-' + referenceText(DataFlow.get("reference"), 0),
			value: 1
		})
		window.ackeeStop()
		window.ackeeStop = window.ackeeInstance.record('bfd6b998-4003-4784-bb03-8b5683d24b42')
	})
	.watch("searchTerms", () => {
		// TODO: just reload highlights... (not redownload whole chapter)
		if (DataFlow.get("highlightTermsSetting"))
			chapterReload()
	})
	.watch("highlightTermsSetting", () => {
		if (DataFlow.get("highlightTermsSetting") && DataFlow.get("searchTerms"))
			chapterReload()
	})
	.watch("activeWid", () => {
		ApiRequest("wordLookup")
		ga('send', {
			hitType: 'event',
			eventCategory: 'word'
		})
		window.ackeeInstance.action('a4c709c8-081e-4bef-93c8-4825d7f283bf', {
			key: "wid-" + DataFlow.get("activeWid"),
			value: 1
		})
		if (!("wordlookupcounter" in window))
			window.wordlookupcounter = 0
		window.wordlookupcounter++
	})
	.watch("searchResults", (sr) => {
		/* This function is just to notify the user when results are truncated */
		if (sr.truncated) {
			AppNotify.send({
				type: "warning",
				message: `Your search returned too many results so we're only displaying ${sr.results.length} of them.`
			})
		}
	})

const searchFilterOptions = (filter) => {
	const options = {
		"none": [],
		"current": [DataFlow.get("reference").book],
		"pentateuch": ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"],
		"minorProphets": ["Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"],
		"wisdomBooks": ["Job", "Proverbs", "Ecclesiastes"],
		// "custom": DataFlow.get("customBookFilter")
	}
	return options[filter]
}
const ApiRequest = (endpoint) => {
	let payload = {}
	switch (endpoint) {
		case "wordLookup":
			payload = { "wid": DataFlow.get("activeWid") }
			Xhr(endpoint, payload).then(result => {
				DataFlow.set("worddata", result.results)
			})
			break
		case "chapterText":
			const ref = DataFlow.get("reference")
			let texts = []
			if (isNewTestament(ref)) {
				texts = DataFlow.get("textsToDisplayMainNT")
				const need = !["net", "sbl"].reduce((a, t) => a || texts.includes(t), false)
				if (need) {
					texts.push("sbl")
				}
			}
			else {
				texts = DataFlow.get("textsToDisplayMainOT")
				const need = !["net", "wlc", "lxx"].reduce((a, t) => a || texts.includes(t), false)
				if (need) {
					texts.push("wlc")
				}
			}
			payload = {
				"reference": ref,
				"texts": texts
			}
			if (DataFlow.get("highlightTermsSetting") && DataFlow.get("searchTerms").length > 0) {
				payload["search_terms"] = DataFlow.get("searchTerms")
			}
			Xhr(endpoint, payload).then(result => {
				DataFlow.set("bibledata", result.text)
				DataFlow.set("searchHighlights", result.highlights)
				// DataFlow.set("reference", result.reference)
			})
			break
		case "termSearch":
			const searchTexts = Array.from(new Set(DataFlow.get("textsToDisplayMainNT").concat(DataFlow.get("textsToDisplayMainOT"))))
			payload = {
				"query": DataFlow.get("searchTerms"),
				"search_range": DataFlow.get("searchRangeSetting"),
				"search_filter": searchFilterOptions(DataFlow.get("searchFilterSetting")),
				"texts": searchTexts
			}
			DataFlow.set("lastSearch", payload)
			if (!DataFlow.setWasEqual()) {
				Xhr(endpoint, payload).then(result => {
					DataFlow.set("searchResults", result)
				}).catch(err => {
					console.error(err)
					console.error("oh no")
				})
			}
			else {
				DataFlow.renotify("searchResults")
			}
			ga('send', {
				hitType: 'event',
				eventCategory: 'search',
				eventAction: endpoint
			})
			window.ackeeInstance.action('a8d6da10-b385-4eb3-8382-ed1b299b6f93', {
				key: 'terms-' + DataFlow.get("searchTerms").length,
				value: 1
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
}
export default ApiRequest