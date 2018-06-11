import React from 'react'

const Footer = () => {
	return <div style={{
		fontFamily: "Open Sans, sans",
		fontSize: "10px",
		display: "flex",
		backgroundColor: "#d0d0d0"
	}}>
		<div style={{
			flex: 1,
			textAlign: "right",
			padding: "15px"
		}}>
			<a href="https://parabible.com">https://parabible.com</a> was built by <a href="https://jcuenod.github.io/">James Cuénod</a>.<br />
			All the code is available at <a href="https://github.com/parabible">https://github.com/parabible/</a>
		</div>
		<div style={{
			flex: 1,
			padding: "15px",
			display: "flex",
			alignItems: "center"
		}}>
			<a className="dbox-donation-button"
				href="https://donorbox.org/support-parabible"
				style={{
					display: "flex", 
					alignItems: "center", 
					backgroundColor: "#2d81c5", 
					borderRadius: "2px", 
					padding: "5px 10px", fontSize: "12px", color: "#fff", textDecoration: "none"
				}
			}>
				<div style={{ paddingRight: "5px", fontWeight: "bold", textAlign: "center" }}>
					SUPPORT PARABIBLE
				</div>
				<div>
					<img src="https://d1iczxrky3cnb2.cloudfront.net/red_logo.png" />
				</div>
			</a>
		</div>
	</div>

}
export default Footer