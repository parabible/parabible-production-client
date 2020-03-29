import DataFlow from './DataFlow'

document.addEventListener('copy', (e) => {
    if (!DataFlow.get("stripDiacritics")) return

	const selectedText = window.getSelection().toString()
	// 0590-05AF = All accents (except these the ones in the C range
	//                         [but the C range includes stuff like sof pasuq and sin/shin dots])
	// 05BD      = Meteg
	// 05C0      = PASEQ {legarmeh}
    const strippedText = selectedText.replace(/[\u0590-\u05AF\u05BD\u05C0]/g,"")

    e.clipboardData.setData('text/plain', strippedText)

    e.preventDefault()
})
