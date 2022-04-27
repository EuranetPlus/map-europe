## About this project

This is the code repository for an interactive EuranetPlus choropleth map of European countries based on data from a CSV file. The map can be updated with any data set that follows [this csv structure](https://docs.google.com/spreadsheets/d/1fzicMw_LiFGrdtzloXZFbM2FFgVc-GYtavvxPJFZ5Yo/edit?usp=sharing).

To use the map for a new topic and populate it with new texts and data please follow these steps:
1. Fork this repository: [Copy repository](#copy-repository)
2. How to update map titles, texts and translate: [Updating texts](#updating-text)
3. How to update the map with new data: [Updating data](#updating-data)
4. How to publish the new map: [Publish map](#publish-map)

<img width="602" alt="Bildschirmfoto 2022-04-27 um 15 20 30" src="https://user-images.githubusercontent.com/8008434/165527407-9b04b553-b074-4cbf-bc42-5e947a2fd8c3.png">


## Live map

The map is hosted on EuranetPlus' Vercel account and can be viewed here:  
https://euranet-map-europe.vercel.app/

## Embedding the map

To embed the map on any website as a responsive widget, please use the following iframe code:

```bash
<iframe title="Euranet Map" aria-label="Map" id="euranet-map-europe" src="https://euranet-map-europe.vercel.app/" scrolling="no"frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="624"></iframe><script type="text/javascript">window.addEventListener("message", e => { if ("https://euranet-map-europe.vercel.app" !== e.origin) return; let t = e.data; if (t.height) { document.getElementById("euranet-map-europe").height = t.height + "px" } }, !1)</script>
```

## Copy repository

To make a new map we first need to copy this reposirtory and use a fresh map template. To do this, please use the "Fork" Button on the top right in this window. This will create a so-called fork (a copy) of the exact same code that can be used for a new map. Each new map should have a new repository which should be renamed according to the new topic, using this nomenclature: _map-TOPIC_, e.g. _map-gdp_ or _map-military-spending_. If more than two words are used, separtate them with a hyphen. 

## Updating text

To change the map heading, subheading, source and text note, please change the text contents of this [configuration file](https://github.com/EuranetPlus/map-europe/blob/main/src/lib/stores/config-text.json). It contains the entries for all textual elements in English.

Example:  
To change the text of the heading of the map, change the "heading" entry (text in quotation marks, i.e. "" behind the :). To do this, simply click on the pen symbol on the top right side of the file preview window where it says "Edit this file". **_Warning: Please make sure to always enclose the text elemets with quotation marks and do not forget to add a comma after the entry. Otherwise the file will not be able to be read and the app may brake._**

This is **correct**:  
``"heading": "Military spending up across all EU states",``

This is **not correct** (comma is missing and no quotation marks, i.e. "" enclosing the text):  
``"heading": Military spending up across all EU states``

After this, save the changes by entering a title for the commit, e.g. "Create config-text.json" and press the green __Commit changes__ button.

## Updating data

1. To update the map data, please use this [csv template](https://docs.google.com/spreadsheets/d/1fzicMw_LiFGrdtzloXZFbM2FFgVc-GYtavvxPJFZ5Yo/edit?usp=sharing). Please copy the template to your own computer (or Google Drive) and fill in your desired values for each country. Please make sure that values are formatted with dots (.) as comma separators and **not commas**, i.e. 0.45 instead of 0,45. **Warning: Please make sure not to delete any country names or ids. Also make sure the CSV file is formatted with commas (,) as delimiters, not semicolons (;) or other symbols. Otherwise the map will not work**

2. Once you have updated the values, download the google sheet / excel file as a CSV file under >File > Download > Comma-separated-values (.csv) and copy all the contents of the csv file.

3. Open this [data file](https://github.com/EuranetPlus/map-europe/blob/main/static/data/thematic/data.csv) and click on the pen symbol on the top right side of the file preview window where it says "Edit this file". Then paste the contents of the CSV file here.

After this, save the changes by entering a title for the commit, e.g. "Update data.csv" and press the green **Commit changes** button.  
Your data should now be updated and after a while show on the map.

## Publish map

etete..

## Changing translations manually

All text elements on the map (e.g. country names, heading, subheading, source text, notes, etc.) are automatically translated into the 24 official EU languages using the Google Translate API by running an automated node script. The translations returned by Google are a good first approach, but manual edits of the text in different languages may be necessary. To do this, please go to the [language folder](https://github.com/EuranetPlus/map-ukraine/tree/main/static/languages) and edit the contents of the respective language file.

Example:  
To change the text of the subheading of the map in Hungarian, open the [hu.json](https://github.com/EuranetPlus/map-ukraine/blob/main/static/languages/hu.json) file and change the "subheading" entry (text in quotation marks, i.e. "" behind the :). To do this, simply click on the pen symbol on the top right side of the file preview window where it says "Edit this file". **_Warning: Please do not change the headings as these are automatically generated every day, based on the latest data. Also make sure to always enclose the text elemets with quotation marks and do not forget to add a comma after the entry. Otherwise the file will not be able to be read and the app may brake._**

This is **correct**:  
`"heading": "Már több mint 5,2 millió menekült menekült el Ukrajnából",`

This is **not correct** (comma is missing and no quotation marks, i.e. "" enclosing the text):  
`"heading": Már több mint 5,2 millió menekült menekült el Ukrajnából`

After this, save the changes by entering a title for the commit, e.g. "Create hu.json" and press the green **Commit changes** button.

## Development

To locally develop this map on your computer, please do the following steps in your terminal/command line:

1. Clone the repo: `git clone https://github.com/EuranetPlus/map-ukraine.git`
2. Open cloned folder: `cd map-ukraine`
3. Install all dependencies: `npm install`
4. Start a local development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Production

Before creating a production version of your app, please install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Usually this would be the static adapter provided by SvelteKit or any adapter suiting your platform (i.e. Vercel, Netlify, etc.). Please see more info here: https://kit.svelte.dev/docs#adapters

To build the app for production, run

```bash
npm run build
```

This will create a static folder called **build** in the root folder of the repository, which contains all the files necessary for deployment on a web server.

> You can also preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
