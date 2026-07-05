// Svelte action that extracts and executes <script> tags from rendered HTML
export function executeScripts(node: HTMLElement) {
	const scripts = node.querySelectorAll('script');
	for (const script of scripts) {
		const s = document.createElement('script');
		s.textContent = script.textContent;
		document.body.appendChild(s);
		script.remove();
	}
}
