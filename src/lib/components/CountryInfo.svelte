<script>
	import { config } from '$lib/stores/config-features';
	import { fly } from 'svelte/transition';
	import { countryInfoVisible } from '$lib/stores/shared';
	import CountryMediaComponent from './CountryMediaComponent.svelte';
	import { MOUSE } from '$lib/stores/shared';
	import { formatInt } from '$lib/utils/formatNumbers';

	export let selectedCountry;
	export let countryName;
	export let countryText;
	export let countryLink;
	export let tooltip;

	let width;
	let countryValue;

	// $: countryValue =
	// 	config.datasetUnit == 'percent' ? formatInt($MOUSE.tooltip.value * 100) : $MOUSE.tooltip.value;
	$: if(selectedCountry){
		countryValue = config.datasetUnit == 'percent' ? formatInt(selectedCountry.csvImport.value * 100) : selectedCountry.csvImport.value;
		// console.log(countryValue)
	}

	$: countryUnit = config.datasetUnit == 'percent' ? '%' : '';
	$: countryLabel = tooltip[0].label;
</script>

{#if $countryInfoVisible}
	<div
		class="country-info text-sm absolute top-20 rounded bg-white p-5 border shadow-xl overflow-auto"
		bind:clientWidth={width}
		style={`left: calc(50% - ${width / 2}px);`}
	>
		<div
			class="icon-close transition-all text-right cursor-pointer static"
			on:click={() => {
				$countryInfoVisible = false;
			}}
		/>
		<div class="border-b pb-2">
			<span class="font-bold">{countryName}</span>
			{#if config.datasetType == 'values'}
				{#if $MOUSE.tooltip.value}
					<span>–</span>
					<span class="font-bold">{countryValue}{countryUnit}</span> <span>{countryLabel}</span>
				{/if}
			{/if}
		</div>

		<CountryMediaComponent {selectedCountry} {countryText} {countryLink} />
	</div>
{/if}

<style>
	.country-info {
		width: 95%;
		max-height: 80%;
		z-index: 1;
		top: 1rem;
	}

	.icon-close {
		transition: all 0.2s;
	}

	.icon-close:hover {
		color: #51a665;
	}
</style>
