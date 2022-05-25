<script>
	export let selectedCountry;
	export let countryText;
	export let countryLink;

	// Filter csvImport for audio pieces
	const asArray = Object.entries(selectedCountry.csvImport);
	const audioPieces = asArray.filter(([key, value]) => {
		return key.includes('audioURL');
	});
</script>

<!-- Text -->
<div class="pt-5">
	{countryText}
	<a class="font-bold link-text" target="_blank" href={selectedCountry.csvImport.linkURL}
		>{countryLink} …</a
	>
</div>

<!-- Audio -->

<div class="pt-5">
	{#each audioPieces as clip}
		{#if clip[1] !== ''}
			<iframe
				class="pb-2"
				style="border-radius:5px"
				src={clip[1]}
				width="100%"
				height="160"
				frameborder="0"
				allowfullscreen=""
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
			/>
		{/if}
	{/each}
</div>

<!-- Image -->
<div class="pt-5">
	<a href={selectedCountry.csvImport.imageTargetURL} target="_blank">
		<img src={selectedCountry.csvImport.imageSourceURL} alt="country info image" />
	</a>
</div>

<!-- Video -->
<div class="pt-5">
	<iframe
		width="100%"
		height="400"
		src={selectedCountry.csvImport.videoURL}
		title="YouTube video player"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
	/>
</div>

<style>
	.link-text {
		transition: all 0.2s;
	}

	.link-text:hover {
		color: #51a665;
	}
</style>
