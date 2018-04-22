import createHistory from 'history/createBrowserHistory'
import ReferenceParser from 'referenceparser'
import { generateRid } from 'util/ReferenceHelper'
import DataFlow from 'util/DataFlow'

const rp = new ReferenceParser()
const history = createHistory()

const setTitle = (reference = null) => {
	if (!reference) {
		reference = DataFlow.get("reference")
	}
	document.title = `Parabible | ${reference.book} ${reference.chapter}`
}

const referenceToUrl = (reference) => {
	const bookUrl = reference.book.replace(" ", "-").replace(" ", "-")
	const verseAppend = reference.hasOwnProperty("verse") ? "#" + reference.verse : ""
	return `/${bookUrl}/${reference.chapter}${verseAppend}`
}
const urlToReference = (urlString) => {
	let refObj = rp.parse(decodeURI(urlString).substring(1))
	if (refObj.book === null) refObj.book = "Genesis"
	if (refObj.chapter === null) refObj.chapter = 1
	if (refObj.verse === null) delete refObj.verse
	return refObj
}

let justPopped = false
DataFlow.watch("reference", r => {
	if (!justPopped) { // don't push if justPopped
		history.push( referenceToUrl(r) )
		// I think we should not retain activeVerse when moving backwards and forwards through chapters...
		DataFlow.set("activeVerse", false)
	}
	justPopped = false
	setTitle(r)

})
history.listen((location, action) => {
	// don't set reference if it was a push (unnecessary
	// since DataFlow handles that but important for justPopped)
	if (action == "POP") {
		justPopped = true // set justPopped before setting reference!
		DataFlow.set("reference", urlToReference(location.pathname + location.hash))
	}
})

// When first run, we just want to set the reference to whatever
// is in the location in case someone navigated somewhere on purpose
if (location.pathname === "/") {
	const newRef = referenceToUrl(DataFlow.get("reference"))
	setTitle()
	history.push( newRef )
}
else {
	const r = urlToReference(location.pathname + location.hash)
	DataFlow.set("reference", r)
	setTitle(r)
}


if (DataFlow.get("reference").hasOwnProperty("verse")) {
	DataFlow.set("activeVerse", {
		"rid": generateRid(DataFlow.get("reference")),
		"verse": DataFlow.get("reference")["verse"]
	})
}
else {
	DataFlow.set("activeVerse", false)
}