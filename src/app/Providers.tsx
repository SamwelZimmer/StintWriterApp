"use client"

import { useEffect } from "react"
import { ThemeProvider } from "next-themes"
// import { hotjar } from "react-hotjar"

const Providers = ({ children }: { children: React.ReactNode }) => {

	// // set up HotJar for tracking the users
	// useEffect(() => {
	// 	hotjar.initialize(3520765, 6);
	// }, []);

	return (
		<ThemeProvider enableSystem={true} attribute="class">
			{children}
		</ThemeProvider>
	)
}

export default Providers