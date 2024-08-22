<script>
	let success = false;

	let bounty = {
		id: '#88',
		title: 'Community Event Activity Bounty'
	};

	function submit() {
		success = !success;
	}
</script>

<div>
	<div class="top-bar flex justify-between">
		{#if !success}
			<input
				class="rounded-md bg-gray-100 w-1/2 pl-3 pt-1"
				placeholder="Give your Bounty a title"
			/>
			<p class="text text-sm mt-1.5 text-white">
				<span class="opacity-50">Need more information about the Bounty Setup process? </span>
				<a href="#moreinfo">Tap here</a>
			</p>
		{:else}
			<p class="text-white">{`${bounty.id} ${bounty.title}`}</p>
		{/if}
	</div>

	{#if success}
		<div class="content">
			<p>
				{`${bounty.id} ${bounty.title}`}
				created successfully!
				<br /><br />
				You can either proceed to 2 Referendum <br />
				or go back to the list of all bounties.
				<br />
			</p>

			<div class="mt-5 flex">
				<button class="button-cancel mr-5">LIST</button>
				<button on:click={submit} class="button-active">PROCEED</button>
			</div>
		</div>
	{:else}
		<div class="grid content-between content">
			<div>
				<p class="text-xs">Bounty value</p>
				<div class="flex mt-2">
					<input
						class="border border-borderColor pt-1 pl-2 w-1/4 rounded-md bg-white"
						placeholder="0.000.0000"
					/>
				</div>
				<hr class="border-white mt-5 mb-1 w-1/2" />

				<p class="text-xs">Bounty description</p>
				<textarea
					class="border border-borderColor pt-1 pl-2 w-1/2 h-28 rounded-md bg-white mt-2e mr-2 mt-2"
					placeholder="Your Bounty description goes here"
				/>

				<hr class="border-white mt-5 mb-2 w-1/2" />
				<p class="text-xs mb-2">Submit with account</p>

				<select
					class="border border-borderColor pt-1 pl-2 w-1/4 rounded-md"
					name="accounts"
					id="accounts"
				>
					<option value="alice">Alice</option>
					<option value="bob">Bob</option>
				</select>
				<div class="mt-5 mb-10 h-24">
					<section class="mb-3">
						<p class="label text-xs">Bounty Bond</p>
						<p class="value"><span>1,067.0000</span> DOT</p>
					</section>
					<section>
						<p class="label text-xs">Transaction fee</p>
						<p class="value"><span>0,000.0800</span> DOT</p>
					</section>
				</div>
			</div>
			<div class="buttons flex">
				<button class="button-cancel mr-5">CANCEL</button>
				<button on:click={submit} class="button-active">SUBMIT</button>
			</div>
		</div>
	{/if}
</div>
