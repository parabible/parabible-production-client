import React from 'react'
import AccentUnit from './AccentUnit'
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
	"need some lxx things..."
	// wlc.map((accentUnit, i) =>
	// 	<AccentUnit
	// 		key={i}
	// 		verseNumber={i === 0 ? (rid % 1000) : false}
	// 		accentUnit={accentUnit}
	// 		activeWid={activeWid} />
	// )
)

const parallelView =({rid, activeWid, ridData}) => (
	<div data-rid={rid} style={{display: "table", tableLayout: "fixed", width: "100%" }}>
		{ridData.hasOwnProperty("wlc") ? (
			<div style={{ display: "table-cell", verticalAlign: "top", direction: "rtl", fontSize: "x-large", padding: "3px 5px", fontFamily: fontSetting()}}>
				{wlcDisplay(rid, ridData.wlc, activeWid)}
			</div>
		) : ""}
		{ridData.hasOwnProperty("net") ? (
			<div style={{ display: "table-cell", verticalAlign: "top", padding: "3px 5px" }} dangerouslySetInnerHTML={{ __html: ridData.net}} />
		) : ""}
		{ridData.hasOwnProperty("lxx") ? (
			<div style={{ display: "table-cell", verticalAlign: "top", padding: "3px 5px" }}>
				{lxxDisplay(rid, ridData.lxx, activeWid)}
			</div>
		) : ""}
	</div>
)

const RidView = ({rid, ridData, activeWid}) => {
	const ridDataKeys = Object.keys(ridData)
	if (ridDataKeys.length > 1) {
		return parallelView({rid, ridData, activeWid})
	}
	else {
		switch(ridDataKeys[0]) {
			case "wlc":
				return <div style={{
						display: "inline",
						fontFamily: fontSetting()
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