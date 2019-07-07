import React from 'react'
import WordBit from './WordBit'

const LXXVerse = ({ verseNumber, lxxVerse, activeWid }) => (
	<span className="lxxVerse">
		{verseNumber !== false ? (
			<span style={{
				color: "#ea4300",
				verticalAlign: "top",
				fontSize: "8px",
				fontWeight: "bold"
			}} title={verseNumber}>
				{verseNumber.replace(/\d+:/, "")}&nbsp;
			</span>) : null}
		{lxxVerse ? lxxVerse.map((lword, i) => {
			const bit = {
				wid: lword.wid,
				word: lword.text,
				trailer: " "
			}
			return <WordBit key={i} keyIndex={i} wbit={bit} activeWid={activeWid} />
		}) : null}
	</span>
)
export default LXXVerse