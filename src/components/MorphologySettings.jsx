import React, { Component } from 'react';
import DataFlow from 'util/DataFlow'
import Abbreviations from 'data/abbreviations'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

const SortableItem = SortableElement(({ value, checked, toggleCheck }) => {
	const translatedHeading = Abbreviations.termToEnglish.categories.hasOwnProperty(value) ?
		Abbreviations.termToEnglish.categories[value] : value
	return (
		<div style={{padding: "5px 3px"}}>
			<Checkbox
				label={translatedHeading}
				checked={checked}
				onChange={(x, checked) => toggleCheck(value, checked)}
				/>
		</div>
	)
})

const SortableList = SortableContainer(({ items, toggleCheck }) => {
	return (
		<div>
			{items.map((item, index) => (
				<SortableItem
					key={index}
					index={index}
					checked={item.checked}
					toggleCheck={toggleCheck}
					value={item.value} />
			))}
		</div>
	)
})

class SortableComponent extends React.Component {
	onSortEnd ({ oldIndex, newIndex }) {
		const morphSettings = DataFlow.get("morphSettings")
		const newState = arrayMove(morphSettings, oldIndex, newIndex)
		DataFlow.set("morphSettings", newState)
		this.forceUpdate()
	}
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
		return <SortableList
			helperClass="sortableDrag"
			items={items}
			pressDelay={100}
			toggleCheck={this.toggleCheck.bind(this)}
			onSortEnd={this.onSortEnd.bind(this)} />
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
				headerText='Morphology Settings'
				closeButtonAriaLabel='Close'>

				<SortableComponent />

				<div style={{ height: "60px" }}></div>
			</Panel>
		)
	}
}
export default MorphologySettings