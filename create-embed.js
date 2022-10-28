import chalk from 'chalk';
import dotenv from 'dotenv'
import * as fs from 'fs';
dotenv.config()

console.log(chalk.green('Creating iframe embed code...'));

import { config } from "./src/lib/stores/config-features.js";
let mapTitle = config.mapTitle;
let url = config.vercelURL;

// Add https for url if non-existent
url.includes("https://") ? url = url : url = `https://${url}`;

// Remove trailing slash in url
url.includes("vercel.app/") ? url = url.replace("vercel.app/", "vercel.app" ) : url = url;

// Replace all spaces with dashes
mapTitle.includes(" ") ? mapTitle = mapTitle.replace(/ /g, "-").toLowerCase() : mapTitle = mapTitle;
  
let iframe = `<iframe title="Euranet Map" aria-label="Map" id="euranet-map-${mapTitle}" src="${url}" scrolling="no" frameborder="0"style="width: 0; min-width: 100% !important; border: none;" height="624"></iframe><script type="text/javascript">window.addEventListener("message",e=>{if("${url}"!==e.origin)return;let t=e.data;if(t.height){document.getElementById("euranet-map-${mapTitle}").height=t.height+"px"}},!1)</sc` + `ript>`


let heading = "## Embedding the map";
let subheading = "To embed the map on any website as a responsive widget, please use the following **iframe code**:"

let result = `${heading}\n\n${subheading}\n\n${iframe}`

writeFile();

function writeFile(jsonObj) {

  fs.writeFile('./IFRAME.md', result, (err) => {
    // If there is any error in writing to the file, return
    if (err) {
      console.error(err)
      return
    }

    // Log this message if the file was written to successfully
    console.log('wrote to file successfully')
  })
}

