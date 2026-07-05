export function instrumentEmoji(inst: string): string {
	const i = (inst || '').toLowerCase();
	if (i.includes('guitar') || i.includes('bass')) return '🎸';
	if (i.includes('drum')) return '🥁';
	if (i.includes('vocal') || i.includes('sing')) return '🎤';
	if (i.includes('key') || i.includes('piano')) return '🎹';
	if (i.includes('trumpet')) return '🎺';
	if (i.includes('sax')) return '🎷';
	if (i.includes('trombon')) return '🎺';
	return '';
}
