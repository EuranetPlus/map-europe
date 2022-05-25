<script>
	import { fly } from 'svelte/transition';
	import { countryInfoVisible } from '$lib/stores/shared';
	import CountryMediaComponent from './CountryMediaComponent.svelte';

	export let selectedCountry;
	export let countryName;
	export let countryText;

	let width;
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
		<div class="font-bold border-b pb-2">{countryName}</div>

		<CountryMediaComponent {selectedCountry} {countryText} />
	</div>
{/if}

<style>
	.country-info {
		width: 95%;
		height: 80%;
		z-index: 1;
	}

	.icon-close {
		transition: all 0.2s;
	}

	.icon-close:hover {
		color: #51a665;
	}
</style>
