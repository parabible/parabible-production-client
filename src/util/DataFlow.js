import appDataDefaults from "./defaults.json"

import isEqual from 'is-equal'
import clone from 'clone'

let appData = "flowdata"
let ls = JSON.parse(localStorage.getItem(appData)) || {}

let updatedDefaults = {}
Object.keys(appDataDefaults).forEach(k => {
	updatedDefaults[k] = ls.hasOwnProperty(k) ? ls[k] : appDataDefaults[k]
})

let uniqueId = 0

const DataFlow = {
	_wasEqual: false,
	_appData: updatedDefaults,
	_watchers: {},
	_allowSetHooks: {},
	_valid(prop, validation) {
		if (!this._appData.hasOwnProperty(prop))
			console.error("Could not '" + validation + "' property: " + prop + " (not registered in appData)")
		return this._appData.hasOwnProperty(prop)
	},
	setWasEqual() {
		return this._wasEqual
	},
	set(prop, value) {
		if (!this._valid(prop, "set")) return this
		if (this._allowSetHooks.hasOwnProperty(prop) && !this._allowSetHooks[prop].reduce((a, f) => a && f(value), true)) {
			console.log("disallowed set")
			return this
		}

		this._wasEqual = true
		if (!isEqual(this._appData[prop], value)) {
			this._wasEqual = false
			this._appData[prop] = clone(value)
			//TODO: only do local storage stuff if we are the controlling window/tab
			localStorage.setItem(appData, JSON.stringify(this._appData))
		
			if (this._watchers.hasOwnProperty(prop))
				this._watchers[prop].forEach((c) => c.func(value))
		}
		return this
	},
	renotify(prop) {
		if (this._watchers.hasOwnProperty(prop))
			this._watchers[prop].forEach((c) => c.func(this._appData[prop]))
		return this
	},
	registerAllowSetHook(prop, callback) {
		if (!this._valid(prop, "set")) return this
		if (!this._allowSetHooks.hasOwnProperty(prop))
			this._allowSetHooks[prop] = []
		this._allowSetHooks[prop].push(callback)
		return this
	},
	watch(prop, callback, byRefWatcherIdObject) {
		/** byRefWatcherIdObject is an object in the calling function.
		 * JS passes objects by reference so when `watch` associates the callback
		 * it also assigns it an id and sets the prop on byRefWatcherIdObject to
		 * the id allowing us to `unwatch` later (e.g. when component lifecycle ends)
		 * */
		if (!this._valid(prop, "watch")) return this

		uniqueId++
		if (!this._watchers.hasOwnProperty(prop))
			this._watchers[prop] = []
		this._watchers[prop].push({
			cid: uniqueId,
			func: callback
		})
		if (byRefWatcherIdObject)
			byRefWatcherIdObject[prop] = uniqueId
		return this
	},
	unwatch(prop, watcherId) {
		if (!this._valid(prop, "unwatch")) return this

		const watcherIndexToRemove = this._watchers[prop].findIndex((c) => c.cid == watcherId)
		this._watchers[prop].splice(watcherIndexToRemove, 1)
		return this
	},
	bindState(props, setStateFunction) {
		// One way bind - will update state when dataFlow updates
		return props.reduce((a, p) => {
			this.watch(p, newValue => {
				setStateFunction({ [p]: newValue })
			})
			a[p] = this.get(p)
			return a
		}, {})
	},
	get(prop) {
		if (!this._valid(prop, "get")) return this
		return clone(this._appData[prop])
	}
}
export default DataFlow