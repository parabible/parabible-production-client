import React from 'react'
import { List } from 'office-ui-fabric-react/lib/List'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import DataFlow from 'util/DataFlow'
import { generateReference } from 'util/ReferenceHelper'
import RidView from './RidView'

const ResultsOverlay = ({hideOverlay}) => {
	const searchResults = DataFlow.get("searchResults")
	const multiline = DataFlow.get("screenSizeIndex") < 2
	const useAbbreviation = DataFlow.get("screenSizeIndex") < 4 && !multiline ? true : false
	return (
	<div style={{
		position: "fixed",
		top: "40px",
		bottom: 0,
		right: 0,
		left: 0,
		overflowY: "auto",
		background: "rgba(255,255,255,0.9)",
		padding: "5px 5px 20px 5px",
		fontSize: "large",
		zIndex: 999,
		userSelect: "text"
		}}>
		<div style={{
			fontFamily: "Open Sans",
			fontSize: "large",
			fontWeight: "bold",
			textAlign:"center",
			padding: "5px"}}>
				Search Results ({searchResults && Object.keys(searchResults).length > 0 ? searchResults.length : 0})
		</div>
		<div style={{
			position: "fixed",
			right: "50px",
			top: "50px"
			}}>
			<PrimaryButton
				onClick={hideOverlay}
				iconProps={{ iconName: 'ChromeClose' }}/>
		</div>
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
						{generateReference(item.verses,
						useAbbreviation)}
					</div>
					<div style={{ flex: 1 }}>
						{item.verses.map(rid => (
							<RidView key={rid} rid={rid} ridData={item.text[rid]} activeWid={-1} />
						))}
					</div>
				</div>
			)}
		/>
	</div>)
}
export default ResultsOverlay
