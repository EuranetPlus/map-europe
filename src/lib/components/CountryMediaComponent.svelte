<script>
	export let selectedCountry;
	export let countryText;
	export let countryLink;

	// Filter csvImport for audio pieces
	$: asArray = Object.entries(selectedCountry.csvImport);
	$: audioPieces = asArray.filter(([key, value]) => {
		return key.includes('audioURL');
	});

	// Check if country has no audio clips
	$: noAudioClipAvailable = audioPieces.every((item) => {
		return item[1] === '';
	});
</script>

<!-- Text -->
{#if countryText}
	<div class="pt-5">
		{#if countryText}
			{countryText}
		{/if}
		{#if countryLink}
			<a class="font-bold link-text" target="_blank" href={selectedCountry.csvImport.linkURL}
				>{countryLink} …</a
			>
		{/if}
	</div>
{/if}

<!-- Audio -->
{#if !noAudioClipAvailable}
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
{/if}

<!-- Image -->
{#if selectedCountry.csvImport.imageSourceURL}
	<div class="pt-5">
		<a href={selectedCountry.csvImport.imageTargetURL} target="_blank">
			<img src={selectedCountry.csvImport.imageSourceURL} alt="country info image" />
		</a>
	</div>
{/if}

<!-- Video -->
{#if selectedCountry.csvImport.videoURL}
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
{/if}

<style>
	.link-text {
		transition: all 0.2s;
	}

	.link-text:hover {
		color: #51a665;
	}
</style>
