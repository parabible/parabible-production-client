import React from 'react'
import WordBit from './WordBit'

const LXXVerse = ({verseNumber, lxxVerse, activeWid}) => (
	<span className="lxxVerse">
		{verseNumber !== false ? (
			<span style={{
					color: "#ea4300",
					verticalAlign: "top",
					fontSize: "35%",
					fontWeight: "bold"
				}}>
				{verseNumber}&nbsp;
			</span>) : null}
		{lxxVerse.map((lword, i) => {
			const bit = {
				wid: lword.wid,
				word: lword.text,
				trailer: " "
			}
			return <WordBit key={i} wbit={bit} activeWid={activeWid} />
		})}
	</span>
)
export default LXXVerse