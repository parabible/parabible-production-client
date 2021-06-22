import RegisterServiceWorker from 'util/RegisterServiceWorker.js'
RegisterServiceWorker.register()

import * as ackeeTracker from 'ackee-tracker'
window.ackeeInstance = ackeeTracker.create('https://ackee.server.parabible.com', { detailed: true })
window.ackeeInstance.record('bfd6b998-4003-4784-bb03-8b5683d24b42')

import React from 'react'
import { render } from 'react-dom'
import App from 'components/App'

import HistoryManager from 'util/HistoryManager'
HistoryManager.init()
import ClipboardHelper from 'util/ClipboardHelper'
ClipboardHelper.init()

render(
	<App />,
	document.getElementById('app')
)
