import DataFlow from './DataFlow'

document.addEventListener('copy', (e) => {
    if (!DataFlow.get("stripDiacritics")) return

    const selectedText = window.getSelection().toString()
    const strippedText = selectedText.replace(/[\u0590-\u05AF\u05BD]/g,"")

    e.clipboardData.setData('text/plain', strippedText)

    e.preventDefault()
})