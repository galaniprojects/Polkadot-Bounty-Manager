<script lang="ts">
	export let opened = true;
	export let title = '';
	export let dismissable = true;
</script>

{#if opened}
	<div
		class="flex justify-center fixed inset-0 w-screen h-screen z-9 behind-dialog-color opacity-40"
	></div>
	<div class=" flex justify-center fixed inset-0 w-screen h-screen z-10 py-52">
		<div
			class="w-[300px] md:w-[700px] h-[250px] shadow shadow-gray-500 rounded-md dialog-background-color"
		>
			<div class="flex justify-between">
				<p class="m-6 text-xl">
					{title}
				</p>
				{#if dismissable}
				<button class="m-4" on:click={() => (opened = false)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="30px"
						viewBox="0 -960 960 960"
						width="30px"
						fill="#E6007A"
						><path
							d="m332-285.33 148-148 148 148L674.67-332l-148-148 148-148L628-674.67l-148 148-148-148L285.33-628l148 148-148 148L332-285.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"
						/></svg
					>
				</button>
	{/if}
			</div>
			<div class="h-[120px]">
				<slot></slot>
			</div>
		</div>
	</div>
{/if}

<style>
	.dialog-background-color {
		background-color: #e5e3ee;
	}
	.behind-dialog-color {
		background-color: rgba(0, 0, 0, 0.66);
	}
</style>
