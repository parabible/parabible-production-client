import React from 'react'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
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
		// {
		// 	highlightTerms: DataFlow.get("highlightTermsSetting"),
		// 	screenSizeIndex: DataFlow.get("screenSizeIndex"),
		// 	reference: DataFlow.get("reference")
		// }
		// DataFlow.watch("highlightTermsSetting", h => {
		// 	this.setState({ "highlightTerms": h })
		// }).watch("reference", (r) => {
		// 	this.setState({ "reference": r })
		// }).watch("screenSizeIndex", (n) => {
		// 	this.setState({ "screenSizeIndex": n })
		// }).watch("searchTerms", (n) => {
		// 	this.forceUpdate()
		// })
	}
	generateTermMenuItem({ key, text, invert }) {
		let menuItem = {
			key: key,
			name: text,
			subMenuProps: {
				items: [{
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
					}
				}]
			}
		}
		if (/[\u0590-\u05fe]/.test(text))
			menuItem["style"] = { fontSize: "x-large", fontFamily: DataFlow.get("fontSetting") }
		return menuItem
	}
	generateSettingsMenu(menuData) {
		const searchField = DataFlow.get(menuData.field)
		return menuData.items.map(item => ({
			key: item.name,
			name: item.title,
			iconProps: {
				iconName: searchField == item.name ? "CheckboxComposite" : "Checkbox"
			},
			onClick: () => {
				DataFlow.set(menuData.field, item.name)
				this.forceUpdate()
			}
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

		const searchTermMenuItems = this.state.searchTerms.map(st => {
			let val = "?"
			if (st.data.hasOwnProperty("voc_utf8"))
				val = st.data.voc_utf8
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
				// TODO: { name: 'custom', title: 'Custom' }
			]
		}
		const searchFilterItems = this.generateSettingsMenu(menuFilter)

		
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
		const generalSettingsItems = [
			{
				key: 'fontSettings',
				name: 'Font Settings',
				iconProps: {
					iconName: "Font"
				}
			}, {
				key: 'textSettings',
				name: 'Text Settings', //Parallel View? Syntax Diagram? Highlight Search Terms?
				iconProps: {
					iconName: "ListMirrored"
				},
				subMenuProps: { "items": [
				]}
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