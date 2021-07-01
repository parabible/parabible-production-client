import DataFlow from './DataFlow'

export default {
	init: () => {
		document.addEventListener('copy', (e) => {
			if (DataFlow.get("copyPointing")) {
				// We do nothing here because this is what happens by default
				// You cannot have copyPointing without also copying vowels
			}
			else {
				// We're stripping something out...
				if (DataFlow.get("copyVowels")) {
					// i.e. only strip pointing:
					const selectedText = window.getSelection().toString()
					// 0590-05AF = All accents (except these the ones in the C range
					//                         [but the C range includes stuff like sof pasuq and sin/shin dots])
					// 05BD      = Meteg
					// 05C0      = PASEQ {legarmeh}
					const strippedText = selectedText.replace(/[\u0590-\u05AF\u05BD\u05C0]/g, "")
					e.clipboardData.setData('text/plain', strippedText)
					e.preventDefault()
				}
				else {
					// i.e. strip pointing and vowels
					const selectedText = window.getSelection().toString()
					// 0590-05AF = All accents (except these the ones in the C range
					//                         [but the C range includes stuff like sof pasuq and sin/shin dots])
					// 05BD      = Meteg
					// 05C0      = PASEQ {legarmeh}
					const strippedText = selectedText.replace(/[\u0590-\u05AF\u05BD\u05C0]/g, "") // Accents
						.replace(/[\u05B0-\u05BB]/g, "") // vowels
						.replace(/\u05BC/g, "") // dagesh
						.replace(/שׁ/g, "ש") // shin
						.replace(/שׂ/g, "ש") // sin
						.replace(/[\u05C1\u05C2]/g, "") // sin/shin dot
					e.clipboardData.setData('text/plain', strippedText)
					e.preventDefault()
				}
			}
		})
	}
}

