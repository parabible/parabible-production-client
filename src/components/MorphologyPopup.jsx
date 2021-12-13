import React from 'react'
import DataFlow from '@util/DataFlow'
import Abbreviations from '@data/abbreviations'
import { X as CloseIcon } from 'react-feather'


const o = (obj, prop) => {
	if (obj.hasOwnProperty(prop)) {
		return obj[prop] ? obj[prop] : ""
	}
	return ""
}

class MorphologySidebar extends React.Component {
	constructor(props) {
		super(props)
		this.state = { "worddata": {} }
		DataFlow.bindState(["worddata"], this.setState.bind(this))
	}
	render() {
		const wdata = this.state.worddata
		const primaryData = []
		let secondaryData = []
		if (wdata.hasOwnProperty("sp")) {
			primaryData.push(o(wdata, "voc_utf8"), o(wdata, "gloss"))
			//It's a hebrew word - Greek words have "pos" for part of speech
			if (o(wdata, "sp") == "verb") {
				if (o(wdata, "vt") == "ptca" || o(wdata, "vt") == "ptcp") {
					secondaryData = [o(wdata, "vs"), o(wdata, "vt"), o(wdata, "gn") + o(wdata, "nu")]
				}
				else if (o(wdata, "vt") == "infa" || o(wdata, "vt") == "infc") {
					secondaryData = [o(wdata, "vs"), o(wdata, "vt")]
				}
				else {
					secondaryData = [o(wdata, "vs"), o(wdata, "vt"), o(wdata, "ps")[1] + o(wdata, "gn") + o(wdata, "nu")[0]]
				}
			}
			else {
				secondaryData = [o(wdata, "gn"), o(wdata, "nu")]
			}
		}
		else {
			// It's a greek word   
			primaryData.push(o(wdata, "lexeme"))
			// some words, like "Μωϋσῆς" don't have glosses in our data
			if (o(wdata, "gk_gloss"))
				primaryData.push(o(wdata, "gk_gloss").includes(",") ? o(wdata, "gk_gloss").split(",")[0] : o(wdata, "gk_gloss"))
			// lxx uses gloss not gk_gloss *sigh*
			else if (o(wdata, "gloss"))
				primaryData.push(o(wdata, "gloss").includes(",") ? o(wdata, "gloss").split(",")[0] : o(wdata, "gloss"))

			if (o(wdata, "pos") == "verb") {
				if (o(wdata, "mood") == "ptcp") {
					secondaryData = [o(wdata, "tense"), o(wdata, "voice"), o(wdata, "mood"), o(wdata, "case"), o(wdata, "gender"), o(wdata, "number")]
				}
				else {
					secondaryData = [o(wdata, "tense"), o(wdata, "voice"), o(wdata, "mood"), (o(wdata, "person") ? o(wdata, "person") : "") + (o(wdata, "number") ? o(wdata, "number") : "")]
				}
			}
			else {
				secondaryData = [o(wdata, "case"), o(wdata, "gender") ? o(wdata, "gender")[0] : false, o(wdata, "number")]
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
		return (
			<div id="morphpopup" className={this.props.show ? "" : "hidden"}>
				{dataToUse.primary.map((d, i) => (
					<div key={i} style={{
						padding: "5px 5px",
						fontWeight: "bold",
						flex: 1,
						display: "inline-block",
						textAlign: "center",
						fontFamily: i == 0 ? "SBL Biblit" : "inherit"
					}}>{d}</div>
				))}
				<div style={{ padding: "5px 15px", flex: 1, display: "inline-block", textAlign: "center" }}>
					{dataToUse.secondary.join(" ")}
				</div>
				<div style={{ padding: "9px 9px", cursor: "pointer", flexShrink: 1 }} onClick={this.props.hidePopup}>
					<CloseIcon size={24} style={{ color: "darkred" }} />
				</div>
			</div>
		)
	}
}
export default MorphologySidebar