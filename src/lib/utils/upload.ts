export async function uploadFile(
	file: File,
	scope = 'general'
): Promise<{ url: string; error?: string }> {
	try {
		const res = await fetch('/api/upload-presigned', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				fileName: file.name,
				contentType: file.type || 'application/octet-stream'
			})
		});

		const presigned = await res.json();
		if (!res.ok || presigned.error) {
			return { url: '', error: presigned.error || 'Failed to get upload URL' };
		}

		const fd = new FormData();
		for (const [key, value] of Object.entries(presigned.fields)) {
			fd.append(key, value as string);
		}
		fd.append('file', file);

		const uploadRes = await fetch(presigned.url, {
			method: 'POST',
			body: fd
		});

		if (!uploadRes.ok) {
			return { url: '', error: 'Upload to S3 failed' };
		}

		return { url: presigned.publicUrl };
	} catch (e) {
		console.error('Upload failed:', e);
		return { url: '', error: 'Upload failed' };
	}
}
