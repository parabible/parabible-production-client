import React from 'react'
import DataFlow from 'util/DataFlow'
import RidView from 'components/RidView'
import LicenseView from 'components/LicenseView'
import ContentHeader from 'components/ContentHeader'
import ApiRequest from 'util/ApiRequest'
import { isNewTestament } from 'util/ReferenceHelper'

class Content extends React.Component {
	constructor(props) {
		super(props)
		this.state = DataFlow.bindState([
			"bibledata",
			"activeWid", ,
			"screenSizeIndex"
		], this.setState.bind(this))

		DataFlow.watch("searchTerms", () => this.forceUpdate())
		DataFlow.watch("searchHighlights", () => this.forceUpdate())
		DataFlow.watch("highlightTermsSetting", () => this.forceUpdate())
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
					// This is kind of hacky but I need to scroll this div a bit...
					// The sticky header looks like its about 30px but it's got about 1px of margin
					// 60 gives a bit of breathing room and makes it clear there's content above.
					document.querySelector("#headerbar ~ div").scrollTop -= 60
				}
			}, 1000)
		}
	}
	render() {
		if (!this.state.bibledata || !Array.isArray(DataFlow.get("bibledata"))) {
			// We don't really want a blank slate...
			ApiRequest("chapterText")
			return <div />
		}
		let btextHighlight = DataFlow.get("bibledata")
		const licenseList = new Set()
		btextHighlight.forEach(verse =>
			Object.keys(verse).forEach(k => licenseList.add(k))
		)
		licenseList.delete("rid")
		const isNT = isNewTestament(DataFlow.get("reference"))
		const ttd = DataFlow.get(isNT ? "textsToDisplayMainNT" : "textsToDisplayMainOT")
		const orderedColumns = [...licenseList].sort((a, b) => ttd.indexOf(a) - ttd.indexOf(b))

		return (
			<div style={{
				margin: "auto",
				maxWidth: "760px",
				padding: "5px 20px 50px 20px",
				direction: licenseList.has("wlc") ? "rtl" : "ltr",
				userSelect: DataFlow.get("screenSizeIndex") > 2 ? "text" : "none",
				cursor: "text"
			}}>
				{this.state.screenSizeIndex > 1 ? <ContentHeader openColumns={orderedColumns} isNT={isNT} /> : null}
				{btextHighlight.map(verse =>
					<RidView
						key={verse.rid}
						ridDataWithRid={verse}
						activeWid={this.state.activeWid} />
				)}
				<div style={{ direction: "ltr", fontFamily: "Ubuntu, sans-serif", fontSize: "x-small", marginTop: "40px", paddingTop: "10px", borderTop: "1px solid #aaa" }}>
					<LicenseView license={orderedColumns} />
				</div>
			</div>
		)
	}
}
export default Content
