import React from 'react'
import WordBit from './WordBit'

const AccentUnit = ({ verseNumber, accentUnit, activeWid }) => [
	verseNumber !== false ? (
		<span style={{
			color: "#ea4300",
			verticalAlign: "top",
			fontSize: "35%",
			fontWeight: "bold"
		}}>
			{verseNumber}&nbsp;
			</span>) : null,
	...accentUnit.map((bit, i) => (
		<WordBit key={i} keyIndex={i} wbit={bit} activeWid={activeWid} />
	))
]

export default AccentUnit