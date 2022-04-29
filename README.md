## About this project

This is the code repository for an interactive EuranetPlus choropleth map of European countries based on data from a CSV file. The map can be updated with any data set that follows [this csv structure](https://docs.google.com/spreadsheets/d/1fzicMw_LiFGrdtzloXZFbM2FFgVc-GYtavvxPJFZ5Yo/edit?usp=sharing).

To use the map for a new topic and populate it with new texts and data please follow these steps:
1. Make a copy of this map template: [Copy repository](#copy-repository)
2. Update map titles and texts: [Updating texts](#updating-text)
3. Translate texts into 24 EU languages [Translate texts](#translate-text)
4. Update map with new data: [Updating data](#updating-data)
5. Publish the new map: [Publish map](#publish-map)

<img width="602" alt="Bildschirmfoto 2022-04-27 um 15 20 30" src="https://user-images.githubusercontent.com/8008434/165527407-9b04b553-b074-4cbf-bc42-5e947a2fd8c3.png">


## Live map

The map is hosted on EuranetPlus' Vercel account and can be viewed here:  
https://euranet-map-europe.vercel.app/

## Embedding the map

To embed the map on any website as a responsive widget, you need to create an iframe code for this map. This requires three steps:
1. Change the "mapTitle" for the map in the [feature configuration file](src/lib/stores/config-features.js)
2. Change the "vercelURL" in the in the [feature configuration file](src/lib/stores/config-features.js)
3. Run the "Create iFrame code" workflow in the Actions tab above

The correct iframe code can then be copied from the [IFRAME.md](IFRAME.md), which is generated when running the script.



## Copy repository

1. **Copy repository**:  
To make a new map we first need to copy this repository and use a fresh map template. To do this, please use the green "Use this template" button on the top right in this window. This will create a copy of the exact same code that can be used for a new map. You will be prompted to name the new repository according to the new topic of the map. Please use this nomenclature: _map-TOPIC_, e.g. _map-gdp_ or _map-generationz_. If more than two words are used, separtate them with a dash like so _map-military-spending_. 

2. **Add Google Credentials**:  
In order to be able to use the automatic translation service by the Google API, we need to provide the new repository with access to the servica account API key. For this go to the **Settings** tab at the top of this repository and select the "Secrets" dropdown on the lower left side. Here select "Actions". On the top right side press the "New repository secret" button. Name the new secret **"GOOGLE_CREDENTIALS"** and as a value paste in the contents of the service account json file that can be downloaded from the Google Cloud Console. This file looks something like this (This example below here is fake and only for illustration):

```bash
{
  "type": "service_account",
  "project_id": "iron-moon-dgddg",
  "private_key_id": "843dgj436fcf7bfab4sgg367235529",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIhdghgdBg\n-----END PRIVATE KEY-----\n",
  "client_email": "maps@iron-moon-dgdgdgdgg.iam.gserviceaccount.com",
  "client_id": "sgdgfdgdggdgggdgg",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/maps%40iron-moon-dgdgdgdgg.iam.gserviceaccount.com"
}
```

3. **Allow scripts**:  
By default every new repository is locked for running automated scripts. We need to enable this. Go to the **Settings** tab at the top of this repository and select "Actions" and then "General" from the dropdown on the lower left side. Then set the "Workflow permissions" to "Read and write permissions". Now we can change the texts and run the translations.



## Updating text

To change the map heading, subheading, source and text note, please change the text contents of this [text configuration file](src/lib/stores/config-text.js). It contains the entries for all textual elements in English.

Example:  
To change the text of the heading of the map, change the "heading" entry (text in quotation marks, i.e. "" behind the :). To do this, simply click on the pen symbol on the top right side of the file preview window where it says "Edit this file". **_Warning: Please make sure to always enclose the text elemets with quotation marks and do not forget to add a comma after the entry. Otherwise the file will not be able to be read and the app may brake._**

This is **correct**:  
``"heading": "Military spending up across all EU states",``

This is **not correct** (comma is missing and no quotation marks, i.e. "" enclosing the text):  
``"heading": Military spending up across all EU states``

After this, save the changes by entering a title for the commit, e.g. "Create config-text.json" and press the green __Commit changes__ button.

## Translate text

To translate the texts in the [text configuration file](src/lib/stores/config-text.jsn), you simply need to go to the Actions tab above. Here under "workflows" select the "Translate text" workflow and press the "Run workflow" button on the right side and again the green "Run workflow" button from the dropdown menu. This will run the translate script and request the translated 24 language files from the Google API. This process may take several minutes. Once this process has finished sucessfully, you should see a green check mark ✅. 


## Updating data

1. To update the map data, please use this [csv template](https://docs.google.com/spreadsheets/d/1fzicMw_LiFGrdtzloXZFbM2FFgVc-GYtavvxPJFZ5Yo/edit?usp=sharing). Please copy the template to your own computer (or Google Drive) and fill in your desired values for each country. Please make sure that values are formatted with dots (.) as comma separators and **not commas**, i.e. 0.45 instead of 0,45. **Warning: Please make sure not to delete any country names or ids. Also make sure the CSV file is formatted with commas (,) as delimiters, not semicolons (;) or other symbols. Otherwise the map will not work**

2. Once you have updated the values, download the google sheet / excel file as a CSV file under >File > Download > Comma-separated-values (.csv) and copy all the contents of the csv file.

3. Open this [data file](static/data/thematic/data.csv) and click on the pen symbol on the top right side of the file preview window where it says "Edit this file". Then paste the contents of the CSV file here.

After this, save the changes by entering a title for the commit, e.g. "Update data.csv" and press the green **Commit changes** button.  
Your data should now be updated and after a while show on the map.

## Publish map

ToDo..

## Changing translations manually

All text elements on the map (e.g. country names, heading, subheading, source text, notes, etc.) are automatically translated into the 24 official EU languages using the Google Translate API by running an automated node script. The translations returned by Google are a good first approach, but manual edits of the text in different languages may be necessary. To do this, please go to the [language folder](static/languages) and edit the contents of the respective language file.

Example:  
To change the text of the subheading of the map in Hungarian, open the [hu.json](static/languages/hu.json) file and change the "subheading" entry (text in quotation marks, i.e. "" behind the :). To do this, simply click on the pen symbol on the top right side of the file preview window where it says "Edit this file". **_Warning: Please do not change the headings as these are automatically generated every day, based on the latest data. Also make sure to always enclose the text elemets with quotation marks and do not forget to add a comma after the entry. Otherwise the file will not be able to be read and the app may brake._**

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
