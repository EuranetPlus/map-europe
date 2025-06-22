export const config = {
	mapTitle: 'employment-tertiary-attainment', // The title of the map, if more than one word, separate by dash, e.g. "income-europe"
	vercelURL: 'map-employment-tertiary-attainment.vercel.app', // The url provided when deploying the map on Vercel
	datasetType: 'values', // "values" or "binary"; Does the data set contain numerical values or binary (0/1) values for countries?
	datasetUnit: 'percent', // "fullNumbers" or "percent"; Is the data in percent (0.25 of GDP) or full numbers (25 people)?
	percentRounded: false, // true or false; Should the percent values be rounded to full numbers (i.e. 26%) or 1-decimal place (i.e. 25.9%)
	colourSchemeType: 'diverging', // one of the following: "sequential", "diverging",
	colourScheme: 'red-blue', // 1) one of the following "sequential" color schemes: "blue", "green", "gray", "orange", "purple", "red", "blue-green", "blue-purple", "green-blue", "orange-red", "purple-blue-green", "purple-blue", "purple-blue-darker", "purple-red", "red-purple", "yellow-green-blue", "yellow-green", "yellow-orange-brown", "yellow-orange-red" --- OR: 2) one of the following "diverging" color schemes: "brown-blue-green", "purple-green", "pink-yellow-green", "purple-orange", "red-blue", "red-gray", "red-yellow-blue", "red-yellow-green", "spectral"
	colourSchemeClasses: 5, // for sequential scales: from 3 to 9; for diverging scales: from 5 to 11
	colourSchemeReverse: false, // true or false; Should the order of the color scheme be reversed?
	colorBarFirstValue: undefined, // If set (example: 0), overwrites the minimum value of the color bar, else set to colorBarFirstValue: undefined
	colorBarLastValue: undefined, // If set (example: 100), overwrites the maximum value of the color bar, else set to colorBarLastValue: undefined
	headlineAvailable: true, // true or false; Should the map have a headline?
	subheadlineAvailable: true, // true or false; Should the map have a subheadline?
	tooltipAvailable: true, // true or false; Should the map show a tooltip when hovering over a country?
	scaleBarAvailable: true, // true or false; Should the map show a scale bar on the top?
	legendAvailable: true, // true or false; Should the map show a legend in the bottom right corner?
	textSourceAvailable: true, // true or false; Should the map show a source text below the map?
	textNoteAvailable: true, // true or false; Should the map show a text note below the map?
	textDataAccessAvailable: true, // true or false; Should the map show a link to the original data source below the map?
	legend1Color: '#F4F4F4', // Specifies the color of the first round dot in the legend entry
	legend2Color: 'red', // Specifies the color of the second round dot in the legend entry
	legend3Color: 'blue', // Specifies the color of the third round dot in the legend entry
	legend4Color: 'green' // Specifies the color of the fourt round dot in the legend entry
};
