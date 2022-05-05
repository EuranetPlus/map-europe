<script>
	import { formatInt } from '$lib/utils/formatNumbers';
	import { config } from '$lib/stores/config-features';

	let width;

	export let classes;
	export let clusters;

	export let scaleMin;
	export let scaleMax;

	clusters.unshift(0);

	function displayDigit(index, number) {
		if (index == 0 || index == 4) {
			if (config.datasetUnit == 'percent') {
				return formatInt(number * 100);
			} else if (config.datasetUnit == 'fullNumbers') {
				return number;
			}
		} else {
			return '';
		}
	}
</script>

<div
	class="scale text-sm absolute top-3 rounded bg-white p-3 border"
	bind:clientWidth={width}
	style={`left: calc(50% - ${width / 2}px);`}
>
	<div class="flex justify-center">
		{#each classes as swatch}
			<div class="swatch" style="background: {swatch};" />
		{/each}
	</div>
	<div class="flex justify-center">
		{#each clusters as number, index}
			<div class="swatch text-xs {index == 0 ? 'text-left' : 'text-right'}">
				{displayDigit(index, index == 0 ? scaleMin : scaleMax)}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.swatch {
		width: 15vw;
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
