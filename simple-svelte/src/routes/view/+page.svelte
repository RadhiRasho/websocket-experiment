<script lang="ts">
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import { Creds } from '$lib';

	let socket = null;

	async function init() {
		const creds = await Creds();
		socket = io('wss://localhost:8080', {
			passphrase: 'HMM',
			key: creds.key,
			cert: creds.cert
		});

		socket.on('connect', () => {
			console.log('Connected');
		});
	}

	onMount(() => {
		init();
	});
</script>

<div>
	<h1>Page</h1>
</div>
