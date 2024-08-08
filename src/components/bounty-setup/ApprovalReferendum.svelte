<script>
	let success = false;
	let bountyId = '#88';
	let bountyTitle = 'Community Event Activity Bounty';

	function submit() {
		success = !success;
	}
</script>

<div>
	<div class="top-bar flex justify-between text-white">
		<p class="text-2xl leading-7">{`${bountyId} ${bountyTitle}`}</p>
		<p class="text-sm mt-1.5">
			<span class="opacity-50">Need more information about the Bounty Setup process? </span>
			Tap here
		</p>
	</div>

	{#if success}
		<div class="content">
			<p class="half-width">
				The Referendum for the approval of Bounty <br />
				{`${bountyId} ${bountyTitle}`} <br />
				has been created successfully!
				<br /><br />
				Please update the description on
				<span class="link underline underline-offset-2">Polkassembly</span>. The decision deposit
				needs to be placed within 7 days, for the referendum to be valid. (This deposit can be
				placed from another account).
				<br /> <br />
				You can now return to the home screen or proceed to the Curator Approval Referendum creation.
				It is strongly recommended to create the Curator Approval Referendum, after the Bounty has been
				funded and the Curator list has been informally accepted by the community in discussions on the
				platforms. Please read the information about the Curator Approval process on our
				<span class="link underline underline-offset-2">Guide</span>.
			</p>
			<div class="mt-5 flex">
				<button class="button-cancel mr-5">RETURN HOME</button>
				<button on:click={() => submit()} class="button-active">PROCEED</button>
			</div>
		</div>
	{:else}
		<div class="content">
			<div>
				<div>
					<p class="text-xs mb-1">Treasury track</p>
					<select class="border w-72 rounded-md h-7 px-1 pt-1" name="spenders" id="spenders">
						<option value="small">Small Spender</option>
						<option value="medium">Medium Spender</option>
						<option value="big">Big Spender</option>
					</select>
					<p class="text-xs mt-1">(preselected based on Bounty value)</p>
				</div>

				<hr class="border-white mt-5 mb-3 w-96" />

				<p class="text-xs mb-1">Submit with account</p>
				<select class="border w-72 rounded-md h-7 px-1 pt-1" name="accounts" id="accounts">
					<option value="alice">Alice</option>
					<option value="bob">Bob</option>
				</select>

				<div class="mt-5 h-24 mb-10">
					<section class="mb-3">
						<p class="label text-xs">Deposit</p>
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

<style>
	.link {
		color: theme('colors.accent');
	}
</style>
