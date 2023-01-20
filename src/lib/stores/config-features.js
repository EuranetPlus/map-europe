export const config = {
	mapTitle: 'europe', // The title of the map, if more than one word, separate by dash, e.g. "income-europe"
	vercelURL: 'euranet-map-europe.vercel.app', // The url provided when deploying the map on Vercel
	datasetType: 'binary', // "values" or "binary"; Does the data set contain numerical values or binary (0/1) values for countries?
	datasetUnit: 'percent', // "fullNumbers" or "percent"; Is the data in percent (0.25 of GDP) or full numbers (25 people)?
	percentRounded: false, // true or false; Should the percent values be rounded to full numbers (i.e. 26%) or 1-decimal place (i.e. 25.9%)
	colourScheme: 'purple-blue', // one of the following: "blue", "purple-blue", "green-blue", "orange-red", "yellow-green"
	headlineAvailable: true, // true or false; Should the map have a headline?
	subheadlineAvailable: true, // true or false; Should the map have a subheadline?
	tooltipAvailable: true, // true or false; Should the map show a tooltip when hovering over a country?
	scaleBarAvailable: true, // true or false; Should the map show a scale bar on the top?
	legendAvailable: true, // true or false; Should the map show a legend in the bottom right corner?
	textSourceAvailable: true, // true or false; Should the map show a source text below the map?
	textNoteAvailable: true, // true or false; Should the map show a text note below the map?
	textDataAccessAvailable: true, // true or false; Should the map show a link to the original data source below the map?
	legend1Color: '#cad1d9', // Specifies the color of the first round dot in the legend entry
	legend2Color: 'red', // Specifies the color of the second round dot in the legend entry
	legend3Color: 'blue', // Specifies the color of the third round dot in the legend entry
	legend4Color: 'green' // Specifies the color of the fourt round dot in the legend entry
};
