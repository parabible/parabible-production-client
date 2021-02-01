import React, { useState, useEffect } from 'react'
import {
	ActionButton,
	DefaultButton,
	Panel,
	PanelType,
	Nav,
} from 'office-ui-fabric-react/'
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

const getChaptersFromBookName = name =>
	bookDetails.find(b => b.name === name)?.chapters || 10

const navigateTo = reference =>
	DataFlow.set("reference", reference)

const BookSelector = ({ panelIsVisible, hidePanel }) => {
	const [newBookState, setNewBookState] = useState(DataFlow.get("reference").book)
	const [showChapterState, setShowChapterState] = useState(false)
	DataFlow.watch("reference", reference => {
		setNewBookState(reference.book)
		setShowChapterState(false)
	})

	useEffect(() => {
		if (!panelIsVisible) {
			setShowChapterState(false)
		}
	}, [panelIsVisible])

	const chapterCount = getChaptersFromBookName(newBookState)

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
				<div style={{ display: showChapterState ? "none" : "inherit" }}>
					<Nav
						// ariaLabel=""
						selectedKey={newBookState}
						onLinkClick={(_, item) => {
							setNewBookState(item.name)
							setShowChapterState(true)
						}}
						groups={bookButtons} />
				</div>
				<div className={"chapterPicker" + (showChapterState ? " show" : "")}>
					<div style={{ margin: "0.3em" }}>
						<DefaultButton
							iconProps={{ iconName: "ArrowLeftCircle" }}
							text={newBookState}
							onClick={() => {
								setShowChapterState(false)
							}}
							styles={{ root: { width: "100%" } }} />
					</div>
					{Array.from(new Array(chapterCount)).map((_, i) =>
						<ActionButton
							key={i}
							text={i + 1}
							onClick={() => {
								navigateTo({ book: newBookState, chapter: i + 1 })
								hidePanel()
							}}
							styles={{
								rootHovered: { backgroundColor: "rgb(234, 234, 234)" },
								textContainer: { minWidth: "1.9em", textAlign: "center" },
								rootPressed: { backgroundColor: "#ddd" }
							}}
						/>
					)}
				</div>
			</div>
		</Panel>
	)
}
export default BookSelector