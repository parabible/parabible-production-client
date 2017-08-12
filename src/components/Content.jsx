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
			"searchHighlights"
		], this.setState.bind(this))
		//  {
		// 	btext: DataFlow.get("bibledata"),
		// 	activeWid: DataFlow.get("activeWid")
		// }
		// DataFlow
		// 	.watch("bibledata", b => this.setState({btext: b}))
		// 	.watch("activeWid", w => this.setState({ activeWid: w }))
	}
	render() {
		if (!this.state.bibledata) {
			// We don't really want a blank slate...
			ApiRequest("chapterText")
			return <div />
		}
		let btextHighlight = this.state.bibledata
		if (DataFlow.get("highlightTermsSetting") && 
			Object.keys(DataFlow.get("searchHighlights")).length > 0) {
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
				direction: "rtl"
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