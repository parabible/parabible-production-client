import React from 'react'
import DataFlow from 'util/DataFlow'
import HighlightManager from 'util/HighlightManager'

const getColor = (wbit, activeWid) => {
	if (wbit.hasOwnProperty("temperature")) {
		if (wbit.temperature == 2)
			return "#ea4300"
		else if (wbit.temperature == 1)
			return "#004578"
	}
	else if (activeWid === wbit.wid) {
		return "#0078d7"
	}
	else if (HighlightManager.shouldHighlight(wbit.wid)) {
		return HighlightManager.getHighlightColor(wbit.wid)
	}
	return "inherit"
}

const WordBit = React.memo(({ wbit, activeWid, keyIndex }) =>
	<>
		<span key={keyIndex}
			className="wbit"
			style={{ cursor: "pointer", color: getColor(wbit, activeWid) }}
			onClick={() => {
				DataFlow.set("activeWid", wbit.wid)
			}}>
			{wbit.word}
		</span>
		{wbit.trailer.replace("\n", "  ")}
	</>
)

export default WordBit
