import React from 'react'
import licenses from '@data/licenses'

const licenseContent = ({ name, short_description, data_url }) => (
    <div>
        <b>{name}</b>: <span>{short_description}</span>&nbsp;
        {data_url ? <a href={data_url} className="hrefLink">↪</a> : null}
    </div>
)
const licenseProper = ({ name, license_url = null }) => (
    <div>{license_url ?
        <a href={license_url} className="hrefLink">{name}</a> :
        <span>{name}</span>}
    </div>
)
const licenseContainer = (ll) => {
    return (
        <div>
            {licenseContent(licenses[ll])}
            {licenseProper(licenses[ll].license)}
        </div>
    )
}
const licenseCellStyle = {
    display: "table-cell",
    verticalAlign: "top",
    padding: "3px 5px",
}
const licenseRowStyle = {
    display: "table",
    tableLayout: "fixed",
    width: "100%",
    direction: "ltr"
}

const SingleLicense = ({ license }) => (
    <div className="license">
        {licenseContainer(license)}
    </div>
)
const ParallelLicenses = ({ licenseArray }) => (
    <div className="licenseRow" style={licenseRowStyle}>
        {licenseArray.map(ll => (
            <div key={ll} style={licenseCellStyle}>
                {licenseContainer(ll)}
            </div>
        ))}
    </div>
)

const LicenseView = ({ license }) => {
    if (!Array.isArray(license))
        throw "You have to give an array of licenses to LicenseView"
    if (license.length === 1)
        return <SingleLicense license={license[0]} />
    else
        return <ParallelLicenses licenseArray={license} />
}
export default LicenseView