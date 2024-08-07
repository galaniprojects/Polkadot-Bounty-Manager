<script>
	let success = false;
	let bountyId = '#88';
	let bountyTitle = 'Community Event Activity Bounty';

	function submit() {
		success = !success;
	}
</script>

<div>
	<div class="top-bar">
		{#if !success}
			<input class="rounded-sm bg-gray-100 w-96 pl-3 pt-1" placeholder="Give your Bounty a title" />
		{:else}
			<p class="text-white">{`${bountyId} ${bountyTitle}`}</p>
		{/if}
	</div>

	{#if success}
		<div class="content">
			<p>
				{`${bountyId} ${bountyTitle}`}
				created successfully!
				<br /><br />
				You can either proceed to 2 Referendum <br />
				or go back to the list of all bounties.
				<br />
			</p>

			<div class="mt-5 flex">
				<button class="button-cancel mr-5">LIST</button>
				<button on:click={() => submit()} class="button-active">PROCEED</button>
			</div>
		</div>
	{:else}
		<div class="grid content-between content">
			<div>
				<p class="text-sm">Bounty value</p>
				<div class="flex mt-2">
					<input class="pt-1 pl-2 w-64 rounded-s bg-white mr-2" placeholder="0.000.0000" />
					<p class="mt-1">DOT</p>
				</div>
				<hr class="border border-white mt-5 mb-1 w-96">
				
				<p class="text-sm">Bounty description</p>
				<textarea
					class="pt-1 pl-2 md:w-96 h-32 rounded-md bg-white mt-2e mr-2 mt-2"
					placeholder="Your Bounty description goes here"
				></textarea>

				<hr class="border border-white mt-5 mb-2 w-96">
				<p class="text-sm mb-2">Submit with account</p>

				<select class="w-64" name="accounts" id="accounts">
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
			<div class="flex">
				<button class="button-cancel mr-5">CANCEL</button>
				<button on:click={() => submit()} class="button-active">SUBMIT</button>
			</div>
		</div>
	{/if}
</div>
