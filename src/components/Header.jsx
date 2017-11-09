import React from 'react'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import { ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu'
import { SwatchColorPicker } from 'office-ui-fabric-react/lib/SwatchColorPicker'
import { ColorPicker } from 'office-ui-fabric-react/lib/ColorPicker'
import DataFlow from 'util/DataFlow'
import ApiRequest from 'util/ApiRequest'
import bookDetails from 'data/bookDetails'
import AppNotify from 'util/AppNotify'

class ParabibleHeader extends React.Component {
	constructor(props) {
		super(props)
		this.state = DataFlow.bindState([
			"highlightTermsSetting",
			"screenSizeIndex",
			"reference",
			"screenSizeIndex",
			"searchTerms"
		], this.setState.bind(this))
	}
	generateTermMenuItem({ key, text, invert }) {
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
						{ id: 'default', color: "#ff8c00" },
						{ id: 'green', color: '#00ff00' },
						{ id: 'blue', color: '#0000ff' },
						{ id: 'red', color: '#ff0000' },
					]
					let selectedId = "default"
					const customColor = this.state.searchTerms.find(st => st.uid === key).color
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
					return (
						<SwatchColorPicker
							key='scp'
							columnCount={ 10 }
							cellShape={ 'square' }
							colorCells={colorOptions}
							onColorChanged={(id, color) => {
								const st = this.state.searchTerms.slice()
								const index = st.findIndex(st => st.uid === key)
								st[index].color = color
								DataFlow.set("searchTerms", st)
							}}
							selectedId={selectedId}
						/>
					);
				}
			},
			{
				name: 'Custom Color',
				key: 'customColor',
				iconProps: {
					iconName: 'Color'
				},
				subMenuProps: {
					items: [
						{
							key: "customColorPicker",
							onRender: () => <ColorPicker
								key='sp'
								color={DataFlow.get("searchTerms").find(st => st.uid === key).color || "#888"}
								alphaSliderHidden={true}
								onColorChanged={(color) => {
									const st = this.state.searchTerms.slice()
									const index = st.findIndex(st => st.uid === key)
									st[index].color = color
									DataFlow.set("searchTerms", st)
								}}
							/>
						}
					]
				}
			}
		]
		let menuItem = {
			key: key,
			name: text,
			subMenuProps: {
				items: [
					{
						key: 'edit',
						name: 'Modify',
						iconProps: {
							iconName: 'Edit'
						},
						onClick: () => {
							console.log("Modify!!!")
						}
					}, {
						key: 'invert',
						name: 'Invert',
						iconProps: {
							iconName: invert ? "CheckboxComposite" : "Checkbox"
						},
						onClick: () => {
							const st = this.state.searchTerms.slice()
							const index = st.findIndex(st => st.uid === key)
							st[index].invert = !st[index].invert
							DataFlow.set("searchTerms", st)
							this.forceUpdate()
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
							let st = this.state.searchTerms.slice()
							const index = st.findIndex(st => st.uid === key)
							st.splice(index, 1)
							DataFlow.set("searchTerms", st)
							this.forceUpdate()
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
		if (/[\u0590-\u05fe]/.test(text))
			menuItem["style"] = { fontSize: "x-large", fontFamily: DataFlow.get("fontSetting") }
		return menuItem
	}
	generateSettingsMenu(menuData, multiple=false) {
		const searchField = DataFlow.get(menuData.field)
		const isChecked = (itemName) => {
			return multiple ? 
				(searchField.indexOf(itemName) !== -1) :
				(searchField == itemName)
		}
		const clickHandler = (itemName) => {
			return multiple ? () => {
					const index = searchField.indexOf(itemName)
					if (index === -1) {
						DataFlow.set(menuData.field, searchField.concat(itemName))
					}
					else {
						var newArray = searchField.slice()
						newArray.splice(index, 1)
						DataFlow.set(menuData.field, newArray)
					}
					this.forceUpdate()
				} : () => {
					DataFlow.set(menuData.field, itemName)
					this.forceUpdate()
				}
		} 

		return menuData.items.map(item => ({
			key: item.name,
			name: item.title,
			iconProps: {
				iconName: isChecked(item.name) ? "CheckboxComposite" : "Checkbox"
			},
			onClick: clickHandler(item.name)
		}))
	}

	moveChapter(direction) {
		var referenceArray = bookDetails.reduce((previousValue, currentValue) => {
			var newReferences = [...Array(currentValue.chapters).keys()].map((i) => ({ "book": currentValue.name, "chapter": i + 1 }))
			return previousValue.concat(newReferences)
		}, [])
		var curr_ref = DataFlow.get("reference")
		var index = referenceArray.findIndex((item) => item.chapter == curr_ref.chapter && item.book == curr_ref.book)
		var newIndex = index + direction
		newIndex = newIndex >= 0 ? newIndex : referenceArray.length - 1
		newIndex = newIndex < referenceArray.length ? newIndex : 0

		DataFlow.set("reference", referenceArray[newIndex])
		ga('send', {
			hitType: 'event',
			eventCategory: 'navigate',
		})
	}

	doSearch() {
		if (this.state.searchTerms.length === 0) {
			AppNotify.send({
				type: "warning",
				message: "You have not created any search terms. Click on a word, choose an attribute to search for and click the 'Create Search Term' button."
			})
			return
		}
		const type = DataFlow.get("searchTypeSetting")
		switch(type) {
			case "normal":
				ApiRequest("termSearch")
				break
			case "wordStudy":
			case "collocation":
				break
		}
		ga('send', {
			hitType: 'event',
			eventCategory: 'search',
			eventAction: type
		})
	}

	render() {
		let nearItemList = [{
				key: 'previousChapter',
				name: "",
				iconProps: {
					iconName: 'ChevronLeftSmall'
				},
				onClick: () => this.moveChapter(-1)
			}, {
				key: 'location',
				name: this.state.reference ? this.state.reference.book + " " + this.state.reference.chapter : "Select a chapter",
				style: { fontWeight: "bold", fontSize: "large" },
				iconProps: {
					iconName: 'Dictionary',
					style: {
						color: 'black'
					}
				},
				onClick: this.props.showBookSelector
			}, {
				key: 'nextChapter',
				name: "",
				iconProps: {
					iconName: 'ChevronRightSmall'
				},
				onClick: () => this.moveChapter(1)
			}
		]
		if (this.state.screenSizeIndex > 2) {
			nearItemList.push({
				key: 'shebanq',
				name: "",
				iconProps: {
					iconName: 'OpenInNewWindow'
				},
				onClick: () => {
					const chapter = this.state.reference.chapter
					const currentBookDetail = bookDetails.find(b => b.name == this.state.reference.book)
					const shebanqBook = currentBookDetail.shebanqBook
					window.open(`http://shebanq.ancient-data.org/hebrew/text?book=${shebanqBook}&chapter=${chapter}&mr=m`,'_blank')
				}
			})
		}

		const searchTermMenuItems = this.state.searchTerms.map(st => {
			let val = "?"
			if (st.data.hasOwnProperty("voc_utf8"))
				val = st.data.voc_utf8
			else if (st.data.hasOwnProperty("tricons"))
				val = st.data.tricons
			else if (st.data.hasOwnProperty("lxxlexeme"))
				val = st.data.lxxlexeme
			else if (st.data.hasOwnProperty("gloss"))
				val = st.data.gloss
			else if (st.data.hasOwnProperty("sdbh"))
				val = st.data.sdbh
			else if (st.data.hasOwnProperty("vs") || st.data.hasOwnProperty("vt")) {
				val = st.data.hasOwnProperty("vs") ? st.data.vs + " " : ""
				val += st.data.hasOwnProperty("vt") ? st.data.vt : ""
			}
			else if (st.data.hasOwnProperty("ps") || st.data.hasOwnProperty("gn") || st.data.hasOwnProperty("nu")) {
				val = st.data.hasOwnProperty("ps") ? st.data.ps + " " : ""
				val += st.data.hasOwnProperty("nu") ? st.data.nu + " " : ""
				val += st.data.hasOwnProperty("gn") ? st.data.gn : ""
			}
			else if (st.data.hasOwnProperty("sp")) {
				val = st.data.sp
			}
			
			return this.generateTermMenuItem({
				key: st.uid, 
				text: val,
				invert: st.invert
			})
		})

		const menuRange = {
			"field": "searchRangeSetting",
			"items": [
				{ name: 'phrase', title: 'Phrase' },
				{ name: 'clause', title: 'Clause' },
				{ name: 'sentence', title: 'Sentence' },
				{ name: 'verse', title: 'Verse' }
			]
		}
		const searchRangeItems = this.generateSettingsMenu(menuRange)


		const menuType = {
			"field": "searchTypeSetting",
			"items": [
				{ name: 'normal', title: 'Normal' },
				// { name: 'collocation', title: 'Collocation' },
				// { name: 'wordStudy', title: 'Word Study' }
			]
		}
		const searchTypeItems = this.generateSettingsMenu(menuType)


		const menuFilter = {
			"field": "searchFilterSetting",
			"items": [
				{ name: 'none', title: 'None' },
				{ name: 'current', title: 'Current' },
				{ name: 'pentateuch', title: 'Pentateuch' },
				{ name: 'minorProphets', title: 'Minor Prophets' },
				{ name: 'wisdomBooks', title: 'Wisdom Books' },
				// TODO: { name: 'custom', title: 'Custom' }
			]
		}
		const searchFilterItems = this.generateSettingsMenu(menuFilter)


		const menuTextsToDisplayMain = {
			"field": "textsToDisplayMain",
			"items": [
				{ name: 'wlc', title: 'BHS (Hebrew)' },
				{ name: 'net', title: 'NET (English)' },
				{ name: 'lxx', title: 'LXX (Greek)' }
			]
		}
		const textsToDisplayMainItems = this.generateSettingsMenu(menuTextsToDisplayMain, true)
		// TODO: whatever is required to not force the WLC
		textsToDisplayMainItems[0]["disabled"] = true

		const menuTextsToDisplaySearch = {
			"field": "textsToDisplaySearch",
			"items": [
				{ name: 'wlc', title: 'BHS (Hebrew)' },
				{ name: 'net', title: 'NET (English)' },
				{ name: 'lxx', title: 'LXX (Greek)' }
			]
		}
		const textsToDisplaySearchItems = this.generateSettingsMenu(menuTextsToDisplaySearch, true)
		// TODO: whatever is required to not force the WLC
		textsToDisplaySearchItems[0]["disabled"] = true

		
		const searchSettingsItems = [
			{
				key: 'searchRange',
				name: 'Search Range',
				iconProps: {
					iconName: "Switcher"
				},
				subMenuProps: { items: searchRangeItems }
			}, {
				key: 'searchType',
				name: 'Search Type',
				iconProps: {
					iconName: "Library"
				},
				subMenuProps: { items: searchTypeItems }
			}, {
				key: 'searchFilter',
				name: 'Search Filter',
				iconProps: {
					iconName: "Filter"
				},
				subMenuProps: { items: searchFilterItems }
			}, {
				key: 'highlight',
				name: 'Highlight Terms',
				iconProps: {
					iconName: this.state.highlightTermsSetting ? "CheckboxComposite" : "Checkbox"
				},
				onClick: () => DataFlow.set("highlightTermsSetting", !this.state.highlightTermsSetting)
			}
		]
		//TODO: Add font settings
		const generalSettingsItems = [
			// {
			// 	key: 'fontSettings',
			// 	name: 'Font Settings',
			// 	iconProps: {
			// 		iconName: "Font"
			// 	}
			// },
			{
				key: 'textViewMainSettings',
				name: 'Main View Texts', //Parallel View? Syntax Diagram? Highlight Search Terms?
				iconProps: {
					iconName: "ListMirrored"
				},
				subMenuProps: { "items": textsToDisplayMainItems }
			}, {
				key: 'textViewSearchSettings',
				name: 'Search Results Texts', //Parallel View? Syntax Diagram? Highlight Search Terms?
				iconProps: {
					iconName: "SetAction"
				},
				subMenuProps: { "items": textsToDisplaySearchItems }
			}, {
				key: 'morphologySettings',
				name: 'Morphology Settings', //Which fields to show
				onClick: this.props.showMorphSettings,
				iconProps: {
					iconName: "GroupedList"
				}
			}
		]

		const searchMenuItem = {
			key: "search",
			name: this.state.screenSizeIndex < 2 || this.state.screenSizeIndex == 4 ? "Search" : "",
			icon: "Search",
			onClick: this.doSearch.bind(this)
		}
		const searchTermParentItem = {
			key: "searchTerms",
			name: this.state.screenSizeIndex < 2 ? "Search Terms" : "",
			icon: "CollapseMenu",
			subMenuProps: { items: searchTermMenuItems }
		}

		const rightItemList = [
			{
				key: "searchSettings",
				name: this.state.screenSizeIndex < 2 || this.state.screenSizeIndex == 4 ? "Search Settings" : "",
				icon: "Settings",
				subMenuProps: { items: searchSettingsItems }
			},
			{
				key: "generalSettings",
				name: this.state.screenSizeIndex < 2 || this.state.screenSizeIndex == 4 ? "Options" : "",
				icon: "PlayerSettings",
				subMenuProps: { items: generalSettingsItems }
			},
			//  {
			// 	key: 'about',
			// 	name: 'About',
			// 	iconProps: {
			// 		iconName: "Info"
			// 	}
			// }, {
			// 	key: 'help',
			// 	name: 'Help',
			// 	iconProps: {
			// 		iconName: "Lifesaver"
			// 	}
			// }
		]

		var farItemList = {}
		switch (this.state.screenSizeIndex) {
			case 0:
			case 1:
				farItemList = [{
					key: "faritems",
					name: "",
					icon: "Waffle",
					subMenuProps: { items: [
						searchMenuItem,
						searchTermParentItem,
						...rightItemList
					]}
				}]
				if (this.state.searchTerms.length === 0)
					farItemList[0].subMenuProps.items.splice(1, 1)
				break;
			case 2:
				farItemList = [
					searchMenuItem,
					searchTermParentItem,
					...rightItemList
				]
				if (this.state.searchTerms.length === 0)
					farItemList.splice(1, 1)
				break;
			case 3:
				farItemList = [
					searchMenuItem,
					...searchTermMenuItems,
					...rightItemList
				]
				break;
			case 4:
				farItemList = [
					searchMenuItem,
					...searchTermMenuItems,
					...rightItemList
				]
				break;
		}

		return <CommandBar
			isSearchBoxVisible={false}
			items={nearItemList}
			farItems={farItemList}
		/>
	}
}

export default ParabibleHeader