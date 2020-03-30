import React from 'react'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import DataFlow from 'util/DataFlow'
import AppNotify from 'util/AppNotify'
import Abbreviations from 'data/abbreviations'

let watcherObject = {}

const hebrewCategories = ["lex_utf8", "g_cons_utf8", "g_word_utf8", "voc_utf8", "tricons", "g_prs_utf8"]
// lxxlexeme is on the hebrew data, lexeme is on CCAT
const greekCategories = ["lxxlexeme", "lexeme"]

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
		//TODO: allow searching on the LXX
		if (DataFlow.get("activeWid") >= 500000) {
			AppNotify.send({ type: "warning", message: "Sorry, parabible does not yet support searching outside the BHS (but it's coming...)" })
			return
		}

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
	createSearchTerm() {
		let newT = DataFlow.get("searchTerms")
		newT.push({
			"uid": Date.now().toString(),
			"inverted": false,
			"data": DataFlow.get("termConstruction")
		})
		DataFlow.set("searchTerms", newT)
		DataFlow.set("termConstruction", {})
		this.forceUpdate()
		ga('send', {
			hitType: 'event',
			eventCategory: 'searchTerms',
			eventAction: "add"
		})
	}
	render() {
		const wdata = DataFlow.get("worddata")
		const selectedValues = Object.keys(DataFlow.get("termConstruction"))
		const morphSettings = DataFlow.get("morphSettings")
		const dataToDisplay = morphSettings.filter(m => m.visible && wdata.hasOwnProperty(m.heading)).map(m => {
			return { heading: m.heading, value: wdata[m.heading] }
		})
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
			{dataToDisplay.map((d, i) => {
				const highlightData = selectedValues.indexOf(d.heading) > -1 ? {
					color: "#deecf9",
					backgroundColor: "#0078d7"
				} : {}
				const translatedHeading = Abbreviations.termToEnglish.categories.hasOwnProperty(d.heading) ?
					Abbreviations.termToEnglish.categories[d.heading] : d.heading
				const translatedValue = Abbreviations.termToEnglish[d.heading] ?
					Abbreviations.termToEnglish[d.heading][d.value] : d.value
				//TODO: Consider greekCategories (need a font setting...)
				const fontSettings = {}
				if (hebrewCategories.indexOf(d.heading) > -1) {
					fontSettings["fontFamily"] = "SBL Biblit"
					fontSettings["fontSize"] = "large"
				}
				else if (greekCategories.indexOf(d.heading) > -1) {
					fontSettings["fontFamily"] = "SBL BibLit"
					fontSettings["fontSize"] = "120%"
				}
				return <div key={i} className="mrow" style={Object.assign({
					display: "flex",
					flexFlow: "row wrap",
					alignItems: "center",
					padding: "3px 10px",
					cursor: "pointer",
					userSelect: "text"
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
					<div className="mvalue" style={Object.assign({
						marginLeft: "15px"
					}, fontSettings
					)}>
						{translatedValue}
					</div>
				</div>
			})}
			<div style={{ padding: "5px 10px" }}>
				{Object.keys(wdata).length > 0 && (
					<PrimaryButton
						disabled={selectedValues.length === 0}
						iconProps={{ iconName: 'Add' }}
						text='Create Search Term'
						onClick={this.createSearchTerm.bind(this)} />
				)}
			</div>
			<div style={{ height: "30px" }}></div>
		</div>
	}
}
export default MorphologySidebar
