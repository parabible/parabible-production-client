import books from 'data/books'

const _matchBook = (urlBook) => {
	const bookNames = Object.keys(books)
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
	const urlParts = url.split("/")
	const bookPart = urlParts[1]
	const chapterPart = urlParts[2]
	//3. match book
	const book = _matchBook(bookPart)
	return !book ? false : {
		book: book,
		chapter: chapterPart ? parseInt(chapterPart) : 1
	}
}
export default UrlToReference