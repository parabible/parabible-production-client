import books from 'data/bookDetails'
import generousBookNames from 'data/generousBookNames'

const _matchBook = (urlBook) => {
	// first see if we can map directly
	const possibleKey = urlBook.replace(/[-_\ ]/g,"").toLowerCase()
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

const _regexSearchForReference = (urlString) => {
	// [^a-zA-Z\d\s:] - anything non alpha-numeric
	const matches = urlString.match(/((?:(?:\d)[^a-zA-Z\d\s:]*)?[a-zA-Z]+)[^a-zA-Z\d\s:]*(\d+)(\D*(\d+))?/)
	return matches ? {
		book: _matchBook(matches[1]) || "Genesis",
		chapter: matches.length > 1 ? +matches[2] : 1,
		verse: matches.length > 2 ? +matches[4] : 1
	} : false
}

const UrlToReference = (url) => {
	//1. strip leading stuff if it's there
	const decodedURL = decodeURI(url).substring(1)
	//2. separate book and chapter
	let { book, chapter, verse } = _regexSearchForReference(decodedURL)
	if (!book) {
		book = _matchBook(decodedURL) || "Genesis"
		chapter = 1
	}

	if (verse)
		return { book, chapter, verse }
	return { book, chapter }
}
export default UrlToReference