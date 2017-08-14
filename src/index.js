import React from 'react'
import { render } from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import App from 'components/App'

import UrlToReference from 'util/UrlToReference'
import DataFlow from 'util/DataFlow'

// Handle routing
const history = createHistory()
DataFlow.watch("reference", r => {
	const bookUrl = r.book.replace(" ", "").replace(" ", "")
	history.push(`/${bookUrl}/${r.chapter}`)
})
const newRef = UrlToReference(location.pathname)
if (newRef)
	DataFlow.set("reference", newRef)
// Wasn't that easy?!?

render(
	<App />,
	document.getElementById('app')
)