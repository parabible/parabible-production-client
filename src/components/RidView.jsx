import React from 'react'
import AccentUnit from './AccentUnit'

const RidView = ({rid, ridData, activeWid}) => {
	if (ridData.hasOwnProperty("wlc")) {
		return <div style={{display: "inline"}} data-rid={ridData.key}>
			{ridData.wlc.map((accentUnit, i) =>
				<AccentUnit
					key={i}
					verseNumber={i === 0 ? (rid % 1000) : false}
					accentUnit={accentUnit}
					activeWid={activeWid} />
			)}
		</div>
	}
}
export default RidView