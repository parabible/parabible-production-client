import books from 'data/bookDetails'
import generousBookNames from 'data/generousBookNames'

const _matchBook = (urlBook) => {
	// first see if we can map directly
	const possibleKey = urlBook.toLowerCase()
	const generousNameList = Object.keys(generousBookNames)
	if (generousNameList.indexOf(possibleKey) > -1) {
		return generousBookNames[possibleKey]
	}

	// now try use regex to guess (return on first match)
	const bookNames = books.map(b => b.name)
	{	// let's try a regex on the starting characters of book names
		const r = new RegExp(`^${urlBook}.*`, "i")
		const possibleMatch = bookNames.reduce((a, v) => {
			if (a) return a
			return r.test(v) ? v : a
		}, false)
		if (possibleMatch) return possibleMatch
	}

	// this is a pretty promiscuous guess but it works on stuff like "1kgs"
	const urlArray = urlBook.split("")
	const r = new RegExp("^" + urlArray.join(".*"), "i")
	return bookNames.reduce((a, v) => {
		if (a) return a
		return r.test(v) ? v : a
	}, false)
}

const UrlToReference = (url) => {
	//1. strip leading stuff if it's there
	const decodedURL = decodeURI(url).substring(1)
	//2. separate book and chapter
	let book, chapter, verse
	const urlMatches = decodedURL.match(/([a-zA-Z]+)\D*(\d+)(\D*(\d+))?/)
	if (urlMatches != null) {
		book = _matchBook(urlMatches[1]) || "Genesis"
		chapter = urlMatches.length > 1 ? +urlMatches[2] : 1
		//there is a nested match to allow the optional trailing separator+verse number
		verse = urlMatches.length > 2 ? +urlMatches[4] : 1 
	}
	else {
		book = _matchBook(decodedURL) || "Genesis"
		chapter = 1
	}

	if (verse)
		return { book, chapter, verse }
	return { book, chapter }
}
export default UrlToReference