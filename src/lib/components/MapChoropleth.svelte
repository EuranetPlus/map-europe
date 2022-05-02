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

	import { csv } from 'd3-fetch';
	import { extent } from 'd3-array';
	import { min, max } from 'd3-array';

	import { scaleQuantile, scaleSequential, scaleSequentialQuantile } from 'd3-scale';
	import { schemeBlues } from 'd3-scale-chromatic';

	import { formatInt } from '$lib/utils/formatNumbers';

	import Scale from './Scale.svelte';
	import Legend from './Legend.svelte';

	// Make square dimensions i.e. 600x600 to fill all space
	let width = 600;
	let height = 600;
	let paddingMap;
	let center;
	let scaleMin, scaleMax;

	$: countryNames = countryNameTranslations[$selectedLanguage.value];

	export let legend;
	export let tooltip;

	$: if ($CENTER_ON === 'europe') {
		paddingMap = -60;
		center = countriesAll;
	}

	$: tooltipPositionX = $MOUSE.x < $MAP_WIDTH / 2 ? $MOUSE.x : $MOUSE.x - tooltipWidth;

	let tooltipVisible = false;
	let tooltipHeight;
	let tooltipWidth;

	let graticules;
	let countriesAll;
	let hoveredCountry;

	const projection = geoIdentity().reflectY(true);
	const path = geoPath().projection(projection);
	let colorScale = scaleQuantile();
	let clusters;

	$: if (config.datasetType == 'values') {
		colorScale = scaleQuantile();
	} else if (config.datasetType == 'binary') {
		colorScale = function (value) {
			return value == 1 ? '#67A36B' : '';
		};
	}

	$: if ($dataReady) {
		console.log('Country data for map loaded');
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
				colorScale.domain(extent(extentArray)).range(schemeBlues[5]);
				clusters = colorScale.quantiles();
				scaleMin = min(extentArray);
				scaleMax = max(extentArray);
			})
			.catch((error) => console.error('error', error));
	}

	function mergeData() {
		// Transform csv structure to object style to be better usable
		let csvTransformed = $csvData.reduce(
			(obj, item) => Object.assign(obj, { [item.id]: item.value }),
			{}
		);
		// Add values from csv
		countriesAll.features.map((item) => {
			item.value = csvTransformed[item.properties.id];
		});

		$dataReady = true;
	}

	onMount(async () => {
		await fetchGeoData();
		await fetchCSV();
		await mergeData();
	});

	function getFill(feature) {
		// No data, because country not in Europe: => value: undefined
		if (feature.value !== undefined) {
			// No data because not available for this country => value: null
			if (feature.value !== null) {
				return colorScale(feature.value);
			} else {
				return '#CAD1D9';
			}
		} else {
			return '#F4F4F4';
		}
	}

	function getStroke(feature) {
		// No data, because country not in Europe: => value: undefined
		if (feature.value !== undefined) {
			// No data because not available for this country => value:
			if (feature.value !== null) {
				return 'white';
			} else {
				return 'white';
			}
		} else {
			return '#cdcdcd';
		}
	}

	// function getFill(feature) {
	// 	if (feature.value) {
	// 		return colorScale(feature.value);
	// 	} else {
	// 		if (feature.properties.isEuMember) {
	// 			return '#CAD1D9';
	// 		} else {
	// 			return '#F4F4F4';
	// 		}
	// 	}
	// }

	// function getStroke(feature) {
	// 	if (feature.value) {
	// 		return 'white';
	// 	} else {
	// 		return '#cdcdcd';
	// 	}
	// }

	function getClass(feature) {
		if (feature.value) {
			return 'pointer';
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
					valuePercent: hoveredCountry.valuePercent
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

			// console.log(countryName);
			hoveredCountry = {
				name: countryName,
				value: country.value
			};

			if (country.properties.na || country.value) {
				tooltipVisible = true;
			}
		}
	};

	$: handleMouseLeave = function (country) {
		if (config.tooltipAvailable) {
			tooltipVisible = false;
		}
	};
</script>

{#if $dataReady}
	<div id="map" class="relative" on:mousemove={handleMouseMove} bind:clientHeight={$MAP_WIDTH}>
		{#if config.scaleBarAvailable}
			<Scale classes={schemeBlues[5]} {clusters} {scaleMin} {scaleMax} />
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
				/>
			{/each}
		</svg>

		<div
			class="tooltip text-sm p-3 {tooltipVisible ? 'active' : ''}"
			style="top: {$MOUSE.y - tooltipHeight}px; left:{tooltipPositionX}px;"
			bind:clientHeight={tooltipHeight}
			bind:clientWidth={tooltipWidth}
		>
			<div class="tooltip-head font-bold">{$MOUSE.tooltip.name}</div>
			<div class="tooltip-body space-y-1">
				{#each tooltip as tip}
					<div class="values">
						{#if config.datasetUnit == 'percent'}
							<span class="font-bold">{formatInt($MOUSE.tooltip.value * 100)} %</span>
						{:else if config.datasetUnit == 'fullNumbers'}
							<span class="font-bold">{$MOUSE.tooltip.value}</span>
						{/if}
						<span>{tip.label}</span>
					</div>
				{/each}
			</div>
		</div>
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
		transition: all 0.5s;
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
