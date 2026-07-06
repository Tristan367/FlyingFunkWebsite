<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		address?: string;
		lat?: number;
		lng?: number;
		onSelect?: (lat: number, lng: number, address: string) => void;
	}

	interface Suggestion {
		name: string;
		address: string;
		lat: number;
		lng: number;
	}

	let { address = '', lat = 47.6588, lng = -117.4260, onSelect }: Props = $props();

	let mapContainer: HTMLDivElement | null = $state(null);
	let searchInput: HTMLInputElement | null = $state(null);
	let map: any = null;
	let marker: any = null;
	let L: any = null;

	let ui = $state({ suggestions: [] as Suggestion[], open: false });

	let debounce: ReturnType<typeof setTimeout> | null = null;
	let abort: AbortController | null = null;

	const STATE_ABBREV: Record<string, string> = {
		'washington': 'WA', 'idaho': 'ID', 'oregon': 'OR', 'montana': 'MT',
		'california': 'CA', 'nevada': 'NV', 'utah': 'UT', 'arizona': 'AZ',
		'colorado': 'CO', 'wyoming': 'WY', 'new mexico': 'NM', 'texas': 'TX'
	};

	function formatAddress(p: any): string {
		const parts: string[] = [];
		if (p.housenumber && p.street) parts.push(`${p.housenumber} ${p.street}`);
		else if (p.street) parts.push(p.street);
		if (p.city || p.locality) parts.push(p.city || p.locality);
		if (p.state) {
			const st = p.state.toLowerCase();
			parts.push(STATE_ABBREV[st] || p.state);
		}
		return parts.join(', ') || p.name || '';
	}

	function coordLabel(ll: { lat: number; lng: number }): string {
		return `${ll.lat.toFixed(5)}, ${ll.lng.toFixed(5)}`;
	}

	async function doSearch(query: string) {
		if (query.length < 2) {
			ui = { suggestions: [], open: false };
			return;
		}
		abort?.abort();
		abort = new AbortController();
		try {
			const res = await fetch(
				`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lat=${lat}&lon=${lng}`,
				{ signal: abort.signal }
			);
			const data = await res.json();
			const suggestions: Suggestion[] = (data.features || []).map((f: any) => ({
				name: f.properties.name || '',
				address: formatAddress(f.properties),
				lat: f.geometry.coordinates[1],
				lng: f.geometry.coordinates[0]
			}));
			ui = { suggestions, open: suggestions.length > 0 };
		} catch (e: any) {
			if (e.name !== 'AbortError') {
				ui = { suggestions: [], open: false };
			}
		}
	}

	function handleInput(e: Event) {
		if (debounce) clearTimeout(debounce);
		const val = (e.target as HTMLInputElement).value;
		debounce = setTimeout(() => doSearch(val), 200);
	}

	function selectSuggestion(s: Suggestion) {
		const addr = s.name && s.address && s.address !== s.name
			? `${s.name}, ${s.address}`
			: s.address || s.name;
		if (searchInput) searchInput.value = addr;
		ui = { suggestions: [], open: false };
		if (marker && L) {
			const ll = L.latLng(s.lat, s.lng);
			marker.setLatLng(ll);
			map.setView(ll, 16);
		}
		onSelect?.(s.lat, s.lng, addr);
	}

	function movePin(ll: any) {
		if (!marker || !L) return;
		marker.setLatLng(ll);
		const addr = coordLabel(ll);
		if (searchInput) searchInput.value = addr;
		onSelect?.(ll.lat, ll.lng, addr);
	}

	function handleFocus() {
		if (ui.suggestions.length > 0) ui = { ...ui, open: true };
	}

	function handleBlur() {
		setTimeout(() => ui = { ...ui, open: false }, 200);
	}

	onMount(() => {
		if (!browser || !mapContainer) return;
		initMap();
		return () => map?.remove();
	});

	async function initMap() {
		const leaflet = await import('leaflet');
		L = leaflet.default;
		await import('leaflet/dist/leaflet.css');

		map = L.map(mapContainer).setView([lat, lng], 13);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap',
			maxZoom: 19
		}).addTo(map);

		const pinIcon = L.divIcon({
			className: 'custom-pin',
			html: `<div style="width:30px;height:30px;background:#f59e0b;border:3px solid #d97706;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:2px 2px 4px rgba(0,0,0,0.4)"></div>`,
			iconSize: [30, 30],
			iconAnchor: [15, 30]
		});

		marker = L.marker([lat, lng], { draggable: true, icon: pinIcon }).addTo(map);

		marker.on('dragend', () => movePin(marker.getLatLng()));
		map.on('click', (e: any) => movePin(e.latlng));

		if (address) {
			const coordMatch = address.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
			if (coordMatch) {
				const ll = L.latLng(parseFloat(coordMatch[1]), parseFloat(coordMatch[2]));
				marker.setLatLng(ll);
				map.setView(ll, 14);
				if (searchInput) searchInput.value = address;
				onSelect?.(ll.lat, ll.lng, address);
			} else {
				try {
					const res = await fetch(
						`https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1&lat=${lat}&lon=${lng}`
					);
					const data = await res.json();
					if (data.features?.length > 0) {
						const f = data.features[0];
						const ll = L.latLng(f.geometry.coordinates[1], f.geometry.coordinates[0]);
						marker.setLatLng(ll);
						map.setView(ll, 14);
						const addr = formatAddress(f.properties);
						if (searchInput) searchInput.value = addr || address;
						onSelect?.(ll.lat, ll.lng, addr || address);
					}
				} catch {}
			}
		}
	}
</script>

<div>
	<div class="relative">
		<input
			type="text"
			bind:this={searchInput}
			oninput={handleInput}
			onfocus={handleFocus}
			onblur={handleBlur}
			placeholder="Search for a venue or address..."
			class="w-full rounded-t-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
		/>
		{#if ui.open}
			<div class="absolute w-full border border-t-0 border-zinc-700 bg-zinc-900 shadow-lg" style="z-index: 1100;">
				{#each ui.suggestions as s}
					<button
						type="button"
						onmousedown={(e) => e.preventDefault()}
						onclick={() => selectSuggestion(s)}
						class="w-full px-4 py-2.5 text-left hover:bg-zinc-800"
					>
						<div class="text-sm font-medium text-zinc-200">{s.name}</div>
						<div class="text-xs text-zinc-500">{s.address}</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
	<div bind:this={mapContainer} class="h-72 w-full rounded-b-lg border border-t-0 border-zinc-700"></div>
</div>
