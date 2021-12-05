import DataFlow from '@util/DataFlow'

const DEFAULT_COLOR = "#FF8C00"

let instance = null
const _highlightMap = new Map()

class HighlightManager {
    constructor() {
        if (!instance) {
            instance = this
        }
        this.updateHighlightMap()
        return instance
    }

    shouldHighlight(wid) {
        return _highlightMap.has(wid) && DataFlow.get("highlightTermsSetting")
    }

    getHighlightColor(wid) {
        return _highlightMap.get(wid)
    }

    updateHighlightMap() {
        const search_terms_setting = DataFlow.get("searchTerms") || []
        const search_highlights = DataFlow.get("searchHighlights") || {}
        _highlightMap.clear()
        Object.keys(search_highlights).reverse().forEach(hKey => {
            const term = search_terms_setting.find(st => st.uid === hKey)
            if (term) {
                // The search term has probably been deleted
                const color = term.hasOwnProperty("color") ? term.color : DEFAULT_COLOR
                search_highlights[hKey].forEach(wid => {
                    _highlightMap.set(wid, color)
                })
            }
        })
    }
}

const hm = new HighlightManager()

DataFlow.watch("searchHighlights", hm.updateHighlightMap)
DataFlow.watch("searchTerms", hm.updateHighlightMap)

export default hm