import React from 'react'
import { List } from 'office-ui-fabric-react/lib/List'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import DataFlow from 'util/DataFlow'
import { generateReference, generateURL } from 'util/ReferenceHelper'
import RidView from './RidView'

const ResultsOverlay = ({panelIsVisible, hideOverlay}) => {
	const searchResults = DataFlow.get("searchResults")
	const multiline = DataFlow.get("screenSizeIndex") < 2
	const useAbbreviation = DataFlow.get("screenSizeIndex") < 4 && !multiline ? true : false
	return (
		<div style={{
			visibility: panelIsVisible ? "visible" : "hidden",
			position: "fixed",
			top: 40,
			bottom: 0,
			left: 0,
			right: 0,
			background: "rgba(255, 255, 255, 0.9)",
			overflowY: "scroll",
			"-webkit-overflow-scrolling": "touch" }}>

			<div style={{
				fontFamily: "Open Sans",
				fontSize: "large",
				fontWeight: "bold",
				textAlign:"center",
				padding: "5px"
				}}>
				Search Results ({searchResults && Object.keys(searchResults).length > 0 ? searchResults.length : 0})
			</div>

			<div style={{
				position: "fixed",
				top: 50,
				right: 25
				}}>
				<PrimaryButton
					onClick={hideOverlay}
					iconProps={{ iconName: 'ChromeClose' }} />
			</div>

			<span style={{
				userSelect: DataFlow.get("screenSizeIndex") > 2 ? "text" : "none",
				cursor: "text" }}>
				<List
					items={DataFlow.get("searchResults").results}
					onRenderCell={(item, index) => (
						<div style={{ display: "flex",
							flexDirection: multiline ? "column" : "row",
							padding: multiline ? "5px" : "5px 15px",
								cursor: "pointer" 
							}} className="resultsRow">
							<div style={{
								flexBasis: multiline ? "" : "100px",
								fontFamily: "Open Sans",
								fontSize: "small",
								fontWeight: "bold",
								textTransform: "uppercase" }}>
								<a href={generateURL(item.verses[0])}>
									{generateReference(item.verses, useAbbreviation)}
								</a>
							</div>
							<div style={{ flex: 1 }}>
								{item.verses.map(rid => (
									<RidView key={rid} rid={rid} ridData={item.text[rid]} activeWid={-1} />
								))}
							</div>
						</div>
					)}
				/>
			</span>
		</div>
	)
}
export default ResultsOverlay
