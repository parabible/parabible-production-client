import React from 'react'
import DataFlow from 'util/DataFlow'
import Abbreviations from 'data/abbreviations'

let watcherObject = {}

class MorphologySidebar extends React.Component {
	constructor(props) {
		super(props)
		DataFlow.watch("worddata", () => {
			DataFlow.set("termConstruction", {})
			this.forceUpdate()
		}, watcherObject)
	}
	componentWillUnmount() {
		DataFlow.unwatch("worddata", watcherObject.worddata)
	}
	toggleTermProperties(props) {
		const oldVal = DataFlow.get("termConstruction")
		if (Object.keys(oldVal).indexOf(props.heading) > -1) {
			let newVal = oldVal
			delete newVal[props.heading]
			DataFlow.set("termConstruction", newVal)
		}
		else {
			let tmpVal = {}
			tmpVal[props.heading] = props.value
			const newVal = Object.assign(oldVal, tmpVal)
			DataFlow.set("termConstruction", newVal)
		}
		this.forceUpdate()
	}
	render() {
		const wdata = DataFlow.get("worddata")
		const data = Object.keys(wdata).map(k => (
			{ heading: k, value: wdata[k] }
		))
		const selectedValues = Object.keys(DataFlow.get("termConstruction"))
		return <div style={{
				position: "sticky",
				boxSizing: "border-box",
				top: "25px",
				padding: "0 0 30px 15px",
				maxHeight: "calc(100vh - 65px)",
				overflow: "auto",
				fontSize: "small",
				fontFamily: "Open Sans"
				}}>
			{data.map((d, i) => {
				const highlightData = selectedValues.indexOf(d.heading) > -1 ? { 
					color: "#deecf9",
					backgroundColor: "#0078d7"
				} : {}
				const translatedHeading = Abbreviations.term_to_english.categories.hasOwnProperty(d.heading) ?
					Abbreviations.term_to_english.categories[d.heading] : d.heading
				const translatedValue = Abbreviations.term_to_english.hasOwnProperty[d.heading] ?
					Abbreviations.term_to_english[d.heading][d.value] : d.value
				return <div key={i} className="mrow" style={Object.assign({
						display: "flex",
						flexFlow: "row wrap",
						alignItems: "center",
						padding: "3px 10px",
						cursor: "pointer",
						userSelect: "none"
					}, highlightData)}
					onClick={() => this.toggleTermProperties(d)}>
					<div className="mheading" style={{
							flexBasis: "40%",
							fontSize: "80%",
							fontWeight: "bold",
							textTransform: "uppercase"
						}}>
						{translatedHeading}
					</div>
					<div className="mvalue" style={{
						marginLeft: "15px",
						}}>
						{translatedValue}
					</div>
				</div>
			})}
		</div>
	}
}
export default MorphologySidebar