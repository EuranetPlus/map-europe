<script>
	import { fly } from 'svelte/transition';
	import { countryInfoVisible } from '$lib/stores/shared';

	export let selectedCountry;
	export let countryName;

	let width;

	// $: console.log(selectedCountry);
</script>

{#if $countryInfoVisible}
	<div
		class="country-info text-sm absolute top-20 rounded bg-white p-3 border z-10 shadow-xl overflow-auto"
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
		<div class="pt-5">
			{selectedCountry.csvImport.contentText}
			<a class="font-bold" target="_blank" href={selectedCountry.csvImport.linkURL}
				>{selectedCountry.csvImport.linkText} …</a
			>
		</div>
		<div class="pt-5">
			<iframe
				style="border-radius:5px"
				src={selectedCountry.csvImport.audioURL1}
				width="80%"
				height="150"
				frameborder="0"
				allowfullscreen=""
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
			/>
		</div>
		<div class="pt-5">
			<a href={selectedCountry.csvImport.imageTargetURL} target="_blank">
				<img src={selectedCountry.csvImport.imageSourceURL} alt="country info image" />
			</a>
		</div>
		<div class="pt-5">
			<iframe
				width="560"
				height="315"
				src={selectedCountry.csvImport.videoURL}
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			/>
		</div>
	</div>
{/if}

<style>
	.country-info {
		width: 95%;
		height: 80%;
	}
</style>
