import React from 'react';
import DataFlow from 'util/DataFlow'
import Abbreviations from 'data/abbreviations'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'

const OptionItem = ({ value, checked, toggleCheck }) => {
	const translatedHeading = Abbreviations.termToEnglish.categories.hasOwnProperty(value) ?
		Abbreviations.termToEnglish.categories[value] : value
	return (
		<div style={{ padding: "5px 3px" }}>
			<Checkbox
				label={translatedHeading}
				checked={checked}
				onChange={(x, checked) => toggleCheck(value, checked)}
			/>
		</div>
	)
}

class OptionComponent extends React.Component {
	toggleCheck(value, checked) {
		const morphSettings = DataFlow.get("morphSettings")
		const newState = morphSettings.map(m => {
			if (m.heading == value)
				m.visible = !m.visible
			return m
		})
		DataFlow.set("morphSettings", newState)
		this.forceUpdate()
	}
	render() {
		const morphSettings = DataFlow.get("morphSettings")
		const items = morphSettings.map(m => {
			return {
				value: m.heading,
				checked: m.visible
			}
		})
		return <div>
			{items.map((item, index) =>
				<OptionItem
					key={index}
					value={item.value}
					checked={item.checked}
					toggleCheck={() => this.toggleCheck(item.value, item.checked)} />
			)}
		</div>
	}
}

const checkMorphsAreAllAvailable = () => {
	let mset = DataFlow.get("morphSettings")
	const msetkeys = mset.map(m => m.heading)
	const wdata = DataFlow.get("worddata")
	Object.keys(wdata).forEach(k => {
		if (msetkeys.indexOf(k) < 0) {
			mset.push({ "heading": k, "visible": false })
		}
	})
	DataFlow.set("morphSettings", mset)
}
class MorphologySettings extends React.Component {
	render() {
		checkMorphsAreAllAvailable()
		return (
			<Panel
				isBlocking={true}
				isOpen={this.props.panelIsVisible}
				onDismiss={this.props.hidePanel}
				type={PanelType.smallFixedNear}
				isLightDismiss={true}
				isHiddenOnDismiss={true}
				headerText='Morphology Settings'
				headerTextProps={{ style: { fontSize: "medium", fontWeight: 400 } }}
				closeButtonAriaLabel='Close'>

				<OptionComponent />

				<div style={{ height: "60px" }}></div>
			</Panel>
		)
	}
}
export default MorphologySettings