import createHistory from 'history/createBrowserHistory'
import UrlToReference from 'util/UrlToReference'
import DataFlow from 'util/DataFlow'

const history = createHistory()


let justPopped = false
DataFlow.watch("reference", r => {
	if (!justPopped) { // don't push if justPopped
		const bookUrl = r.book.replace(" ", "-").replace(" ", "-")
		history.push(`/${bookUrl}/${r.chapter}`)
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
const newRef = UrlToReference(location.pathname)
if (newRef)
	DataFlow.set("reference", newRef)
