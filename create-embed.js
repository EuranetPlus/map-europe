import chalk from 'chalk';
import dotenv from 'dotenv'
import * as fs from 'fs';
dotenv.config()

console.log(chalk.green('Creating iframe embed code...'));

import { config } from "./src/lib/stores/config-features.js";
const mapTitle = config.mapTitle;
const url = config.vercelURL;

const iframe = `<iframe title="Euranet Map" aria-label="Map" id="euranet-map-${mapTitle}" src="${url}/" scrolling="no" frameborder="0"style="width: 0; min-width: 100% !important; border: none;" height="624"></iframe><script type="text/javascript">window.addEventListener("message",e=>{if("${url}"!==e.origin)return;let t=e.data;if(t.height){document.getElementById("euranet-map-${mapTitle}").height=t.height+"px"}},!1)</sc` + `ript>`

let heading = "## To embed the map on any website as a responsive widget, please use the following iframe code:";

console.log(heading);
console.log(iframe);

let result = `${heading}\n\n ${iframe}`

let test = "```html <div>hello</div> ```"

writeFile();

function writeFile(jsonObj) {
  const data = JSON.stringify(jsonObj, null, 2);

  fs.writeFile('./IFRAME.md', test, (err) => {
    // If there is any error in writing to the file, return
    if (err) {
      console.error(err)
      return
    }

    // Log this message if the file was written to successfully
    console.log('wrote to file successfully')
  })
}