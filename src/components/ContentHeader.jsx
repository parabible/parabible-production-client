import React from 'react'
import DataFlow from 'util/DataFlow'
import { isNewTestament } from 'util/ReferenceHelper'

const headerTitles = {
    "wlc": {name: "BHS", nt: false, ot: true},
    "net": {name: "NET", nt: true, ot: true},
    "lxx": {name: "LXX", nt: false, ot: true},
    "sbl": {name: "SBL GNT", nt: true, ot: false}
}

const defaultButtonStyle = {
    background: "#eaeaea",
    margin: "0 2px",
    cursor: "pointer",
    padding: "0 7px"
}
const styles = {
    headerCellStyle: {
        display: "table-cell",
        verticalAlign: "top",
        fontSize: "small",
        fontFamily:"sans-serif",
        textAlign: "center",
        padding: 0
    },
    headerRowStyle: {
        position: "sticky",
        top: "0px",
        display: "table",
        tableLayout: "fixed",
        width: "100%",
        direction: "ltr",
        padding: "3px",
        borderTop: "1px solid white",
        background: "#f4f4f4",
        userSelect: "none"
    },
    addButtonStyle: defaultButtonStyle,
    removeButtonStyle: defaultButtonStyle
} 

const toggleTextDisplay = ({text, on}) => {
    const ref = DataFlow.get("reference")
    const texts = DataFlow.get(isNewTestament(ref) ? "textsToDisplayMainNT" : "textsToDisplayMainOT")
    if (on && !texts.includes(text))  {
        texts.push(text)
    }
    else {
        var index = texts.indexOf(text)
        if (index > -1) {
          texts.splice(index, 1);
        }
    }
    DataFlow.set(isNewTestament(ref) ? "textsToDisplayMainNT" : "textsToDisplayMainOT", texts)
}

const AddButton = ({text}) => {
    const over = (e) => {
        e.target.style.backgroundColor="#0078d7"
        e.target.style.color="#fff"
    }
    const out = (e) => {
        e.target.style.backgroundColor="#eaeaea"
        e.target.style.color="#000"
    }
    return <span
            onMouseOver={over}
            onMouseOut={out}
            style={styles.addButtonStyle}
            onClick={() => toggleTextDisplay({text, on: true})}
            >+ {headerTitles[text].name}</span>
}
const RemoveButton = ({text}) => {
    const over = (e) => { e.target.style.backgroundColor="#ffa0a0" }
    const out = (e) => { e.target.style.backgroundColor="#eaeaea" }
    return <span
            onMouseOver={over}
            onMouseOut={out}
            style={styles.removeButtonStyle}
            onClick={() => toggleTextDisplay({text, on: false})}
            >–</span>
}

const ExtraButtons = ({openColumns, isNT}) => (
    <span>
    {Object.keys(headerTitles).filter(k => !openColumns.includes(k)).map(c => 
        (   (isNT && headerTitles[c].nt) ||
            (!isNT && headerTitles[c].ot) ) ?
                <AddButton key={c} text={c} />
                : null
    )}
    </span>
)

const showRemoveButton = (text) => {
    const isNT = isNewTestament(DataFlow.get("reference"))
    return DataFlow.get(isNT ? "textsToDisplayMainNT" : "textsToDisplayMainOT").includes(text)
}
const ContentHeader = ({openColumns, isNT}) => (
    <div style={styles.headerRowStyle}>
        {openColumns.map((c, i) => (
        <div key={c} style={styles.headerCellStyle}>
            {headerTitles[c].name}
            <div style={{display: "inline-block", float: "right"}}>
            {showRemoveButton(c) && openColumns.length > 1 ? <RemoveButton text={c} /> : null}
            {i === openColumns.length - 1 ? (
                <ExtraButtons openColumns={openColumns} isNT={isNT} />
            ) : null}
            </div>
        </div>
        ))}
    </div>
)
export default ContentHeader
