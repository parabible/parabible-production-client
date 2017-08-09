import appDataDefaults from "./defaults.json"

import isEqual from 'is-equal'
import clone from 'clone'

let appData = "flowdata"
let ls = JSON.parse(localStorage.getItem(appData)) || {}

let updatedDefaults = {}
Object.keys(appDataDefaults).forEach(k => {
	updatedDefaults[k] = ls.hasOwnProperty(k) ? ls[k] : appDataDefaults[k]
})

const DataFlow = {
	_appData: updatedDefaults,
	_watchers: {},
	_valid(prop, validation) {
		if (!this._appData.hasOwnProperty(prop))
			console.error("Could not '" + validation + "' property: " + prop + " (not registered in appData)")
		return this._appData.hasOwnProperty(prop)
	},
	set(prop, value) {
		if (!this._valid(prop, "set")) return this

		if (!isEqual(this._appData[prop], value)) {
			this._appData[prop] = clone(value)
			//TODO: only do local storage stuff if we are the controlling window/tab
			localStorage.setItem(appData, JSON.stringify(this._appData))
		
			if (this._watchers.hasOwnProperty(prop))
				this._watchers[prop].forEach((callback) => callback(value))
		}
		return this
	},
	watch(prop, callback) {
		if (!this._valid(prop, "watch")) return this

		if (!this._watchers.hasOwnProperty(prop))
			this._watchers[prop] = []
		this._watchers[prop].push(callback)
		return this
	},
	get(prop) {
		if (!this._valid(prop, "get")) return this
		return clone(this._appData[prop])
	}
}
export default DataFlow

// bindState(prop, setStateFunction) {
// 	if (!this._valid(prop, "bindState")) return this
// 	this.watch(prop, (value) => setStateFunction({prop: value}))
// 	return this
// },
//,
// getObject(propArray) {
// 	var retVal = {}
// 	propArray.forEach((prop) => retVal[prop] = this._appData[prop])
// 	return retVal
// }