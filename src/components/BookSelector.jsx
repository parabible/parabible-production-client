import React, { useState } from 'react'
import { ActionButton, Panel, PanelType, Nav } from 'office-ui-fabric-react/'
import DataFlow from 'util/DataFlow'
import bookDetails from 'data/bookDetails'

const bookButtons = [{
	links: bookDetails.map((b, i) =>
		({
			name: b.name,
			key: b.name,
		})
	)
}]
const chapterButtons = chapterCount => [{
	links: Array.from(new Array(chapterCount)).map((_, i) =>
		({
			name: i + 1,
			key: i,
		})
	)
}]

const getChaptersFromBookName = name =>
	bookDetails.find(b => b.name === name)?.chapters || 10


const BookSelector = ({ panelIsVisible, hidePanel }) => {
	const [state, setState] = useState({
		reference: DataFlow.get("reference"),
		newBook: DataFlow.get("reference").book,
		showChapters: false
	})
	DataFlow.watch("reference", reference => setState({ reference }))

	const chapterCount = getChaptersFromBookName(state.newBook)

	return (
		<Panel
			isBlocking={true}
			isOpen={panelIsVisible}
			onDismiss={hidePanel}
			type={PanelType.smallFixedNear}
			isLightDismiss={true}
			isHiddenOnDismiss={true}
			headerText='Navigate'
			headerTextProps={{ style: { fontSize: "medium", fontWeight: 400 } }}
			closeButtonAriaLabel='Close'
		>
			<div>
				<div style={{ display: state.showChapters ? "none" : "inherit" }}>
					<Nav
						// ariaLabel=""
						selectedKey={state.newBook}
						onLinkClick={(_, item) => setState({ newBook: item.name, showChapters: true })}
						groups={bookButtons} />
				</div>
				<div style={{ display: state.showChapters ? "inherit" : "none" }}>
					{Array.from(new Array(chapterCount)).map((_, i) =>
						<ActionButton text={i + 1} />
					)}
				</div>
			</div>
		</Panel>
	)
}
export default BookSelector