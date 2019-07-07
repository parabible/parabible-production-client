import React from 'react'
import DataFlow from 'util/DataFlow'

const WordBit = ({ wbit, activeWid, keyIndex }) => {
	const styles = { cursor: "pointer" }
	if (wbit.hasOwnProperty("temperature")) {
		if (wbit.temperature == 2)
			styles.color = "#ea4300"
		else if (wbit.temperature == 1)
			styles.color = "#004578"
	}
	if (wbit.hasOwnProperty("searchHighlight")) {
		const term = DataFlow.get("searchTerms").find(st => st.uid === wbit.searchHighlight)
		const color = term && term.hasOwnProperty("color") ? term.color : false
		styles.color = color || "#ff8c00"
	}
	if (activeWid === wbit.wid)
		styles.color = "#0078d7"

	return [
		<span key={keyIndex} className="wbit" style={styles}
			onClick={() => {
				DataFlow.set("activeWid", wbit.wid)
			}}>
			{wbit.word}
		</span>,
		wbit.trailer.replace("\n", "  ")
	]
}
export default WordBit
