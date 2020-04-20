import RegisterServiceWorker from 'util/RegisterServiceWorker.js'
RegisterServiceWorker.register()

import React from 'react'
import { render } from 'react-dom'
import App from 'components/App'

import HistoryManager from 'util/HistoryManager'
HistoryManager.init()
import ClipboardHelper from 'util/ClipboardHelper'
ClipboardHelper.init()

if (!("goatcounter" in window)) {
	window.goatcounter = {
		count: () => { console.error("Failed to hit goatcoutner. GC loaded too late (I think).") }
	}
}

render(
	<App />,
	document.getElementById('app')
)
