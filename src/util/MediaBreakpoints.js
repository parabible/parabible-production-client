import DataFlow from "./DataFlow"

const breakpoints = ["430px", "500px", "700px", "1100px"]
const mqls = breakpoints.map(b => window.matchMedia(`(min-device-width: ${b})`))

const mediaQueryChanged = () => {
	const n = mqls.reduce((a, v, i) => v.matches ? i + 1 : a, 0)
	DataFlow.set("screenSizeIndex", n)
}
mqls.forEach(mql => {
	mql.addListener(mediaQueryChanged)
})
mediaQueryChanged()

export default null