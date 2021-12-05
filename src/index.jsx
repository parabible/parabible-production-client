import RegisterServiceWorker from 'util/RegisterServiceWorker.js'

import React from 'react'
import { render } from 'react-dom'
import App from '@components/App'

import HistoryManager from '@util/HistoryManager'
import ClipboardHelper from '@util/ClipboardHelper'

HistoryManager.init()
ClipboardHelper.init()

render(
	<App />,
	document.getElementById('app')
)
RegisterServiceWorker.register()