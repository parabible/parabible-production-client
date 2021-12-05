import DataFlow from '@util/DataFlow'

const headerTitles = {
    "wlc": { name: "BHS", nt: false, ot: true },
    "net": { name: "NET", nt: true, ot: true },
    "lxx": { name: "LXX", nt: false, ot: true },
    "sbl": { name: "SBL GNT", nt: true, ot: false }
}
const nt_texts = Object.keys(headerTitles).filter(k => headerTitles[k].nt)
const ot_texts = Object.keys(headerTitles).filter(k => headerTitles[k].ot)


const testAllowOT = (texts) => texts.filter(value => -1 !== ot_texts.indexOf(value)).length > 0
const testAllowNT = (texts) => texts.filter(value => -1 !== nt_texts.indexOf(value)).length > 0

DataFlow.registerAllowSetHook("textsToDisplayMainNT", testAllowNT)
DataFlow.registerAllowSetHook("textsToDisplayMainOT", testAllowOT)
