import RegisterServiceWorker from 'util/RegisterServiceWorker.js'
RegisterServiceWorker.register()

import React from 'react'
import { render } from 'react-dom'
import App from 'components/App'

// Make a fake a goatcounter object to give time to load it so HistoryManager doesn't crash things all the time
if (!("goatcounter" in window)) {
	window.goatcounter = {
		count: () => { console.error("Failed to hit goatcoutner. GC loaded too late (I think).") }
	}
}

import HistoryManager from 'util/HistoryManager'
HistoryManager.init()
import ClipboardHelper from 'util/ClipboardHelper'
ClipboardHelper.init()

render(
	<App />,
	document.getElementById('app')
)
