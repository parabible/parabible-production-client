import React from 'react'
import DataFlow from 'util/DataFlow'

const WordBit = ({wbit, activeWid}) => {
	const styles = { cursor: "pointer"}
	if (activeWid === wbit.wid)
		styles.color = "#0078d7"
	return <span>
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
