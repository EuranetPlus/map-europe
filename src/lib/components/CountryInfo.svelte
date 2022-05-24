<script>
	import { fly } from 'svelte/transition';
	import { countryInfoVisible } from '$lib/stores/shared';
	import CountryMediaComponent from './CountryMediaComponent.svelte';

	export let selectedCountry;
	export let countryName;

	let width;

	// $: console.log(selectedCountry);
</script>

{#if $countryInfoVisible}
	<div
		class="country-info text-sm absolute top-20 rounded bg-white p-5 border shadow-xl overflow-auto"
		bind:clientWidth={width}
		style={`left: calc(50% - ${width / 2}px);`}
		transition:fly|local={{ y: 300, duration: 500 }}
	>
		<div
			class="close text-right cursor-pointer"
			on:click={() => {
				$countryInfoVisible = false;
			}}
		>
			X
		</div>
		<div class="font-bold">{countryName}</div>

		<CountryMediaComponent {selectedCountry} />
	</div>
{/if}

<style>
	.country-info {
		width: 95%;
		height: 80%;
		z-index: 1;
	}
</style>
