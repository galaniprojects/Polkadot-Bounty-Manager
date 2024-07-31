<div class="grid">
	<div class="row top-bar">
		<input class="rounded-md bg-gray-100 m-3 w-96" placeholder="Give your Bounty a title" />
	</div>
	<div class="p-4">
		<p class="text-sm">Bounty value</p>
		<div class="flex mt-2">
			<input class="w-64 rounded-s bg-white mr-2" placeholder="0.000.0000" />
			<p>DOT</p>
		</div>
		<div class="border border-white mt-5 w-80"></div>

		<p class="text-sm">Bounty description</p>
		<textarea
			class="w-96 h-32 rounded-md bg-white mr-2 mt-2"
			placeholder="Your Bounty description goes here"
		></textarea>

		<div class="border border-white mt-5 w-80"></div>
		<p class="text-sm">Submit with account</p>

		<select class="w-64" name="accounts" id="accounts">
			<option value="alice">Alice</option>
			<option value="bob">Bob</option>
		</select>
	</div>
</div>

<style>
	.top-bar {
		background-color: rgba(73, 33, 113, 0.8);
	}
</style>
