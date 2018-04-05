import React from 'react'

import DataFlow from 'util/DataFlow'
import Popout from 'react-popout'
import { generateReference, generateURL } from 'util/ReferenceHelper'

const removeAccents = (s) => s.replace(/[\u0590-\u05AF\u05BD]/g,"")

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

const TableRow = ({result}) => {
    console.log(result.verses)
    const wlcTextArray = []
    const netTextArray = []
    const lxxTextArray = []
    result.verses.forEach(v => {
        const t = result.text[v]
        if (t.hasOwnProperty("wlc")) {
            const wlc_no_accents = t.wlc.map(au => au.map(({wid, trailer, temperature, word}) => ({wid, trailer, temperature, word: removeAccents(word)})))
            wlcTextArray.push(wlcDisplay(v, wlc_no_accents, -1))
        }
        if (t.hasOwnProperty("net")) netTextArray.push(<span dangerouslySetInnerHTML={{ __html: t.net}}></span>)
        if (t.hasOwnProperty("lxx")) lxxTextArray.push(lxxDisplay(v, t.lxx, -1))
    })
    console.log(wlcTextArray, netTextArray, lxxTextArray)
    return (
        <tr>
            <td width={"10%"}>{generateReference(result.verses, true)}</td>
            {wlcTextArray.length > 0 ? (
                <td width={"30%"} className="largeText">{wlcTextArray}</td>
            ) : ""}
            {netTextArray.length > 0 ? (
                <td width={"30%"}>{netTextArray}</td>
            ) : ""}
            {lxxTextArray.length > 0 ? (
                <td width={"30%"}>{lxxTextArray}</td>
            ) : ""}
        </tr>
    )
}

const PopoutManager = ({popoutExit}) => {
    DataFlow.get("searchResults").results.forEach(result => (
        console.log(result.text[10007006])
    ))
    return <Popout url='/resultstable.html' title='Window title' onClosing={popoutExit}>
        <table>
            {DataFlow.get("searchResults").results.map(result => (
                <TableRow key={result.node} result={result} />
            ))}
        </table>
    </Popout>
}
export default PopoutManager