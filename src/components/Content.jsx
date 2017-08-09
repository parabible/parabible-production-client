import React from 'react'
import DataFlow from '../util/DataFlow'
import RidView from './RidView'

class Content extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			bibledata: DataFlow.get("bibledata"),
			screenSizeIndex: DataFlow.get("screenSizeIndex"),
			activeWid: DataFlow.get("activeWid")
		}
		DataFlow.watch("bibledata", b =>
			this.setState({ "bibledata": b })
		).watch("screenSizeIndex", n => {
			this.setState({ "screenSizeIndex": n })
		}).watch("activeWid", w => {
			this.setState({ "activeWid": w })
		})
	}
	render() {
		const btext = this.state.bibledata
		if (!btext)
			return <div />
		return (
			<div style={{
				margin: "auto",
				maxWidth: "760px",
				padding: "5px 20px 50px 20px",
				direction: "rtl"
				}}>
				{Object.keys(btext).map(k => 
					<RidView key={k} rid={k} ridData={btext[k]} activeWid={this.state.activeWid} />
				)}
			</div>
		)
	}
}
export default Content

/* btext[k].wlc.map(accentUnit =>
						accentUnit.map(wbit => wbit.word + wbit.trailer)
					) */