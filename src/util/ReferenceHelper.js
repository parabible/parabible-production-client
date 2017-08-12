import bookDetails from "data/bookDetails"

const groupConsecutiveRids = (rids) => {
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

const getBook = (rid, abbreviation) => {
	const book = bookDetails[Math.floor(rid / 10000000) - 1]
	return abbreviation ? book.abbreviation : book.name
}
const getChapter = (rid) => {
	return Math.floor(rid / 1000) % 10000
}
const getVerse = (rid) => {
	return rid % 1000
}

const generateReference = (rids, abbreviation=false) => {
	const groupedRids = groupConsecutiveRids(rids)
	const ridRefs = groupedRids.map(ridList => {
		const lastRid = ridList[ridList.length - 1]
		return {
			book: getBook(ridList[0], abbreviation),
			firstChapter: getChapter(ridList[0]),
			lastChapter: getChapter(lastRid),
			firstVerse: getVerse(ridList[0]),
			lastVerse: getVerse(lastRid)
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
export { generateReference }