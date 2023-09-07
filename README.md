## About this project

This is the code repository for an interactive EuranetPlus choropleth map of European countries. The map can be updated with any data set from a CSV file. For more info see section [3. Update map with new data](#add-data).

To use the map for a new topic and populate it with new data and text please follow these steps:

1. Make a copy of this map template: [Copy map template](#copy-map-template)
2. Configure the map: [Configure map](#configure-the-map)
3. Update map with new data: [Add or update data](#add-data)
4. Update map titles and texts: [Updating texts](#updating-text)
5. Translate texts into 24 EU languages [Translate texts](#translate-text)
6. Publish the new map: [Publish map](#publish-map)

![Screenshot](https://user-images.githubusercontent.com/8008434/171234651-268c6ed6-c62b-4f1f-b01f-a5009d922f19.png)

_Left: Map with **"values"** data_  
_Right: Map with **"binary"** data_

## Copy map template

1. **Copy repository**:  
   To make a new map, we first need to copy this repository and use a fresh map template. To do this, please use the green "Use this template" button on the top right in this window. This will create a copy of the exact same code that can be used for a new map. You will be prompted to name the new repository according to the new topic of the map. Please use this nomenclature: _map-TOPIC_, e.g. _map-gdp_ or _map-generationz_. If more than two words are used, separtate them with a dash like so _map-military-spending_.

2. **Add Google Credentials**:  
   In order to be able to use the automatic translation service by the Google API, we need to provide the new repository with access to the service account API key. For this go to the **Settings** tab at the top of this repository and select the "Secrets" dropdown on the lower left side. Here select "Actions". On the top right side press the "New repository secret" button. Name the new secret **"GOOGLE_CREDENTIALS"** and as a value paste in the contents of the service account json file that can be downloaded from the Google Cloud Console. This file looks something like this (Note: This example file below here is fake and only for illustration purposes):

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
   By default every new repository is locked for running automated scripts. We need to enable this functionality first. Go to the **Settings** tab at the top of this repository and select "Actions" and then "General" from the dropdown on the lower left side. Then set the "Workflow permissions" to "Read and write permissions". Now we can change the texts and run the translations.

4. **Connect to Vercel**:
   Once the new repository is set up, you need to connect it to Vercel to deploy the map to the internet. Please go to https://vercel.com/dashboard, sign in with your GitHub account and do the following steps:

- Press the "New Project" Button on the Vercel dashboard
- Under "Import Git Repository" choose the name of the copied repository
- Press the blue "Deploy" button (no need to change any settings here)
- Press the "Go to Dashboard" button and copy the URL under the "DOMAINS" heading (the url should look something like this: https://map-test-seven.vercel.app/)
- Go to the [map configuration file](src/lib/stores/config-features.js) (Folder: src -> lib -> stores -> config-features.js) and paste the URL on [line 3](https://github.com/EuranetPlus/map-europe/blob/e6f63675ae3706bc5337eb755ae58c61c1e27634/src/lib/stores/config-features.js#L3).

## Configure the map

In order to configure the new project, please change the contents of this [map configuration file](src/lib/stores/config-features.js) (Folder: src -> lib -> stores -> config-features.js). The configuration has a number of parameters that you should specify.

The most important entries that you need to change for each project are the "mapTitle", the "vercelURL", "datasetType", "datasetUnit" and "colourScheme":

```js
  "mapTitle": "europe", // The title of the map, if more than one word, separate by dash, e.g. "income-europe"
  "vercelURL": "https://euranet-map-europe.vercel.app", // The url provided when deploying the map on Vercel
  "datasetType": "values", // "values" or "binary"; Does the data set contain numerical values or binary (0/1) values for countries?
  "datasetUnit": "percent", // "fullNumbers" or "percent"; Is the data in percent (0.25 of GDP) or full numbers (25 people)?
  "percentRounded": false, // true or false; Should the percent values be rounded to full numbers (i.e. 26%, false) or 1-decimal place (i.e. 25.9%, true)
  "colourScheme": "blue",  // one of the following: "blue", "purple-blue", "green-blue", "orange-red", "yellow-green"
  "headlineAvailable": true, // true or false; Should the map have a headline?
  "subheadlineAvailable": true, // true or false; Should the map have a subheadline?
  "tooltipAvailable": true, // true or false; Should the map show a tooltip when hovering over a country?
  "scaleBarAvailable": true, // true or false; Should the map show a scale bar on the top?
  "legendAvailable": true, // true or false; Should the map show a legend in the bottom right corner?
  "textSourceAvailable": true, // true or false; Should the map show a source text below the map?
  "textNoteAvailable": true, // true or false; Should the map show a text note below the map?
  "textDataAccessAvailable": true, // true or false; Should the map show a link to the original data source below the map?
  "legend1Color": "#cad1d9", // Specifies the color of the first round dot in the legend entry
  "legend2Color": "red", // Specifies the color of the second round dot in the legend entry
  "legend3Color": "blue", // Specifies the color of the third round dot in the legend entry
  "legend4Color": "green" // Specifies the color of the fourt round dot in the legend entry
```

## Add data

To add or update the map data, please first decide whether the data set you are using shows "values", i.e. continous numbers on a color scale or whether it is "binary", i.e. the map shows only a few countries in the same color ("dark blue") as a category (0 = there is no data for this country, 1 = there is data for this country).

1. Set the dataset type in the [map configuration file](src/lib/stores/config-features.js) (Folder: src -> lib -> stores -> config-features.js) under "datasetType". If your dataset consists of **values data**, please use this [csv values template](https://docs.google.com/spreadsheets/d/1N7cKYXA-YnrqBI4Na7EehTbtELH2IGUDAe9wWQiPLDo/edit?usp=sharing). If it consists of **binary data**, please use this [csv binary template](https://docs.google.com/spreadsheets/d/1ff0l6IJ9ATcZZu3Ti-wQd5horS7m_XY6XgRJBGeyOZQ/edit?usp=sharing).

2. Then you need to decide whether the data consists of **full numbers** (i.e. 45 people) or **percent values**, (i.e. 45% of GDP). In the [map configuration file](src/lib/stores/config-features.js) (Folder: src -> lib -> stores -> config-features.js) this can be set under "datasetUnit".

3. Please copy the respective csv template to your own computer (or Google Drive) and fill in the desired data point for each country. Please make sure that values are formatted with dots (.) as a comma separator and **not commas**, i.e. 0.45 for percentage values instead of 0,45. In the template, all percentage values are always written as fractions of 1, **i.e. 0.45 and not 45**.

4. For any country you can add additional content information (i.e. text, audio, image and video) that will show up once you click on a country. If you want to do this for a specific country, set the value in the column "extraInfo" to **TRUE**, otherwise to **FALSE**.  
   **_Important: The column "extraInfo" needs to be included in every data set and either be set to TRUE or FALSE for each country. Otherwise the map will not work. The following columns only need to contain content if extraInfo is set to TRUE_**.

| Column Name          | Description                                                                                                                                                                               |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **text_content**     | A text for each country. Should ideally not be more than 1 small to medium-sized paragraph                                                                                                |
| **link_text**        | The text of a link that redirects to an outside resource. Usually this text would be something like "Read more" or "Link to article"                                                      |
| **link_url_target**  | The URL to which the link should refer to (e.g. https://euranetplus-inside.eu/exodus-education-and-elections/)                                                                            |
| **audio_url_1**      | The link to the **first** audio resource (spotify or soundcloud) (in the format https://open.spotify.com/embed/episode/37AK0KI06D6027Pwv96Bvk?utm_source=generator)                       |
| **audio_url_2**      | The link to the **second** audio resource (spotify or soundcloud) (in the format https://open.spotify.com/embed/episode/37AK0KI06D6027Pwv96Bvk?utm_source=generator)                      |
| **audio_url_3**      | The link to the **third** audio resource (spotify or soundcloud) (in the format https://open.spotify.com/embed/episode/37AK0KI06D6027Pwv96Bvk?utm_source=generator)                       |
| **image_url_source** | The URL to an image that should be displayed (e.g. in the format https://euranetplus-inside.eu/wp-content/uploads/2022/05/2-kuku.png)                                                     |
| **image_url_target** | The URL that the above image should point to as a link when clicking on it (e.g. in the format https://www.100komma7.lu/article/aktualiteit/49-propose-mat-326-mesuren-fir-eng-besser-eu) |
| **video_url**        | The URL to a video that should be displayed (e.g. in the format https://www.youtube.com/embed/asWW2pvhaJQ)                                                                                |

**Warning:  
Please make sure not to delete any country names or ids.  
Also make sure the CSV file is formatted with commas (,) as delimiters, not semicolons (;) or other symbols. Otherwise the map will not work. Google sheets uses commas by default, so this might be the easiest solution to use.**

4. Once you have updated the values, download the google sheet / excel file as a CSV file under >File > Download > Comma-separated-values (.csv), open it in a text editor (e.g. notepad, textEdit or similar) and copy all the contents of the csv file (Note: It is important that you do not paste the contents of the csv file directly from the google sheet, but instead from the downloaded file as text, because it will otherwise result in incorrect file formatting).

5. Open this [data file](static/data/thematic/data.csv) (Folder: static -> data -> thematic -> data.csv) and click on the pen symbol on the top right side of the file preview window where it says "Edit this file". Then paste the contents of the CSV file as text here.

After this, save the changes by pressing the green **Commit changes** button.  
Your data should now be updated and after a while show on the map. Check the Vercel URL after a few minutes to see the updated data.

## Updating text

To change the map heading, subheading, source and text note, please change the text contents of this [text configuration file](src/lib/stores/config-text.json) (Folder: src -> lib -> stores -> config-text.js). It contains the entries for all textual elements in English.

Example:  
To change the text of the heading of the map, change the "heading" entry (text in quotation marks, i.e. "" behind the :). To do this, simply click on the pen symbol on the top right side of the file preview window where it says "Edit this file". **_Warning: Please make sure to always enclose the text elemets with quotation marks and do not forget to add a comma after the entry. Otherwise the file will not be able to be read and the app may brake._**

This is **correct**:  
`"heading": "Military spending up across all EU states",`

This is **not correct** (comma is missing and no quotation marks, i.e. "" enclosing the text):  
`"heading": Military spending up across all EU states`

After this, save the changes by entering a title for the commit, e.g. "Create config-text.json" and press the green **Commit changes** button.

## Translate text

All text elements in the map are by default in English and are taken from the [text configuration file](src/lib/stores/config-text.json) (Folder: src -> lib -> stores -> config-text.js). In order to translate the text into all other EU languages, you simply need to go to the Actions tab above. Here under "workflows" select the "Translate text" workflow and press the "Run workflow" button on the right side and again the green "Run workflow" button from the dropdown menu. This will run the translate script and request the translated 24 language files from the Google API. This process may take up to a few minutes. Once this process has finished sucessfully, you should see a green check mark ✅.

**Note: It is important that you update the data first before running the automatic translations. The reason is that the additional country information is pulled directly from the csv file and thus only available for translation once the data has been added.**

## Publish map

To embed the map on any website as a responsive widget, you need to create an iFrame code, which then can be shared. The iFrame code has to be unique for each map, bacause it details the title of the map and the Vercel URL where the map is hosted. To create the iFrame code, please follow these three steps:

1. Change the "mapTitle" for the map in the [feature configuration file](src/lib/stores/config-features.js) (Folder: src -> lib -> stores -> config-features.js) (only if you have not done so yet in step [2](#configure-the-map))
2. Change the "vercelURL" in the in the [feature configuration file](src/lib/stores/config-features.js) (Folder: src -> lib -> stores -> config-features.js) (only if you have not done so yet in step [2](#configure-the-map))
3. Run the "Create iFrame code" workflow in the Actions tab above

The correct iframe code can then be copied from this [IFRAME.md file](IFRAME.md), which is generated uniquely for each project when running the script. Share this code to see the map in action on any website.

## Changing translations manually

All text elements on the map (e.g. country names, heading, subheading, source text, notes, etc.) are automatically translated into the 24 official EU languages using the Google Translate API by running an automated node script. The translations returned by Google are a good first approach, but manual edits of the text in different languages may be necessary. To do this, please go to the [language folder](static/languages) (Folder: static -> languages) and edit the contents of the respective language file.

Example:  
To change the text of the subheading of the map in Hungarian, open the [hu.json](static/languages/hu.json) file (Folder: static -> languages -> hu.json) and change the "subheading" entry (text in quotation marks, i.e. "" behind the :). To do this, simply click on the pen symbol on the top right side of the file preview window where it says "Edit this file". **_Warning: Please do not change the headings as these are automatically generated every day, based on the latest data. Also make sure to always enclose the text elemets with quotation marks and do not forget to add a comma after the entry. Otherwise the file will not be able to be read and the app may brake._**

This is **correct**:  
`"heading": "Már több mint 5,2 millió menekült menekült el Ukrajnából",`

This is **not correct** (comma is missing and no quotation marks, i.e. "" enclosing the text):  
`"heading": Már több mint 5,2 millió menekült menekült el Ukrajnából`

After this, save the changes by entering a title for the commit, e.g. "Create hu.json" and press the green **Commit changes** button.

## Development

To locally develop this map on your computer, please do the following steps in your terminal/command line:

1. Clone the repo: `git clone https://github.com/EuranetPlus/map-europe.git`
2. Open cloned folder: `cd map-europe`
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
