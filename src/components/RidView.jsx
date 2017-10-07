import React from 'react'
import AccentUnit from './AccentUnit'
import LXXVerse from './LXXVerse'
import DataFlow from 'util/DataFlow'

const fontSetting = () => {
	return `${DataFlow.get("fontSetting")}, "SBL Biblit", "Open Sans", "Arial"`
}

const wlcDisplay = (rid, wlc, activeWid) => (
	wlc.map((accentUnit, i) =>
		<AccentUnit
			key={i}
			verseNumber={i === 0 ? (rid % 1000) : false}
			accentUnit={accentUnit}
			activeWid={activeWid} />
	)
)
const lxxDisplay = (rid, lxx, activeWid) => (
	lxx ? Object.keys(lxx).map(verseUnit => (
		<LXXVerse
			key={verseUnit}
			lxxVerse={lxx[verseUnit]}
			activeWid={activeWid} />
	)) : null
)

// TODO: Do something actual with fonts for LXX
const parallelView =({rid, activeWid, ridData, thisVerseActive}) => (
	<div data-rid={rid} id={thisVerseActive ? "activeVerse" : ""} style={{display: "table", tableLayout: "fixed", width: "100%", direction: "ltr", backgroundColor: thisVerseActive ? "rgba(255,255,0,0.3)" : "inherit" }}>
		{ridData.hasOwnProperty("wlc") ? (
			<div style={{ display: "table-cell", verticalAlign: "top", direction: "rtl", fontSize: "x-large", padding: "3px 5px", fontFamily: fontSetting()}}>
				{wlcDisplay(rid, ridData.wlc, activeWid)}
			</div>
		) : ""}
		{ridData.hasOwnProperty("net") ? (
			<div style={{ display: "table-cell", verticalAlign: "top", padding: "3px 5px", fontSize: "medium" }} dangerouslySetInnerHTML={{ __html: ridData.net}} />
		) : ""}
		{ridData.hasOwnProperty("lxx") ? (
			<div style={{ display: "table-cell", verticalAlign: "top", padding: "3px 5px", fontSize: "large", fontFamily: "SBL Biblit, SBL Greek, sans" }}>
				{lxxDisplay(rid, ridData.lxx, activeWid)}
			</div>
		) : ""}
	</div>
)

const RidView = ({rid, ridData, activeWid}) => {
	const ridDataKeys = Object.keys(ridData)
	const activeVerse = DataFlow.get("activeVerse")
	const thisVerseActive = activeVerse ? location.pathname == activeVerse.url && rid % 1000 === activeVerse.verse : false
	if (ridDataKeys.length > 1) {
		return parallelView({rid, ridData, activeWid, thisVerseActive})
	}
	else {
		switch(ridDataKeys[0]) {
			case "wlc":
				return <div id={thisVerseActive ? "activeVerse" : ""} style={{
						display: "inline",
						fontFamily: fontSetting(),
						backgroundColor: thisVerseActive ? "rgba(255,255,0,0.3)" : "inherit"
					}} data-rid={rid}>
					{wlcDisplay(rid, ridData.wlc, activeWid)}
				</div>
			default:
				return <div style={{ display: "inline" }} data-rid={rid}>
					{ridData[ridDataKeys[0]]}
				</div>
		}
	}
}
export default RidView