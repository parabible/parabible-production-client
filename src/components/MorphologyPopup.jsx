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
		let secondaryData = []
		if (wdata.sp == "verb")
			if (wdata.vt == "ptca" || wdata.vt == "ptcp") {
				secondaryData = [wdata.vs, wdata.vt, wdata.gn + wdata.nu]
			}
			else {
				secondaryData = [wdata.vs, wdata.vt, wdata.ps + wdata.gn + wdata.nu]
			}
		else
			secondaryData = [wdata.gn, wdata.nu]
		const finalSecondaryData = secondaryData.reduce((a, v) => {
			if (v)
				a.push(v)
			return a
		}, [])

		let dataToUse = {
			primary: [wdata.voc_utf8, wdata.gloss],
			secondary: finalSecondaryData.length ? finalSecondaryData : [Abbreviations.termToEnglish.sp[wdata.sp]]
		}
		return <div style={{
				display: "flex",
				fontSize: "medium",
				width: "100%",
				backfaceVisibility: "hidden"}}>
			{dataToUse.primary.map((d, i) => (
				<div key={i} style={{padding: "5px 15px",fontWeight: "bold", flex: 1, display: "inline-block", textAlign: "center"}}>{d}</div>
			))}
			{dataToUse.secondary.map((d, i) => (
				<div key={i} style={{ padding: "5px 15px", flex: 1, display: "inline-block", textAlign: "center"}}>{d}</div>
			))}
			<div style={{ padding: "5px 10px", flexShrink: 1 }} onClick={this.props.hidePopup}>
				<i className="ms-Icon ms-Icon--ChromeClose" style={{color: "darkred"}} aria-hidden="true"></i>
			</div>
		</div>
	}
}
export default MorphologySidebar