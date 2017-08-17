import React from 'react'

import Header from 'components/Header'
import Content from 'components/Content'
import MorphologySidebar from 'components/MorphologySidebar'
import MorphologyPopup from 'components/MorphologyPopup'
import MorphologySettings from 'components/MorphologySettings'
import BookSelector from 'components/BookSelector'
import ResultsOverlay from 'components/ResultsOverlay'

import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

import MediaBreakpoints from 'util/MediaBreakpoints'
import DataFlow from 'util/DataFlow'
import AppNotify from 'util/AppNotify'

class App extends React.Component {
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
			showResults: false
		}
		DataFlow.watch("screenSizeIndex", n => {
			this.setState({ "screenSizeIndex": n })
		}).watch("worddata", () => {
			this.setState({ showMorphPopup: true })
		}).watch("searchResults", () => {
			const r = DataFlow.get("searchResults")
			if (r && Object.keys(r).length > 0 && r.length > 0) {
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
			<div>
				<Header
					showBookSelector={() => this.setPanelDisplay("bookSelector", true)}
					showMorphSettings={() => this.setPanelDisplay("morphSettings", true)} />
				<div style={{
					fontFamily: `${DataFlow.get("fontSetting")}, "SBL Biblit", "Open Sans", "Arial"`,
					fontSize: "xx-large",
					lineHeight: 1.6,
					overflow: "auto",
					position: "absolute",
					top: "40px",
					left: 0,
					right: 0,
					height: "calc(100vh - 40px)",
				}}>
					<div style={{ maxWidth: mainMaxWidth, margin: "auto" }}>
						<div style={{ display: "table", width: "100%" }}>
							{this.state.screenSizeIndex > 1 ? (
								<div style={{ display: "table-cell", width: morphWidth }}>
									<MorphologySidebar />
								</div>
							) : null}
							<div style={{ display: "table-cell" }}>
								<Content />
							</div>
						</div>
					</div>
					{this.state.screenSizeIndex <= 1 && this.state.showMorphPopup ? (
						<div style={{
							position: "sticky",
							bottom: 0,
							left: 0,
							right: 0,
							background: "rgba(255,255,255,0.7)"
						}}>
							<MorphologyPopup hidePopup={() => this.setState({ showMorphPopup: false })} />
						</div>
					) : null}
				</div>
				<div style={{ position: "absolute", left: "50px", right: "50px", top: "50px" }}>
					{this.state.appMessages.map((m, index) =>
						<MessageBar key={index} messageBarType={MessageBarType[m.type]}
							onDismiss={() => AppNotify.remove(m.mid)}>
							{m.message}
						</MessageBar>
					)}
				</div>
				<BookSelector
					panelIsVisible={this.state.showBookSelector}
					hidePanel={() => this.setPanelDisplay("bookSelector", false)} />
				<MorphologySettings
					panelIsVisible={this.state.showMorphSettings}
					hidePanel={() => this.setPanelDisplay("morphSettings", false)} />
				{this.state.showResults && (
					<ResultsOverlay hideOverlay={() => this.setPanelDisplay("resultsOverlay", false)} />
				)}
			</div>
		)
	}
}
export default App