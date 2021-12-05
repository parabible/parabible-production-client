import React from 'react'
import WordBit from './WordBit'

const PossibleVerseNumber = ({ verseNumber }) =>
	verseNumber === false
		? null
		: <span key={"v" + verseNumber} style={{
			color: "#ea4300",
			verticalAlign: "top",
			fontSize: "35%",
			fontWeight: "bold"
		}}>
			{verseNumber}&nbsp;
		</span>

const AccentUnit = React.memo(({ verseNumber, accentUnit, activeWid }) =>
	<>
		<PossibleVerseNumber verseNumber={verseNumber} />
		{accentUnit.map((bit, i) => (
			<WordBit key={i} keyIndex={i} wbit={bit} activeWid={activeWid} />
		))}
	</>
)

export default AccentUnit