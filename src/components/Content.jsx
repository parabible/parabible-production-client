import React from 'react'
import DataFlow from 'util/DataFlow'
import RidView from 'components/RidView'
import LicenseView from 'components/LicenseView'
import ContentHeader from 'components/ContentHeader'
import ApiRequest from 'util/ApiRequest'

class Content extends React.Component {
	constructor(props) {
		super(props)
		this.state = DataFlow.bindState([
			"bibledata",
			"activeWid",
			"searchTerms",
			"searchHighlights",
			"highlightTermsSetting",
			"screenSizeIndex"
		], this.setState.bind(this))
	}
	componentDidMount() {
		if (DataFlow.get("activeVerse")) {
			// There seems to be a redraw that messes this up
			// even with requestAnimationFrame
			// so we resort to a timer...
			window.setTimeout(() => {
				const $vEl = document.querySelector("#activeVerse")
				if ($vEl) {
					$vEl.scrollIntoView(true)
				}
			}, 1000)
		}
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
			const hSet = Object.keys(sh).reverse().map(k => ({
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
		const licenseList = new Set()
		Object.keys(btextHighlight).forEach(rid => 
			Object.keys(btextHighlight[rid]).forEach(k => licenseList.add(k))
		)
		return (
			<div style={{
				margin: "auto",
				maxWidth: "760px",
				padding: "5px 20px 50px 20px",
				direction: "rtl",
				userSelect: DataFlow.get("screenSizeIndex") > 2 ? "text" : "none",
				cursor: "text"
				}}>
				{this.state.screenSizeIndex > 1 ? <ContentHeader openColumns={Array.from(licenseList)} /> : null}
				{Object.keys(btextHighlight).map(k => 
					<RidView
						key={k}
						rid={+k}
						ridData={btextHighlight[k]}
						activeWid={this.state.activeWid} />
				)}
				<div style={{direction:"ltr", fontFamily:"sans-serif", fontSize: "x-small", marginTop: "40px", paddingTop: "10px", borderTop: "1px solid #aaa"}}>
					<LicenseView license={Array.from(licenseList)} />
				</div>
			</div>
		)
	}
}
export default Content