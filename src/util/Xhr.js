import axios from 'axios'
const CancelToken = axios.CancelToken;

const apiRoot = "https://parabible.com/api"
const apiUrl = {
	"termSearch": "/term-search",
	"collocation": "/collocation",
	"wordSearch": "/word-search",
	"chapterText": "/chapter-text",
	"wordLookup": "/word-lookup"
}
const apiEndpoints = Object.keys(apiUrl)
let cancelTokens = {}

const Xhr = (api, payload) => {
	return new Promise((resolve, reject) => {
		if (!apiUrl.hasOwnProperty(api)) {
			console.log("api request not found in apiurl object", api)
			reject(null)
		}
		cancelTokens.hasOwnProperty(api) ? cancelTokens[api]() : null
		axios({
			url: apiRoot + apiUrl[api],
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			},
			data: payload,
			cancelToken: new CancelToken(function executor(c) {
				cancelTokens[api] = c
			})
		}).then((response) => {

			resolve(response.data)

		}).catch((error) => {
			if (axios.isCancel(error)) {
				console.info(api, "axios request cancelled")
			}
			else {
				console.log(error);
				reject("some kind of error happened in the fetch")
			}
		})
	})
}
export { Xhr, apiEndpoints }