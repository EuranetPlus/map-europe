<script>
	import { formatInt } from '$lib/utils/formatNumbers';
	import { config } from '$lib/stores/config-features';

	let width;

	export let classes;
	export let clusters;

	export let scaleMin;
	export let scaleMax;

	// Add the static values from the config if available
	const colorBarFirstValue =
		config.colorBarFirstValue !== undefined ? config.colorBarFirstValue : scaleMin;
	const colorBarLastValue =
		config.colorBarLastValue !== undefined ? config.colorBarLastValue : scaleMax;

	// Force 'fullNumbers' if either colorBarFirstValue or colorBarLastValue exists
	if (colorBarFirstValue !== scaleMin || colorBarLastValue !== scaleMax) {
		config.datasetUnit = 'fullNumbers';
	}

	clusters.unshift(0);

	function displayDigit(index, number) {
		// Get the total number of clusters from config.colourSchemeClasses
		const totalClusters = config.colourSchemeClasses;

		// Display only for the first and last clusters
		if (index === 0 || index === totalClusters - 1) {
			// Choose to display the static values or the scale min/max
			const displayValue = index === 0 ? colorBarFirstValue : colorBarLastValue;

			// If datasetUnit is 'percent', multiply the value by 100, otherwise return the value directly
			return config.datasetUnit === 'percent'
				? formatInt(displayValue * 100)
				: config.datasetUnit === 'fullNumbers'
				? displayValue
				: '';
		}
		// Return an empty string for other clusters
		return '';
	}

	$: swatchWidth =
		config.colourSchemeClasses > 9 ? '8vw' : config.colourSchemeClasses > 6 ? '10vw' : '13vw';
</script>

<div
	class="scale text-sm absolute top-3 rounded bg-white p-3 border"
	bind:clientWidth={width}
	style={`left: calc(50% - ${width / 2}px);`}
>
	<div class="flex justify-center">
		{#each classes as swatch}
			<div class="swatch" style="background: {swatch}; width: {swatchWidth}" />
		{/each}
	</div>
	<div class="flex justify-between">
		{#each clusters as number, index}
			<div class="swatch text-xs">
				{displayDigit(index, index == 0 ? scaleMin : scaleMax)}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.swatch {
		height: 1.2vh;
	}

	.swatch:first-of-type {
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}

	.swatch:last-of-type {
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
</style>
