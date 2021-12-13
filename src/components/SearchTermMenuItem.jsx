import React from 'react'
import DataFlow from '@util/DataFlow'

import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu'
import { SwatchColorPicker } from 'office-ui-fabric-react/lib/SwatchColorPicker'
// import { ColorPicker } from 'office-ui-fabric-react/lib/ColorPicker'

const menuText = (term_data) => {
	let ret_text = "?"
	if (term_data.hasOwnProperty("voc_utf8"))
		ret_text = term_data.voc_utf8
	else if (term_data.hasOwnProperty("tricons"))
		ret_text = term_data.tricons
	else if (term_data.hasOwnProperty("lxxlexeme"))
		ret_text = term_data.lxxlexeme
	else if (term_data.hasOwnProperty("gloss"))
		ret_text = term_data.gloss
	else if (term_data.hasOwnProperty("sdbh"))
		ret_text = term_data.sdbh
	else if (term_data.hasOwnProperty("vs") || term_data.hasOwnProperty("vt")) {
		ret_text = term_data.hasOwnProperty("vs") ? term_data.vs + " " : ""
		ret_text += term_data.hasOwnProperty("vt") ? term_data.vt : ""
	}
	else if (term_data.hasOwnProperty("ps") || term_data.hasOwnProperty("gn") || term_data.hasOwnProperty("nu")) {
		ret_text = term_data.hasOwnProperty("ps") ? term_data.ps + " " : ""
		ret_text += term_data.hasOwnProperty("nu") ? term_data.nu + " " : ""
		ret_text += term_data.hasOwnProperty("gn") ? term_data.gn : ""
	}
	else if (term_data.hasOwnProperty("sp")) {
		ret_text = term_data.sp
	}
	return ret_text
}


const generateSearchTermMenuItem = ({ uid }) => {
	const term = DataFlow.get("searchTerms").find(s => s.uid === uid)
	const menu_text = menuText(term.data)

	const colorMenuSection = [{
		key: 'section',
		itemType: ContextualMenuItemType.Divider
	}, {
		key: 'color',
		name: 'Highlight Colour',
		iconProps: {
			iconName: 'Trash',
			style: {
				color: 'red'
			}
		},
		onRender: () => {
			let colorOptions = [
				{ id: 'default', color: "#FF8C00" },
				{ id: 'green', color: '#107C10' },
				{ id: 'blue', color: '#00B294' },
				{ id: 'red', color: '#A80000' }
			]
			let selectedId
			const customColor = DataFlow.get("searchTerms").find(st => st.uid === uid).color
			if (customColor) {
				const idx = colorOptions.findIndex(c => c.color === customColor)
				if (idx >= 0) {
					selectedId = colorOptions[idx].id
					colorOptions.push({ id: 'custom', color: "#888888" })
				}
				else {
					selectedId = "custom"
					colorOptions.push({ id: 'custom', color: customColor })
				}
			}
			else {
				selectedId = "default"
				colorOptions.push({ id: 'custom', color: "#888888" })
			}
			return <SwatchColorPicker
				key='scp'
				columnCount={10}
				cellShape={'square'}
				colorCells={colorOptions}
				onColorChanged={(id, color) => {
					const st = DataFlow.get("searchTerms").slice()
					const index = st.findIndex(st => st.uid === uid)
					st[index].color = color
					DataFlow.set("searchTerms", st)
					ga('send', {
						hitType: 'event',
						eventCategory: 'swatchColorPick',
						eventAction: color
					})
				}}
				selectedId={selectedId}
			/>
		}
	},
		// {
		// 	name: 'Custom Color',
		// 	key: 'customColor',
		// 	iconProps: {
		// 		iconName: 'Color'
		// 	},
		// 	subMenuProps: {
		// 		items: [
		// 			{
		// 				key: "customColorPicker",
		// 				onRender: () => <ColorPicker
		// 					key='sp'
		// 					color={DataFlow.get("searchTerms").find(st => st.uid === uid).color || "#888"}
		// 					alphaSliderHidden={true}
		// 					onColorChanged={(color) => {
		// 						const st = DataFlow.get("searchTerms").slice()
		// 						const index = st.findIndex(st => st.uid === uid)
		// 						st[index].color = color
		// 						DataFlow.set("searchTerms", st)
		// 					}}
		// 				/>
		// 			}
		// 		]
		// 	}
		// }
	]
	let menuItem = {
		key: uid,
		name: menu_text,
		subMenuProps: {
			items: [
				// {
				// 	key: 'edit',
				// 	name: 'Modify',
				// 	iconProps: {
				// 		iconName: 'Edit'
				// 	},
				// 	onClick: () => {
				// 		console.log("Modify!!!")
				// 	}
				// },
				{
					key: 'invert',
					name: 'Invert',
					iconProps: {
						iconName: term.invert ? "CheckSquare" : "Square"
					},
					onClick: () => {
						const st = DataFlow.get("searchTerms").slice()
						const index = st.findIndex(st => st.uid === uid)
						st[index].invert = !st[index].invert
						DataFlow.set("searchTerms", st)
					}
				}, {
					key: 'delete',
					name: 'Remove',
					iconProps: {
						iconName: 'Trash',
						style: {
							color: 'red'
						}
					},
					onClick: () => {
						let st = DataFlow.get("searchTerms").slice()
						const index = st.findIndex(st => st.uid === uid)
						st.splice(index, 1)
						DataFlow.set("searchTerms", st)
						ga('send', {
							hitType: 'event',
							eventCategory: 'searchTerms',
							eventAction: "remove"
						})
					}
				}
			]
		}
	}
	if (DataFlow.get("highlightTermsSetting"))
		menuItem["subMenuProps"]["items"].push(...colorMenuSection)
	if (/[\u0590-\u05fe]/.test(menu_text))
		menuItem["style"] = { fontSize: "x-large", fontFamily: "SBL Biblit" }
	return menuItem
}
export default generateSearchTermMenuItem
