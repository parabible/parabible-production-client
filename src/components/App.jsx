import React from 'react'

import { registerIcons, loadTheme } from '@uifabric/styling'
import {
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
	ChevronDown as ChevronDownIcon,

	X as CloseIcon,

	Square as CheckboxEmptyIcon,
	XSquare as CheckboxCheckedIcon,

	Columns as ColumnsIcon,
	Edit3 as EditIcon,
	Trash2 as TrashIcon,

	Youtube as YoutubeIcon,

	Link as LinkIcon,
	Plus as AddIcon,
	Filter as FilterIcon,
	Layers as LayersIcon,
	Droplet as DropletIcon,
	Printer as PrintIcon,
	Book as BookIcon,
	ExternalLink as ExternalLinkIcon,
	Crosshair as CrosshairIcon,

	Search as SearchIcon,
	Settings as SettingsIcon,
	Sliders as SlidersIcon,
	Menu as MenuIcon,
	Info as InfoIcon,
} from 'react-feather'
registerIcons({
	icons: {
		ChevronLeftSmall: <ChevronLeftIcon width="16" height="100%" />,
		ChevronLeft: <ChevronLeftIcon width="16" height="100%" />,
		ChevronRightSmall: <ChevronRightIcon width="16" height="100%" />,
		ChevronRight: <ChevronRightIcon width="16" height="100%" />,
		ChevronDown: <ChevronDownIcon width="16" height="100%" />,

		Close: <CloseIcon width="16" height="100%" />,
		Clear: <CloseIcon width="16" height="100%" />,
		Print: <PrintIcon width="16" height="100%" />,

		CheckSquare: <CheckboxCheckedIcon width="16" height="100%" />,
		Square: <CheckboxEmptyIcon width="16" height="100%" />,

		OpenInNewWindow: <ExternalLinkIcon width="16" height="100%" />,
		Youtube: <YoutubeIcon width="16" height="100%" />,
		Link: <LinkIcon width="16" height="100%" />,
		Add: <AddIcon width="16" height="100%" />,

		Edit: <EditIcon width="16" height="100%" />,
		Trash: <TrashIcon width="16" height="100%" />,
		Color: <DropletIcon width="16" height="100%" />,

		Switch: <CrosshairIcon width="16" height="100%" />,
		Filter: <FilterIcon width="16" height="100%" />,
		Columns: <ColumnsIcon width="16" height="100%" />,
		Tasks: <LayersIcon width="16" height="100%" />,
		Dictionary: <BookIcon width="16" height="100%" />,

		Search: <SearchIcon width="16" height="100%" />,
		Settings: <SettingsIcon width="16" height="100%" />,
		ColumnOptions: <SlidersIcon width="16" height="100%" />,
		CollapseMenu: <MenuIcon width="16" height="100%" />,
		Info: <InfoIcon width="16" height="100%" />,
	}
})

const myTheme = loadTheme({
	defaultFontStyle: { 
		fontFamily: 'SelawikRegular'
		/* can add stuff like font-weight here as well */
	},
	palette: {
		themePrimary: '#106ebe',
		themeLighterAlt: '#f3f8fc',
		themeLighter: '#d1e4f5',
		themeLight: '#abcdec',
		themeTertiary: '#61a1d9',
		themeSecondary: '#267cc7',
		themeDarkAlt: '#0e62ac',
		themeDark: '#0c5391',
		themeDarker: '#093d6b',
		neutralLighterAlt: '#eeeeee',
		neutralLighter: '#eaeaea',
		neutralLight: '#e1e1e1',
		neutralQuaternaryAlt: '#d1d1d1',
		neutralQuaternary: '#c8c8c8',
		neutralTertiaryAlt: '#c0c0c0',
		neutralTertiary: '#a19f9d',
		neutralSecondary: '#605e5c',
		neutralPrimaryAlt: '#3b3a39',
		neutralPrimary: '#323130',
		neutralDark: '#201f1e',
		black: '#000000',
		white: '#f4f4f4',
	}
});

import Header from 'components/Header'
import Content from 'components/Content'
import Footer from 'components/Footer'
import MorphologySidebar from 'components/MorphologySidebar'
import MorphologyPopup from 'components/MorphologyPopup'
import MorphologySettings from 'components/MorphologySettings'
import BookSelector from 'components/BookSelector'
import ResultsOverlay from 'components/ResultsOverlay'
import PopoutManager from 'components/PopoutManager'

import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

// This just executes and should run before DataFlow
import MediaBreakpoints from 'util/MediaBreakpoints'

import DataFlow from 'util/DataFlow'
import AppNotify from 'util/AppNotify'
import TextDisplayManager from 'util/TextDisplayManager'

const ESCAPE_KEY = 27;

class App extends React.Component {

	_handleKeyup(event) {
		switch (event.keyCode) {
			case ESCAPE_KEY:
				this.setState({ "showResults": false })
				break
			default:
				break
		}
	}
	// componentWillMount deprecated in React 16.3
	componentDidMount() {
		document.addEventListener("keyup", this._handleKeyup.bind(this))
	}
	componentWillUnmount() {
		document.removeEventListener("keyup", this._handleKeyup.bind(this))
	}

	constructor(props) {
		super(props)
		this.state = {
			showBookSelector: false,
			showMorphSettings: false,
			appMessages: DataFlow.get("appMessages"),
			reference: {
				"book": "Genesis",
				"chapter": 1,
			},
			screenSizeIndex: DataFlow.get("screenSizeIndex"),
			showMorphPopup: false,
			showResults: false,
			showNewTabSearchResults: false
		}
		DataFlow.watch("screenSizeIndex", n => {
			this.setState({ "screenSizeIndex": n })
		}).watch("worddata", () => {
			this.setState({ showMorphPopup: true })
		}).watch("searchResults", () => {
			const r = DataFlow.get("searchResults")
			if (r && Object.keys(r).length > 0) {
				this.setState({ showResults: true })
			}
			else {
				AppNotify.send({
					type: "info",
					message: "Your search did not return any results"
				})
			}
		}).watch("appMessages", m => {
			this.setState({ appMessages: m })
		})
	}
	setPanelDisplay(panel, visibile) {
		const panelNames = {
			"bookSelector": "showBookSelector",
			"morphSettings": "showMorphSettings",
			"resultsOverlay": "showResults"
		}
		const state = {}
		state[panelNames[panel]] = visibile
		this.setState(state)
	}
	removeMessage(index) {
		this.setState({ messages: this.state.appMessages.filter((v, i) => i !== index) })
	}
	render() {
		const mainMaxWidth = this.state.screenSizeIndex == 4 ? "1050px" : "760px"
		const morphWidth = this.state.screenSizeIndex == 4 ? "290px" :
			this.state.screenSizeIndex == 3 ? "210px" : "160px"

		return (
			<div style={{
				fontFamily: `${DataFlow.get("fontSetting")}, "SBL BibLit", "Open Sans", "Arial"`,
				fontSize: "xx-large",
				lineHeight: 1.6,
				height: "100%",
				overflow: "hidden"
			}}>
				<div id="headerbar">
					<Header
						showBookSelector={() => this.setPanelDisplay("bookSelector", true)}
						showMorphSettings={() => this.setPanelDisplay("morphSettings", true)} />
				</div>
				<div style={{
					position: "fixed",
					left: 0,
					right: 0,
					top: 40,
					bottom: 0,
					overflowX: "hidden",
					overflowY: "auto",
					WebkitOverflowScrolling: "touch"
				}}>
					<div style={{ display: "flex", maxWidth: mainMaxWidth, margin: "auto", paddingTop: 10, verticalAlign: "top" }}>
						{this.state.screenSizeIndex > 1 ? (
							<div style={{ flex: 1 }}>
								<div id="morphbar">
									<MorphologySidebar />
								</div>
							</div>
						) : null}
						<div style={{ flex: 3 }}>
							<Content />
						</div>
					</div>
					<Footer />
				</div>

				{this.state.screenSizeIndex <= 1 && this.state.showMorphPopup ? (
					<div id="morphpopup">
						<MorphologyPopup hidePopup={() => this.setState({ showMorphPopup: false })} />
					</div>
				) : null}

				{/* PANELS */}
				<BookSelector
					panelIsVisible={this.state.showBookSelector}
					hidePanel={() => this.setPanelDisplay("bookSelector", false)} />
				<MorphologySettings
					panelIsVisible={this.state.showMorphSettings}
					hidePanel={() => this.setPanelDisplay("morphSettings", false)} />
				<ResultsOverlay
					panelIsVisible={this.state.showResults}
					hideOverlay={() => this.setPanelDisplay("resultsOverlay", false)}
					showPopout={() => this.setState({ "showNewTabSearchResults": true })} />

				{/* NOTIFICATIONS */}
				<div style={{ position: "absolute", left: "50px", right: "50px", top: "50px", zIndex: 10 }}>
					{this.state.appMessages.map((m, index) =>
						<MessageBar key={index} messageBarType={MessageBarType[m.type]}
							onDismiss={() => AppNotify.remove(m.mid)}>
							{m.message}
						</MessageBar>
					)}
				</div>

				{/* POPOUT WINDOW*/}
				{this.state.showNewTabSearchResults ?
					<PopoutManager popoutExit={() => this.setState({ "showNewTabSearchResults": false })}></PopoutManager>
					: ""}
			</div>
		)
	}
}
export default App
