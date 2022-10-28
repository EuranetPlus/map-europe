import chalk from 'chalk';
import fetch from 'node-fetch';
import { createRequire } from "module";
import dotenv from 'dotenv'
import * as fs from 'fs';
import csv from 'csv-parser';
dotenv.config()


// Step 1: Load text contents of CSV file and filter for countries with extra info
let countriesWithExtraInfo = [];

fs.createReadStream('./static/data/thematic/data.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Filter only countries with extraInfo
    if (row.extraInfo == "TRUE") {
      countriesWithExtraInfo.push(row)
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed');


      // Open config text file and add country text ("extraInfo") from CSV to be translated
    fs.readFile(`./src/lib/stores/config-text.json`, function (err, data) {
      let obj = JSON.parse(data);
      
        // First clean json to remove all extraInfoText first before adding new entries
          let extraInfoEntries;
					const asArray = Object.entries(obj);
					extraInfoEntries = asArray.filter(([key, value]) => {
						return key.includes('extraInfo');
          });

        extraInfoEntries.forEach(item => {
          let entry = item[0];
          delete obj[entry];
        })
          // console.log(obj)
          // -- Clean END --

        // For each country with extraInfo transform id to lowercase and add text to json
        countriesWithExtraInfo.forEach(item => {
          let id = item.id 
          
          // Add a dynamic key for each country to config-text.json
          obj["extraInfoText_" + id] = item['text_content'];
          obj["extraInfoLink_" + id] = item['link_text']

        })

        // Write file to json again with new data from CSV
         fs.writeFile("./src/lib/stores/config-text.json", JSON.stringify(obj, null, 2), (err) => {
            console.log(chalk.green(`Success!`))
          })
    
      })   

  });


  // ---- //



// Step 2: Translate all contents of the config-text.json into 24 languages

// All language codes: https://cloud.google.com/translate/docs/languages
console.log(chalk.green('Starting translation process...'));

// Import data
const require = createRequire(import.meta.url);
// const sourceJSON = require("./static/languages/en.json");
const sourceJSON = require("./src/lib/stores/config-text.json");

const languages = require("./static/languages/languages.json");

// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

// Instantiates a client
const googleClient = new Translate({ key: process.env.API_KEY });

console.log(chalk.yellow(`Getting translations from Google API for the following ${languages.languages.length} languages:`));
languages.languages.forEach((lang,i) => {
  console.log(chalk.yellow(i + 1, lang.label))
})


// Translate all contents of en.json file
async function translateJSON(target, label) {  
  let desktopTranslated = {};

  for (const key in sourceJSON) {

    let translations;


    // For all keys except for languages and countries
    if (key == "countries") {

    // For keys languages and countries
    // Get translations
    let objectArray = sourceJSON[key];
      
    console.log(objectArray)
      
     translations = await Promise.all(
       objectArray.map(async (item) => {
         let [trans] = await googleClient.translate(item.na, target);
         return {
           id: item.id,
           na: capitalizeFirstLetter(trans)
          }
        })
     )
      console.log(translations)
      
      // Write translations to object
      let arr = [];
      desktopTranslated[key] = arr;
      translations.forEach((translation, i) => {
        arr.push(translation);
      });

    } else {

      // Get translations 
      [translations] = await googleClient.translate(sourceJSON[key], target);
      translations = Array.isArray(translations) ? translations : [translations];
      //  console.log(translations)

      // Write translations to object
      translations.forEach((translation, i) => {
        desktopTranslated[key] = translation.replace(/"/g, "'");
      });

    }
    // console.log(translations)
   }
  
  // console.log(target, desktopTranslated);
  writeJSONToFile(desktopTranslated, target, label);
}


// Translate for all available languages
languages.languages.forEach((item) => {
  translateJSON(item.value, item.label)
})


// Write translation result to JSON files
function writeJSONToFile(jsonObj, target, label) {
  // convert JSON object to string
  const data = JSON.stringify(jsonObj, null, 2);

  // write JSON string to a file
  fs.writeFile(`./static/languages/${target}.json`, data, (err) => {
    if (err) {
      console.log(chalk.red("Something went wrong!", err))
    }
    console.log(chalk.green(`Success! Translation file saved for: ${label} -> ${target}.json `))
  });
}




function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

