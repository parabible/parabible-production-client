import React from 'react'
import DataFlow from '../util/DataFlow'
import Abbreviations from 'data/abbreviations'

let watcherObject = {}

class MorphologySidebar extends React.Component {
	constructor(props) {
		super(props)
		DataFlow.watch("worddata", () => {
			this.forceUpdate()
		}, watcherObject)
	}
	componentWillUnmount() {
		DataFlow.unwatch("worddata", watcherObject.worddata)
	}
	render() {
		const wdata = DataFlow.get("worddata")
		const primaryData = []
		let secondaryData = []
		if (wdata.hasOwnProperty("sp")) {
			primaryData.push(wdata.voc_utf8, wdata.gloss)
			//It's a hebrew word - Greek words have "pos" for part of speech
			if (wdata.sp == "verb") {
				if (wdata.vt == "ptca" || wdata.vt == "ptcp") {
					secondaryData = [wdata.vs, wdata.vt, wdata.gn + wdata.nu]
				}
				else {
					secondaryData = [wdata.vs, wdata.vt, wdata.ps + wdata.gn + wdata.nu]
				}
			}
			else {
				secondaryData = [wdata.gn, wdata.nu]
			}
		}
		else {
			// It's a greek word   
			primaryData.push(wdata.lexeme)
			// some words, like "Μωϋσῆς" don't have glosses in our data
			if (wdata.gk_gloss)
				primaryData.push(wdata.gk_gloss.includes(",") ? wdata.gk_gloss.split(",")[0] : wdata.gk_gloss)
			// lxx uses gloss not gk_gloss *sigh*
			else if (wdata.gloss)
				primaryData.push(wdata.gloss.includes(",") ? wdata.gloss.split(",")[0] : wdata.gloss)
			
			if (wdata.pos == "verb") {
				if (wdata.mood == "ptcp") {
					secondaryData = [wdata.tense, wdata.voice, wdata.mood, wdata.case, wdata.gender, wdata.number]
				}
				else {
					secondaryData = [wdata.tense, wdata.voice, wdata.mood, (wdata.person ? wdata.person : "") + wdata.number]
				}
			}
			else {
				secondaryData = [wdata.case, wdata.gender ? wdata.gender[0] : false, wdata.number]
			}
		}
		const finalSecondaryData = secondaryData.reduce((a, v) => {
			if (v)
				a.push(v)
			return a
		}, [])

		let dataToUse = {
			primary: primaryData,
			secondary: finalSecondaryData.length ? finalSecondaryData : [Abbreviations.termToEnglish.sp[wdata.sp]]
		}
		return <div style={{
				display: "flex",
				fontSize: "medium",
				width: "100%",
				backfaceVisibility: "hidden"}}>
			{dataToUse.primary.map((d, i) => (
				<div key={i} style={{
						padding: "5px 15px",
						fontWeight: "bold",
						flex: 1,
						display: "inline-block",
						textAlign: "center",
						fontFamily: i == 0 ? DataFlow.get("fontSetting") : "inherit"
					}}>{d}</div>
			))}
			<div style={{ padding: "5px 15px", flex: 1, display: "inline-block", textAlign: "center"}}>
				{dataToUse.secondary.join(" ")}
			</div>
			<div style={{ padding: "5px 10px", flexShrink: 1 }} onClick={this.props.hidePopup}>
				<i className="ms-Icon ms-Icon--ChromeClose" style={{color: "darkred"}} aria-hidden="true"></i>
			</div>
		</div>
	}
}
export default MorphologySidebar