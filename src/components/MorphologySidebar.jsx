import React, { useState } from 'react'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import DataFlow from '@util/DataFlow'
import AppNotify from '@util/AppNotify'
import Abbreviations from '@data/abbreviations'

// const over = (e) => { e.target.style.backgroundColor = "#ffa0a0" }
const DismissButton = ({ onClick }) => {
	const [hover, setHover] = useState(false)
	return <button style={{
		position: 'sticky',
		left: 'calc(100% - 25px)',
		top: "0",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: "50%",
		width: "24px",
		height: "24px",
		background: hover ? "#ffa0a0" : "#eaeaea",
		cursor: "pointer",
		zIndex: "1",
		border: "1px solid white",
	}}
		onClick={onClick}
		onMouseEnter={() => setHover(true)}
		onMouseLeave={() => setHover(false)}
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={hover ? "#fff" : "#000"}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
	</button >
}

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
			"invert": false,
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
		return <div
			id="morphbar"
			style={{
				position: "sticky",
				boxSizing: "border-box",
				top: "0",
				padding: "1px 15px 30px 15px",
				maxHeight: "calc(100vh - 47px)", // `height` of commandbar (44) + `top` + `padding` of morphbar (this: 0 + 1)
				overflow: "auto",
				fontSize: "small",
				fontFamily: "Ubuntu",

				// Fade and shift left when the sidebar is hidden
				transition: "transform 0.2s linear, opacity 0.2s linear",
				transform: this.props.show ? "translateX(0)" : "translateX(-20px)",
				opacity: this.props.show ? "1" : "0",
			}}
		>
			<DismissButton onClick={this.props.onHide} />
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
