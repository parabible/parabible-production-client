import books from 'data/bookDetails'
import generousBookNames from 'data/generousBookNames'

const _matchBook = (urlBook) => {
	// first see if we can map directly
	const possibleKey = urlBook.toLowerCase()
	const generousNameList = Object.keys(generousBookNames)
	if (generousNameList.indexOf(possibleKey) > -1) {
		return generousBookNames[possibleKey]
	}

	// now try use regex to guess
	const bookNames = books.map(b => b.name)
	const urlArray = urlBook.split("")
	const r = new RegExp("^" + urlArray.join(".*"), "i")
	return bookNames.reduce((a, v) => {
		if (a) return a
		return r.test(v) ? v : a
	}, false)
}

const UrlToReference = (url) => {
	//1. strip leading stuff if it's there
	// const urlStripped = url.slice(1)
	//2. separate book and chapter
	const decodedURL = decodeURI(url)
	const urlParts = decodedURL.split("/")
	const bookPart = urlParts[1].replace("-", " ")
	const chapter = urlParts[2] ? parseInt(urlParts[2]) : 1
	//3. match book
	let book = _matchBook(bookPart)
	if (!book) {
		const alphanumbericOnlyBookPart = bookPart.replace(/[^a-zA-Z\d]/g, '')
		book = _matchBook(bookPart)
		if (!book) {
			book= "Genesis"
		}
	}
	return { book, chapter }
}
export default UrlToReference
