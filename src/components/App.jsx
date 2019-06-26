import React from 'react'

import { initializeIcons } from '@uifabric/icons'
initializeIcons()

import Header from 'components/Header'
import Content from 'components/Content'
import Footer from 'components/Footer'
import MorphologySidebar from 'components/MorphologySidebar'
import MorphologyPopup from 'components/MorphologyPopup'
import MorphologySettings from 'components/MorphologySettings'
import BookSelector from 'components/BookSelector'
import ResultsOverlay from 'components/ResultsOverlay'
import PopoutManager from 'components/PopoutManager'

import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

// This just executes and should run before DataFlow
import MediaBreakpoints from 'util/MediaBreakpoints'

import DataFlow from 'util/DataFlow'
import AppNotify from 'util/AppNotify'
import TextDisplayManager from 'util/TextDisplayManager'

const ESCAPE_KEY = 27;

class App extends React.Component {

	_handleKeyup(event) {
		switch (event.keyCode) {
			case ESCAPE_KEY:
				this.setState({ "showResults": false })
				break
			default:
				break
		}
	}
	// componentWillMount deprecated in React 16.3
	componentDidMount() {
		document.addEventListener("keyup", this._handleKeyup.bind(this))
	}
	componentWillUnmount() {
		document.removeEventListener("keyup", this._handleKeyup.bind(this))
	}

	constructor(props) {
		super(props)
		this.state = {
			showBookSelector: false,
			showMorphSettings: false,
			appMessages: DataFlow.get("appMessages"),
			reference: {
				"book": "Genesis",
				"chapter": 1,
			},
			screenSizeIndex: DataFlow.get("screenSizeIndex"),
			showMorphPopup: false,
			showResults: false,
			showNewTabSearchResults: false
		}
		DataFlow.watch("screenSizeIndex", n => {
			this.setState({ "screenSizeIndex": n })
		}).watch("worddata", () => {
			this.setState({ showMorphPopup: true })
		}).watch("searchResults", () => {
			const r = DataFlow.get("searchResults")
			if (r && Object.keys(r).length > 0) {
				this.setState({ showResults: true })
			}
			else {
				AppNotify.send({
					type: "info",
					message: "Your search did not return any results"
				})
			}
		}).watch("appMessages", m => {
			this.setState({ appMessages: m })
		})
	}
	setPanelDisplay(panel, visibile) {
		const panelNames = {
			"bookSelector": "showBookSelector",
			"morphSettings": "showMorphSettings",
			"resultsOverlay": "showResults"
		}
		const state = {}
		state[panelNames[panel]] = visibile
		this.setState(state)
	}
	removeMessage(index) {
		this.setState({ messages: this.state.appMessages.filter((v, i) => i !== index) })
	}
	render() {
		const mainMaxWidth = this.state.screenSizeIndex == 4 ? "1050px" : "760px"
		const morphWidth = this.state.screenSizeIndex == 4 ? "290px" :
			this.state.screenSizeIndex == 3 ? "210px" : "160px"

		return (
			<div style={{
				fontFamily: `${DataFlow.get("fontSetting")}, "SBL BibLit", "Open Sans", "Arial"`,
				fontSize: "xx-large",
				lineHeight: 1.6,
				height: "100%",
				overflow: "hidden"
			}}>
				<div id="headerbar">
					<Header
						showBookSelector={() => this.setPanelDisplay("bookSelector", true)}
						showMorphSettings={() => this.setPanelDisplay("morphSettings", true)} />
				</div>
				<div style={{
					position: "fixed",
					left: 0,
					right: 0,
					top: 40,
					bottom: 0,
					overflowX: "hidden",
					overflowY: "auto",
					WebkitOverflowScrolling: "touch"
				}}>
					<div style={{ display: "flex", maxWidth: mainMaxWidth, margin: "auto", paddingTop: 10, verticalAlign: "top" }}>
						{this.state.screenSizeIndex > 1 ? (
							<div style={{ flex: 1 }}>
								<div id="morphbar">
									<MorphologySidebar />
								</div>
							</div>
						) : null}
						<div style={{ flex: 3 }}>
							<Content />
						</div>
					</div>
					<Footer />
				</div>

				{this.state.screenSizeIndex <= 1 && this.state.showMorphPopup ? (
					<div id="morphpopup">
						<MorphologyPopup hidePopup={() => this.setState({ showMorphPopup: false })} />
					</div>
				) : null}

				{/* PANELS */}
				<BookSelector
					panelIsVisible={this.state.showBookSelector}
					hidePanel={() => this.setPanelDisplay("bookSelector", false)} />
				<MorphologySettings
					panelIsVisible={this.state.showMorphSettings}
					hidePanel={() => this.setPanelDisplay("morphSettings", false)} />
				<ResultsOverlay
					panelIsVisible={this.state.showResults}
					hideOverlay={() => this.setPanelDisplay("resultsOverlay", false)}
					showPopout={() => this.setState({ "showNewTabSearchResults": true })} />

				{/* NOTIFICATIONS */}
				<div style={{ position: "absolute", left: "50px", right: "50px", top: "50px", zIndex: 10 }}>
					{this.state.appMessages.map((m, index) =>
						<MessageBar key={index} messageBarType={MessageBarType[m.type]}
							onDismiss={() => AppNotify.remove(m.mid)}>
							{m.message}
						</MessageBar>
					)}
				</div>

				{/* POPOUT WINDOW*/}
				{this.state.showNewTabSearchResults ?
					<PopoutManager popoutExit={() => this.setState({ "showNewTabSearchResults": false })}></PopoutManager>
					: ""}
			</div>
		)
	}
}
export default App