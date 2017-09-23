import React from 'react'
import DataFlow from 'util/DataFlow'
import RidView from 'components/RidView'
import ApiRequest from 'util/ApiRequest'

class Content extends React.Component {
	constructor(props) {
		super(props)
		this.state = DataFlow.bindState([
			"bibledata",
			"activeWid",
			"searchHighlights",
			"highlightTermsSetting"
		], this.setState.bind(this))
	}
	render() {
		if (!this.state.bibledata) {
			// We don't really want a blank slate...
			ApiRequest("chapterText")
			return <div />
		}
		let btextHighlight = DataFlow.get("bibledata")
		if (DataFlow.get("highlightTermsSetting") && DataFlow.get("searchHighlights")) {
			const sh = DataFlow.get("searchHighlights")
			const hSet = Object.keys(sh).map(k => ({
				uid: k,
				highlight: new Set(sh[k])
			}))
			const highlightID = (wid) => {
				for (let h in hSet) {
					if (hSet[h].highlight.has(wid)) {
						return hSet[h].uid
					}
				}
				return false
			}
			Object.keys(btextHighlight).forEach(rid => {
				btextHighlight[rid].wlc.forEach((au, i) => {
					au.forEach((wbit, j) => {
						const hid = highlightID(wbit.wid)
						if (hid !== false)
							btextHighlight[rid].wlc[i][j]["searchHighlight"] = hid
					})
				})
			})
		}
		return (
			<div style={{
				margin: "auto",
				maxWidth: "760px",
				padding: "5px 20px 50px 20px",
				direction: "rtl",
				userSelect: DataFlow.get("screenSizeIndex") > 2 ? "text" : "none",
				cursor: "text"
				}}>
				{Object.keys(btextHighlight).map(k => 
					<RidView
						key={k}
						rid={k}
						ridData={btextHighlight[k]}
						activeWid={this.state.activeWid} />
				)}
			</div>
		)
	}
}
export default Content