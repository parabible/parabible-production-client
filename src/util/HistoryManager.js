import createHistory from 'history/createBrowserHistory'
import UrlToReference from 'util/UrlToReference'
import DataFlow from 'util/DataFlow'

const history = createHistory()

const referenceToUrl = (reference) => {
	const bookUrl = reference.book.replace(" ", "-").replace(" ", "-")
	return `/${bookUrl}/${reference.chapter}`
}

let justPopped = false
DataFlow.watch("reference", r => {
	if (!justPopped) { // don't push if justPopped
		history.push( referenceToUrl(r) )
	}
	justPopped = false
})
history.listen((location, action) => {
	// don't set reference if it was a push (unnecessary
	// since DataFlow handles that but important for justPopped)
	if (action == "POP") {
		justPopped = true // set justPopped before setting reference!
		DataFlow.set("reference", UrlToReference(location.pathname))
	}
})

// When first run, we just want to set the reference to whatever
// is in the location in case someone navigated somewhere on purpose
if (location.pathname === "/") {
	const newRef = referenceToUrl(DataFlow.get("reference"))
	history.push( newRef )
	console.log("history.push", newRef)
}
else {
	DataFlow.set("reference", UrlToReference(location.pathname))
	console.log("DataFlow.set", location.pathname)
}
