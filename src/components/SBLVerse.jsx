import React from 'react'
import WordBit from './WordBit'

const SBLVerse = ({verseNumber, text, activeWid}) => (
	<span className="sblVerse">
		{verseNumber !== false ? (
			<span style={{
					color: "#ea4300",
					verticalAlign: "top",
					fontSize: "35%",
					fontWeight: "bold"
				}}>
				{verseNumber}&nbsp;
			</span>) : null}
		{text ? text.map((word, i) => {
			return <WordBit key={i} wbit={word} activeWid={activeWid} />
		}) : null}
	</span>
)
export default SBLVerse