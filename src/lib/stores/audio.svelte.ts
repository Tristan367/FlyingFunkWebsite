export type Song = {
	id: string;
	title: string;
	path: string;
	description?: string | null;
	uploaderName?: string | null;
	pinned?: boolean | null;
	uploadedAt: string;
};

let currentSong = $state<Song | null>(null);
let isPlaying = $state(false);
let autoPlay = $state(true);
let shuffle = $state(false);
let currentTime = $state(0);
let duration = $state(0);
let volume = $state(1);
let buffered = $state(0);

let _audio: HTMLAudioElement | null = null;
let _songList: Song[] = [];
let _shuffleList: Song[] = [];
let _currentIndex = -1;
let _rafId = 0;

function shuffleArray<T>(arr: T[]): T[] {
	const out = [...arr];
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

function startRaf() {
	stopRaf();
	function tick() {
		if (_audio) {
			currentTime = _audio.currentTime;
		}
		_rafId = requestAnimationFrame(tick);
	}
	_rafId = requestAnimationFrame(tick);
}

function stopRaf() {
	if (_rafId) {
		cancelAnimationFrame(_rafId);
		_rafId = 0;
	}
}

function getAudio(): HTMLAudioElement {
	if (!_audio) {
		_audio = new Audio();
		_audio.volume = volume;
		_audio.addEventListener('loadedmetadata', () => {
			duration = _audio!.duration;
		});
		_audio.addEventListener('progress', () => {
			if (_audio!.buffered.length > 0) {
				buffered = _audio!.buffered.end(_audio!.buffered.length - 1);
			}
		});
		_audio.addEventListener('play', () => {
			isPlaying = true;
			startRaf();
		});
		_audio.addEventListener('pause', () => {
			isPlaying = false;
			stopRaf();
		});
		_audio.addEventListener('ended', () => {
			isPlaying = false;
			stopRaf();
			if (autoPlay) next();
		});
	}
	return _audio;
}

export function play(song: Song, list: Song[]) {
	_songList = list;
	if (shuffle) {
		_shuffleList = shuffleArray(list);
		if (currentSong && currentSong.id === song.id) {
			// same song: keep position in shuffled list
			_currentIndex = _shuffleList.findIndex((s) => s.id === song.id);
		} else {
			// new song: put it first, shuffle the rest
			_currentIndex = 0;
			const rest = _shuffleList.filter((s) => s.id !== song.id);
			_shuffleList = [song, ...shuffleArray(rest)];
		}
	} else {
		_currentIndex = list.findIndex((s) => s.id === song.id);
	}
	currentSong = song;
	buffered = 0;
	const a = getAudio();
	a.src = song.path;
	a.play().catch(() => {});
}

export function togglePlayPause() {
	if (!_audio) return;
	if (_audio.paused) {
		_audio.play().catch(() => {});
	} else {
		_audio.pause();
	}
}

function advance() {
	const list = shuffle ? _shuffleList : _songList;
	if (list.length === 0) return;

	let idx = _currentIndex + 1;
	if (idx >= list.length) {
		if (shuffle) {
			const lastSong = currentSong;
			_shuffleList = shuffleArray(_songList);
			// avoid repeating the last song if possible
			if (_shuffleList.length > 1 && _shuffleList[0].id === lastSong?.id) {
				[_shuffleList[0], _shuffleList[1]] = [_shuffleList[1], _shuffleList[0]];
			}
			idx = 0;
		} else {
			idx = 0;
		}
	}

	const song = list[idx];
	_currentIndex = idx;
	currentSong = song;
	buffered = 0;
	const a = getAudio();
	a.src = song.path;
	a.play().catch(() => {});
}

export function next() {
	advance();
}

export function prev() {
	const list = shuffle ? _shuffleList : _songList;
	if (list.length === 0) return;

	let idx = _currentIndex - 1;
	if (idx < 0) idx = list.length - 1;

	const song = list[idx];
	_currentIndex = idx;
	currentSong = song;
	buffered = 0;
	const a = getAudio();
	a.src = song.path;
	a.play().catch(() => {});
}

export function seek(time: number) {
	if (_audio) _audio.currentTime = time;
}

export function setVolume(v: number) {
	volume = v;
	if (_audio) _audio.volume = v;
}

export function setShuffle(on: boolean) {
	shuffle = on;
	if (on && _songList.length > 0 && currentSong) {
		// put current song first, then shuffle the rest
		const rest = _songList.filter((s) => s.id !== currentSong!.id);
		_shuffleList = [currentSong!, ...shuffleArray(rest)];
		_currentIndex = 0;
	}
}

export const player = {
	get currentSong() { return currentSong; },
	get isPlaying() { return isPlaying; },
	get autoPlay() { return autoPlay; },
	set autoPlay(v: boolean) { autoPlay = v; },
	get shuffle() { return shuffle; },
	set shuffle(v: boolean) { setShuffle(v); },
	get currentTime() { return currentTime; },
	get duration() { return duration; },
	get volume() { return volume; },
	get buffered() { return buffered; },
	play,
	togglePlayPause,
	next,
	prev,
	seek,
	setVolume,
};
