<script>
	export let legend;
</script>

<div class="legend absolute bg-white border rounded p-2 text-sm bottom-3 right-3">
	{#each legend as item}
		<div>
			<span
				class="dot inline-block rounded-full mr-2"
				style="background-color: {item.color}"
			/>{item.label}
		</div>
	{/each}
</div>

<style>
	.dot {
		height: 10px;
		width: 10px;
		border: 1px solid #cdcdcd;
	}
</style>
