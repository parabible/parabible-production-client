import React from 'react'

const Footer = () => {
	return <div style={{
		fontFamily: "Open Sans, sans",
		fontSize: "10px",
		display: "flex",
		backgroundColor: "#f4f4f4"
	}}>
		<div style={{
			flex: 1,
			textAlign: "right",
			padding: "15px"
		}}>
			<a href="https://parabible.com" className="hrefLink">https://parabible.com</a> was built by <a href="https://jcuenod.github.io/" className="hrefLink">James Cuénod</a>.<br />
			All the code is available at <a href="https://github.com/parabible" className="hrefLink">https://github.com/parabible/</a>
		</div>
		<div style={{
			flex: 1,
			padding: "15px",
			display: "flex",
			alignItems: "center"
		}}>
			<a className="dbox-donation-button" href="https://donorbox.org/support-parabible">
				<div style={{ paddingRight: "5px", fontWeight: "bold", textAlign: "center" }}>
					SUPPORT PARABIBLE
				</div>
				<div>
					<img src="//images/donorbox_logo.png" />
				</div>
			</a>
		</div>
	</div>

}
export default Footer
