import React from 'react'
import DataFlow from 'util/DataFlow'

const WordBit = ({wbit, activeWid}) => {
	const styles = { cursor: "pointer" }
	if (wbit.hasOwnProperty("searchHighlight"))
		styles.color = "#ff8c00"
	if (activeWid === wbit.wid)
		styles.color = "#0078d7"
	const bitstyles = {}
	if (wbit.hasOwnProperty("temperature")) {
		if (wbit.temperature == 2)
			bitstyles.color = "#ea4300"
		else if (wbit.temperature == 1)
			bitstyles.color = "#004578"
	}
	return <span style={bitstyles}>
		<span className="wbit" style={styles}
			onClick={() => {
				DataFlow.set("activeWid", wbit.wid)
			}}>
			{wbit.word}
		</span>
		<span className="word_trailer">
			{wbit.trailer.replace("\n", "  ")}
		</span>
	</span>
}
export default WordBit
