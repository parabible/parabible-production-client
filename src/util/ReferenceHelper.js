import bookDetails from "data/bookDetails"

const _groupConsecutiveRids = (rids) => {
	const ridSort = rids.sort()
	return ridSort.reduce((a, v) => {
		if (a.length === 0) {
			a.push([v])
			return a
		}
		const lastel = a[a.length - 1]
		if (lastel[lastel.length - 1] + 1 == v) {
			a[a.length - 1].push(v)
		}
		else {
			a.push([])
			a[a.length - 1].push(v)
		}
		return a
	}, [])
}

const _getBook = (rid, abbreviation) => {
	const book = bookDetails[Math.floor(rid / 10000000) - 1]
	return abbreviation ? book.abbreviation : book.name
}
const _getChapter = (rid) => {
	return Math.floor(rid / 1000) % 10000
}
const _getVerse = (rid) => {
	return rid % 1000
}

const generateReference = (rids, abbreviation=false) => {
	const groupedRids = _groupConsecutiveRids(rids)
	const ridRefs = groupedRids.map(ridList => {
		const lastRid = ridList[ridList.length - 1]
		return {
			book: _getBook(ridList[0], abbreviation),
			firstChapter: _getChapter(ridList[0]),
			lastChapter: _getChapter(lastRid),
			firstVerse: _getVerse(ridList[0]),
			lastVerse: _getVerse(lastRid)
		}
	})
	let lastBook = null
	let lastChapter = null
	let humanReadable = ""
	ridRefs.forEach(r => {
		if (lastBook == r.book) {
			if (lastChapter == r.firstChapter) {
				if (r.firstChapter == r.lastChapter) {
					if (r.firstVerse == r.lastVerse)
						humanReadable += `, ${r.firstVerse}`
					else
						humanReadable += `, ${r.firstVerse}-${r.lastVerse}`
				}
				else
					humanReadable += `, ${r.firstChapter}:${r.firstVerse}-${r.lastChapter}:${r.lastVerse}`
			}
			else {
				if (r.firstChapter == r.lastChapter) {
					if (r.firstVerse == r.lastVerse)
						humanReadable += `, ${r.firstChapter}:${r.firstVerse}`
					else
						humanReadable += `, ${r.firstChapter}:${r.firstVerse}-${r.lastVerse}`
				}
				else
					humanReadable += `, ${r.firstChapter}:${r.firstVerse}-${r.lastChapter}:${r.lastVerse}`
			}
		}
		else {
			if (lastBook) humanReadable += "; "
			if (r.firstChapter == r.lastChapter) {
				if (r.firstVerse == r.lastVerse)
					humanReadable += `${r.book} ${r.firstChapter}:${r.firstVerse}`
				else
					humanReadable += `${r.book} ${r.firstChapter}:${r.firstVerse}-${r.lastVerse}`
			}
			else
				humanReadable += `${r.book} ${r.firstChapter}:${r.firstVerse}-${r.lastChapter}:${r.lastVerse}`
		}
		lastBook = r.book
		lastChapter = r.lastChapter
	})
	return humanReadable
}
const generateURL = (rid) => {
	const bk = _getBook(rid, true).replace(" ", "-")
	const ch = _getChapter(rid)
	const vs = rid % 1000
	return `/${bk}/${ch}#${vs}`
}

const _getBookInt = (book) => {
	return bookDetails.findIndex(d => d.name === book) + 1
}

const generateRid = (reference) => {
	const book = _getBookInt(reference.book) * 10000000
	const ch = reference.chapter * 1000
	const v = reference.hasOwnProperty("verse") ? reference.verse : 0
	return book + ch + v
}

const isNewTestament = (reference) => {
	const {book} = reference
	return bookDetails.findIndex(d => d.name === book) > 38
}
export { generateReference, generateURL, generateRid, isNewTestament }