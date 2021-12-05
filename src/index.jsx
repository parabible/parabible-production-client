import RegisterServiceWorker from '@util/RegisterServiceWorker.js'
RegisterServiceWorker.register()

import React from 'react'
import { render } from 'react-dom'
import App from '@components/App'

import HistoryManager from '@util/HistoryManager'
HistoryManager.init()

import ClipboardHelper from '@util/ClipboardHelper'
ClipboardHelper.init()

render(
	<App />,
	document.getElementById('app')
)
