import React from 'react'
import { render } from 'react-dom'
import Header from './components/Header'
import BookSelector from './components/BookSelector'
import MorphologySettings from './components/MorphologySettings'
import MorphologySidebar from './components/MorphologySidebar'
import MorphologyPopup from './components/MorphologyPopup'
import Content from './components/Content'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

import MediaBreakpoints from 'util/MediaBreakpoints'
import DataFlow from 'util/DataFlow'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showBookSelector: false,
			showMorphSettings: false,
			messages: [
				// {
				// 	type: "success",
				// 	message: <span>Blocked - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi luctus, purus a lobortis tristique, odio augue pharetra metus, ac placerat nunc mi nec dui. Vestibulum aliquam et nunc semper scelerisque. Curabitur vitae orci nec quam condimentum porttitor et sed lacus. Vivamus ac efficitur leo. Cras faucibus mauris libero, ac placerat erat euismod et. Donec pulvinar commodo odio sit amet faucibus. In hac habitasse platea dictumst. Duis eu ante commodo, condimentum nibh pellentesque, laoreet enim. Fusce massa lorem, ultrices eu mi a, fermentum suscipit magna. Integer porta purus pulvinar, hendrerit felis eget, condimentum mauris. <a href='#'>Visit our website</a></span>
				// }
			],
			reference: {
				"book": "Genesis",
				"chapter": 1,
			},
			screenSizeIndex: DataFlow.get("screenSizeIndex"),
			showMorphPopup: false
		}
		DataFlow.watch("screenSizeIndex", n => {
			this.setState({ "screenSizeIndex": n })
		}).watch("worddata", () => {
			this.setState({showMorphPopup: true})
		})
	}
	setPanelDisplay(panel, visibile) {
		const panelNames = {
			"bookSelector": "showBookSelector",
			"morphSettings": "showMorphSettings"
		}
		const state = {}
		state[panelNames[panel]] = visibile
		this.setState(state)
	}
	removeMessage(index) {
		this.setState({ messages: this.state.messages.filter((v, i) => i !== index) })
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
				<div style={{position:"absolute"}}>
					{this.state.messages.map((m, index) => 
						<MessageBar key={index} messageBarType={MessageBarType[m.type]}
							onDismiss={() => this.removeMessage(index)}>
							{m.message}
						</MessageBar>
					)}
				</div>
				<div style={{
					fontFamily: "SBL Biblit",
					fontSize: "xx-large",
					lineHeight: 1.6,
					overflow: "auto",
					position: "absolute",
					top: "40px",
					left: 0,
					right: 0,
					height: "calc(100vh - 40px)",
				}}>
					<div style={{maxWidth: mainMaxWidth, margin: "auto"}}>
						<div style={{display: "table", width: "100%"}}>
							{this.state.screenSizeIndex > 1 ? (
							<div style={{display: "table-cell", width: morphWidth}}>
								<MorphologySidebar />
							</div>
							): null}
							<div style={{display: "table-cell"}}>
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
				<BookSelector
					panelIsVisible={this.state.showBookSelector}
					hidePanel={() => this.setPanelDisplay("bookSelector", false)} />
				<MorphologySettings
					panelIsVisible={this.state.showMorphSettings}
					hidePanel={() => this.setPanelDisplay("morphSettings", false)} />
			</div>
		)
	}
}

render(
	<App />,
	document.getElementById('app')
)