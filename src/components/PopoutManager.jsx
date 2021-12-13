import React from 'react'

import DataFlow from '@util/DataFlow'
import { Popout } from 'react-popout-component'
import { generateReference } from '@util/ReferenceHelper'

const removeAccents = (s) => s.replace(/[\u0590-\u05AF\u05BD]/g, "")

import AccentUnit from './AccentUnit'
import LXXVerse from './LXXVerse'
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

const TableRow = ({ result }) => {
	const wlcTextArray = []
	const netTextArray = []
	const lxxTextArray = []
	result.verses.forEach(v => {
		const t = result.text.find(rt => rt.rid === v)
		if (t.hasOwnProperty("wlc")) {
			const wlc_no_accents = t.wlc.map(au => au.map(({ wid, trailer, temperature, word }) => ({ wid, trailer, temperature, word: removeAccents(word) })))
			wlcTextArray.push(wlcDisplay(v, wlc_no_accents, -1))
		}
		if (t.hasOwnProperty("net")) netTextArray.push(<span key={v} dangerouslySetInnerHTML={{ __html: t.net }}></span>)
		if (t.hasOwnProperty("lxx")) lxxTextArray.push(lxxDisplay(v, t.lxx, -1))
	})
	const tds = []
	tds.push(<td key={"ref"} width={"10%"}>{generateReference(result.verses, true)}</td>)
	if (wlcTextArray.length > 0) tds.push(<td key={"wlc"} width={"30%"} className="hebrewText">{wlcTextArray}</td>)
	if (netTextArray.length > 0) tds.push(<td key={"net"} width={"30%"}>{netTextArray}</td>)
	if (lxxTextArray.length > 0) tds.push(<td key={"lxx"} width={"30%"}>{lxxTextArray}</td>)
	return (
		<tr>{tds}</tr>
	)
}

const htmlTemplate = ({ resultCount }) => `<!DOCTYPE>
<html lang="en" dir="ltr">
<head>
	<title>Parabible - Search Results (${resultCount})</title>
	<meta charset="UTF-8">
	<style type="text/css">
		table { border-collapse: collapse; }
		caption { padding: 10px; }
		tr:hover { background-color: #f8f8f8; }
		td { border-right: 1px solid #ddd; border-bottom: 1px solid #aaa; padding: 10px; }
		td:last-child { border-right: none; }
		tr:last-child > td { border-bottom: none; }
		td.hebrewText { direction: rtl; font-family: "SBL Biblit"; font-size: x-large; }
	</style>
</head>
<body></body>
</html>
`

const PopoutManager = ({ popoutExit }) => {
	const rObj = DataFlow.get("searchResults")
	const rCount = rObj.results.length
	const countString = rObj.truncated ? `${rCount}/${rObj.truncated}` : rCount
	return <Popout onClose={popoutExit} html={htmlTemplate({ resultCount: countString })}>
		<table>
			<caption><b>Search Results ({countString})</b></caption>
			<tbody>
				{rObj.results.map(result => (
					<TableRow key={result.node} result={result} />
				))}
			</tbody>
		</table>
	</Popout>
}
export default PopoutManager