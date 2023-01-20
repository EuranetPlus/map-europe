<script>
	import { config } from '$lib/stores/config-features';
	import { MOUSE } from '$lib/stores/shared';
	import { onMount } from 'svelte';
	import { CENTER_ON } from '$lib/stores/shared';
	import { csvData } from '$lib/stores/shared';
	import { feature } from 'topojson-client';
	import { geoPath, geoIdentity } from 'd3-geo';
	import { dataReady } from '$lib/stores/shared';
	import { MAP_WIDTH } from '$lib/stores/shared';
	import { selectedLanguage } from '$lib/stores/shared';
	import { countryNameTranslations } from '$lib/stores/countries';
	import { countryInfoVisible } from '$lib/stores/shared';
	import { selectedCountry } from '$lib/stores/shared';
	import { isMobile } from '$lib/stores/shared';

	import { csv } from 'd3-fetch';
	import { extent } from 'd3-array';
	import { min, max } from 'd3-array';

	import { scaleQuantile, scaleSequential, scaleSequentialQuantile } from 'd3-scale';
	import { schemeBlues, schemePuBu, schemeGnBu, schemeOrRd, schemeYlGn } from 'd3-scale-chromatic';
	import { PuBlueDarker } from '$lib/utils/customColorPalettes';

	import { formatInt } from '$lib/utils/formatNumbers';

	import Scale from './Scale.svelte';
	import Legend from './Legend.svelte';
	import CountryInfo from './CountryInfo.svelte';

	// Make square dimensions i.e. 600x600 to fill all space
	let width = 600;
	let height = 600;
	let paddingMap;
	let center;
	let scaleMin, scaleMax;

	export let legend;
	export let tooltip;
	export let extraInfoTexts;
	export let extraInfoLinks;

	$: countryNames = countryNameTranslations[$selectedLanguage.value];

	$: selectedCountryNameTranslated = countryNames.filter((item) => {
		if ($selectedCountry != undefined) {
			return item.id == $selectedCountry.properties.id;
		} else {
			return {};
		}
	})[0].na;

	let selectedCountryExtraInfoTextTranslated;
	let selectedCountryExtraInfoLinkTranslated;

	$: if ($selectedCountry) {
		selectedCountryExtraInfoTextTranslated = extraInfoTexts[$selectedCountry.properties.id];
		selectedCountryExtraInfoLinkTranslated = extraInfoLinks[$selectedCountry.properties.id];
		// console.log(selectedCountryExtraInfoTextTranslated);
	} else {
		selectedCountryExtraInfoTextTranslated = undefined;
		selectedCountryExtraInfoLinkTranslated = undefined;
	}

	let tooltipVisible = false;
	let tooltipHeight;
	let tooltipWidth;

	let graticules;
	let countriesAll;
	let countriesWithCsvImport;
	let countriesWithExtraInfo;
	let hoveredCountry;

	$: if ($CENTER_ON === 'europe') {
		paddingMap = -60;
		center = countriesAll;
	}

	$: tooltipPositionX = $MOUSE.x < $MAP_WIDTH / 2 ? $MOUSE.x : $MOUSE.x - tooltipWidth;

	const projection = geoIdentity().reflectY(true);
	const path = geoPath().projection(projection);
	let colorScale = scaleQuantile();
	let colorScheme;
	let clusters;

	$: if (config.datasetType == 'values') {
		colorScale = scaleQuantile();
	} else if (config.datasetType == 'binary') {
		colorScale = function (value) {
			return value == 1 ? '#2B3163' : '#F4F4F4';
		};
	}

	$: if (config.colourScheme == 'blue') {
		colorScheme = schemeBlues[5];
	} else if (config.colourScheme == 'purple-blue') {
		// colorScheme = schemePuBu[5];
		colorScheme = PuBlueDarker;
	} else if (config.colourScheme == 'green-blue') {
		colorScheme = schemeGnBu[5];
	} else if (config.colourScheme == 'orange-red') {
		colorScheme = schemeOrRd[5];
	} else if (config.colourScheme == 'yellow-green') {
		colorScheme = schemeYlGn[5];
	}

	$: if ($dataReady) {
		// console.log('Country data for map loaded');
		projection.fitExtent(
			[
				[paddingMap, paddingMap],
				[width - paddingMap, height - paddingMap]
			],
			center
		);
	}

	async function fetchGeoData() {
		const res = await fetch(`/data/geodata/europe-20m.json`)
			.then((response) => response.json())
			.then(function (data) {
				countriesAll = feature(data, data.objects.cntrg);
				graticules = feature(data, data.objects.gra);
			});
	}

	async function fetchCSV() {
		const res = await csv('/data/thematic/data.csv')
			.then(function (data) {
				// Parse numbers as integers
				data.forEach(function (d) {
					if (d.value !== 'null') {
						d['value'] = +d['value'];
					} else {
						d['value'] = null;
					}
				});

				let extentArray = data.map((item) => {
					return item.value;
				});
				csvData.set(data);

				// Set color scale domain and range
				if (config.datasetType == 'values') {
					colorScale.domain(extent(extentArray)).range(colorScheme);
					clusters = colorScale.quantiles();
					scaleMin = min(extentArray);
					scaleMax = max(extentArray);
				} else {
					clusters = [];
				}
			})
			.catch((error) => console.error('error', error));
	}

	function mergeData() {
		// Transform csv structure to object style to be better usable

		let csvTransformed = $csvData.reduce(
			(obj, item) =>
				Object.assign(obj, {
					[item.id]: {
						value: item.value,
						extraInfo: item.extraInfo.toLowerCase() === 'true',
						contentText: item['text_content'],
						linkText: item['link_text'],
						linkURL: item['link_url_target'],
						audioURL1: item['audio_url_1'],
						audioURL2: item['audio_url_2'],
						audioURL3: item['audio_url_3'],
						imageSourceURL: item['image_url_source'],
						imageTargetURL: item['image_url_target'],
						videoURL: item['video_url']
					}
				}),
			{}
		);

		// console.log(csvTransformed);

		// Add values from csv
		countriesAll.features.map((item) => {
			// Add attributes only for countries included in CSV
			if (Object.keys(csvTransformed).includes(item.properties.id)) {
				item.csvImport = csvTransformed[item.properties.id];
			}
		});

		countriesWithCsvImport = countriesAll.features.filter((item) => {
			return item.csvImport;
		});

		countriesWithExtraInfo = countriesWithCsvImport.filter((item) => {
			return item.csvImport.extraInfo == true;
		});

		countriesWithExtraInfo = {
			type: 'FeatureCollection',
			features: countriesWithExtraInfo
		};

		$dataReady = true;
	}

	onMount(async () => {
		await fetchGeoData();
		await fetchCSV();
		await mergeData();
	});

	function getFill(feature) {
		let csvData = feature.csvImport;

		if (csvData) {
			// No data, because country not in Europe: => value: undefined
			if (csvData.value !== undefined) {
				// No data because not available for this country => value: null
				if (csvData.value !== null) {
					return colorScale(csvData.value);
				} else {
					return '#CAD1D9';
				}
			}
		} else {
			return '#F4F4F4';
		}
	}

	function getStroke(feature) {
		let csvData = feature.csvImport;

		if (csvData) {
			// No data, because country not in Europe: => value: undefined
			if (csvData.value !== undefined) {
				// No data because not available for this country => value:
				if (csvData.value !== null) {
					if (csvData.extraInfo) {
						// return 'orange';
					} else {
						return '#cdcdcd';
					}
					return 'white';
				}
			}
		} else {
			return '#cdcdcd';
		}
	}

	function getClass(feature) {
		let csvData = feature.csvImport;

		if (csvData) {
			if (csvData.value) {
				return 'pointer';
			} else {
				return 'noPointer';
			}
		} else {
			return 'noPointer';
		}
	}

	function handleMouseMove(e) {
		let divOffset = offset(e.currentTarget);

		let mouseX = e.pageX - divOffset.left;
		let mouseY = e.pageY - divOffset.top;
		// console.log(mouseX);

		if (hoveredCountry) {
			// console.log(hoveredCountry);
			MOUSE.set({
				x: mouseX,
				y: mouseY,
				tooltip: {
					name: hoveredCountry.name,
					value: hoveredCountry.value,
					valuePercent: hoveredCountry.valuePercent,
					extraInfo: hoveredCountry.extraInfo
				}
			});
		}

		// Calculate the position of the map div in the page to get mouse position
		function offset(el) {
			let rect = el.getBoundingClientRect(),
				scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
				scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
		}
	}

	$: handleMouseEnter = function (country) {
		if (config.tooltipAvailable) {
			let countryName = countryNames.filter((c) => {
				return c.id == country.properties.id;
			})[0].na;

			// set hoveredCountry only if csvImport object is present in data
			if (country.csvImport) {
				tooltipVisible = true;

				hoveredCountry = {
					name: countryName,
					value: country.csvImport.value,
					extraInfo: country.csvImport.extraInfo
				};
			} else {
				tooltipVisible = false;

				hoveredCountry = {};
			}
		}
	};

	$: handleMouseLeave = function (country) {
		if (config.tooltipAvailable) {
			tooltipVisible = false;
		}
	};

	function handleMouseClick(country) {
		if (country.csvImport.extraInfo) {
			$countryInfoVisible = true;
			$selectedCountry = country;

			// on mobile close tooltip when clicked on country with extra info
			if ($isMobile) {
				tooltipVisible = false;
			}
		}
	}

	$: handleTouchStart = function (country) {
		handleMouseEnter(country);
		handleMouseClick(country);
	};
</script>

{#if $dataReady}
	<div id="map" class="relative" on:mousemove={handleMouseMove} bind:clientHeight={$MAP_WIDTH}>
		{#if config.datasetType == 'values'}
			{#if config.scaleBarAvailable}
				<Scale classes={colorScheme} {clusters} {scaleMin} {scaleMax} />
			{/if}
		{/if}

		{#if config.legendAvailable}
			<Legend {legend} />
		{/if}

		<svg preserveAspectRatio="xMinYMid meet" class="" viewbox="0 0 {width} {height}">
			<!-- graticules (lines) -->
			{#each graticules.features as feature, index}
				<path d={path(feature)} stroke="#cfcfcf" fill="transparent" class="noPointer" />
			{/each}

			<!-- countriesAll -->
			{#each countriesAll.features as feature, index}
				<path
					d={path(feature)}
					stroke={getStroke(feature)}
					fill={getFill(feature)}
					class={getClass(feature)}
					on:mouseenter={() => handleMouseEnter(feature)}
					on:mouseleave={() => handleMouseLeave(feature)}
					on:click={() => handleMouseClick(feature)}
				/>
			{/each}

			<!-- countriesWithExtraInfo added for the  -->
			{#each countriesWithExtraInfo.features as feature, index}
				<path
					d={path(feature)}
					stroke={getStroke(feature)}
					fill={getFill(feature)}
					class={config.datasetType == 'values'
						? 'country-extra-info-values'
						: 'country-extra-info-binary'}
					on:mouseenter={() => handleMouseEnter(feature)}
					on:mouseleave={() => handleMouseLeave(feature)}
					on:click={() => handleMouseClick(feature)}
					on:touchstart={() => handleTouchStart(feature)}
				/>
			{/each}
		</svg>

		<CountryInfo
			selectedCountry={$selectedCountry}
			countryName={selectedCountryNameTranslated}
			countryText={selectedCountryExtraInfoTextTranslated}
			countryLink={selectedCountryExtraInfoLinkTranslated}
			{tooltip}
		/>

		<!-- only show tooltip for countries with no extraInfo -->
		<!-- {#if $MOUSE.tooltip.extraInfo == false} -->
		<div
			class="tooltip text-sm p-3 {tooltipVisible ? 'active' : ''}"
			style="top: {$MOUSE.y - tooltipHeight}px; left:{tooltipPositionX}px;"
			bind:clientHeight={tooltipHeight}
			bind:clientWidth={tooltipWidth}
		>
			<div class="tooltip-head font-bold">{$MOUSE.tooltip.name}</div>
			<div class="tooltip-body space-y-1">
				{#each tooltip as tip}
					{#if config.datasetType == 'values'}
						<div class="values">
							{#if config.datasetUnit == 'percent'}
								{#if config.percentRounded == true}
									<span class="font-bold">{formatInt($MOUSE.tooltip.value * 100)}%</span>
								{:else if config.percentRounded == false}
									<span class="font-bold">{Math.round($MOUSE.tooltip.value * 1000) / 10}%</span>
								{/if}
							{:else if config.datasetUnit == 'fullNumbers'}
								<span class="font-bold">{$MOUSE.tooltip.value}</span>
							{/if}
							<span>{tip.label}</span>
						</div>
					{/if}
					{#if $MOUSE.tooltip.extraInfo == true}
						<div class="text-xs"><span class="icon-tap" />{tooltip[0].textCountryClick}</div>
					{/if}
				{/each}
			</div>
		</div>

		<!-- {/if} -->
	</div>
{/if}

<style>
	#map {
		position: relative;
	}

	svg {
		width: 100%;
		height: auto;
	}

	svg path {
		stroke-width: 0.5px;
		cursor: pointer;
		stroke-linecap: round;
	}

	.country-extra-info-values {
		/* stroke-width: 1px; */
		stroke: black;
	}

	.country-extra-info-values:hover {
		stroke-width: 1px;
	}

	.country-extra-info-binary {
		stroke: green;
	}

	.noPointer {
		pointer-events: none;
	}

	.pointer {
		pointer-events: all;
	}

	.tooltip {
		text-align: left;
		position: absolute;
		pointer-events: none;
		display: none;
		background: white;
		border-radius: 3px;
		z-index: 0;
		box-shadow: 0 10px 20px 0 rgba(185, 185, 185, 0.25);
	}

	.tooltip-head {
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #e2e2e2;
	}

	.tooltip-body {
		padding-top: 0.5rem;
	}

	.active {
		display: block;
	}
</style>
