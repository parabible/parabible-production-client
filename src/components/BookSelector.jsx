import React from 'react'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Nav } from 'office-ui-fabric-react/lib/Nav';
import DataFlow from 'util/DataFlow'
import ApiRequest from 'util/ApiRequest'
import bookDetails from "data/bookDetails"

class BookSelector extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedReference: DataFlow.get("reference") || { "book": "Genesis", "chapter": 1 }
		}
		DataFlow.watch("reference", (r) =>{
			this.setState({ "selectedReference": r })
		})
	}
	render() {
		const bookChapterLinks = bookDetails.map(bkD => {
			const chapterLinks = Array.from({ length: bkD.chapters }, (v, i) => {
				return {
					name: `Chapter ${i + 1}`,
					url: '',
					key: `${bkD.name}${i + 1}`,
					onClick: () => {
						DataFlow.set("reference", { "book": bkD.name, "chapter": i+1 })
						this.props.hidePanel()
					}
				}
			})
			return {
				name: bkD.name,
				url: '',
				key: bkD.name,
				links: chapterLinks,
				onClick: () => this.state.selectedReference.book == bkD.name ?
					this.setState({ selectedReference: false }) :
					this.setState({ selectedReference: { "book": bkD.name } }),
				isExpanded: this.state.selectedReference.book == bkD.name
			}
		})
		return(
			<Panel
				isBlocking={true}
				isOpen={this.props.panelIsVisible}
				onDismiss={this.props.hidePanel}
				type={PanelType.smallFixedNear}
				isLightDismiss={true}
				headerText='Choose New Chapter'
				closeButtonAriaLabel='Close'
			>
				<Nav
					groups={
						[
							{
								links: bookChapterLinks
							}
						]
					}
					selectedKey={this.state.selectedReference.book + (this.state.selectedReference.chapter)}
				/>
				<div style={{height:"60px"}}></div>
			</Panel>
		)
	}
}
export default BookSelector