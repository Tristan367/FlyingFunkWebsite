import { db } from './index';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

const members = [
	{ id: 'm1', name: 'Tristan', email: 'tristan@flyingfunk.com', phone: '509-555-0001', instrument: 'Guitar', instruments: 'guitar, bass', unavailableOnHolidays: false, address: 'Spokane, WA', slug: 'tristan' },
	{ id: 'm2', name: 'Madi', email: 'madi@flyingfunk.com', phone: '509-555-0002', instrument: 'Vocals', instruments: 'vocals', unavailableOnHolidays: false, address: 'Spokane, WA', slug: 'madi' },
	{ id: 'm3', name: 'Matt', email: 'matt@flyingfunk.com', phone: '509-555-0003', instrument: 'Drums', instruments: 'drums', unavailableOnHolidays: false, address: 'Spokane Valley, WA', slug: 'matt' },
	{ id: 'm4', name: 'Johnny', email: 'johnny@flyingfunk.com', phone: '509-555-0004', instrument: 'Keys', instruments: 'keys', unavailableOnHolidays: false, address: 'Spokane, WA', slug: 'johnny' },
	{ id: 'm5', name: 'Stefan', email: 'stefan@flyingfunk.com', phone: '208-555-0005', instrument: 'Bass', instruments: 'bass, keys', unavailableOnHolidays: false, address: 'Coeur d\'Alene, ID', slug: 'stefan' },
	{ id: 'm6', name: 'Robert', email: 'robert@flyingfunk.com', phone: '509-555-0010', instrument: 'Bass', instruments: 'bass', unavailableOnHolidays: false, address: 'Spokane, WA', slug: 'robert' },
	{ id: 'm7', name: 'Mike', email: 'mike@flyingfunk.com', phone: '509-555-0006', instrument: 'Trumpet', instruments: 'trumpet', unavailableOnHolidays: false, address: 'Cheney, WA', slug: 'mike' },
	{ id: 'm8', name: 'Mik', email: 'mik@flyingfunk.com', phone: '208-555-0007', instrument: 'Saxophone', instruments: 'saxophone', unavailableOnHolidays: false, address: 'Post Falls, ID', slug: 'mik' },
	{ id: 'm9', name: 'Jim', email: 'jim@flyingfunk.com', phone: '509-555-0008', instrument: 'Trombone', instruments: 'trombone', unavailableOnHolidays: false, address: 'Liberty Lake, WA', slug: 'jim' }
];

await db.delete(schema.gigVotes);
await db.delete(schema.removalVotes);
await db.delete(schema.sessions);
await db.delete(schema.verificationCodes);
await db.delete(schema.images);
await db.delete(schema.blogPosts);
await db.delete(schema.recurringUnavailability);
await db.delete(schema.unavailability);
await db.delete(schema.gigs);
await db.delete(schema.members);

const cfg = await db.select().from(schema.siteConfig).get();
if (!cfg) await db.insert(schema.siteConfig).values({ id: 1 });

await db.insert(schema.members).values(members);

function daysFromNow(days: number): string {
	const d = new Date();
	d.setDate(d.getDate() + days);
	return d.toISOString().split('T')[0];
}

// Matt: unavailable on Sundays
await db.insert(schema.recurringUnavailability).values([
	{ memberId: 'm3', dayOfWeek: 0 }, // Sunday
]);
// Johnny: unavailable on Thursdays
await db.insert(schema.recurringUnavailability).values([
	{ memberId: 'm4', dayOfWeek: 4 }, // Thursday
]);
// Mike: unavailable on Mondays
await db.insert(schema.recurringUnavailability).values([
	{ memberId: 'm7', dayOfWeek: 1 }, // Monday
]);
// Mik: unavailable on Tuesdays
await db.insert(schema.recurringUnavailability).values([
	{ memberId: 'm8', dayOfWeek: 2 }, // Tuesday
]);
// Jim: unavailable on Wednesdays + holidays
await db.insert(schema.recurringUnavailability).values([
	{ memberId: 'm9', dayOfWeek: 3 }, // Wednesday
]);
await db.update(schema.members).set({ unavailableOnHolidays: true }).where(eq(schema.members.id, 'm9'));

// Sample gigs
await db.insert(schema.gigs).values([
	{ date: daysFromNow(3), time: '9:00 PM', venue: "O'Malley's Pub", venueAddress: "110 S Madison St, Spokane, WA", description: 'Friday night funk party!', rate: '$1000', withHorns: true, status: 'confirmed' },
	{ date: daysFromNow(10), time: '8:00 PM', venue: 'The Blue Note', venueAddress: "1011 W 1st Ave, Spokane, WA", description: 'An evening of classic 70s funk covers.', rate: '$1200', withHorns: true, status: 'confirmed' },
	{ date: daysFromNow(17), time: '7:00 PM', venue: 'Wedding Reception', description: 'Private wedding — rhythm section only.', rate: '$500', withHorns: false, private: true, status: 'confirmed' },
]);

await db.insert(schema.blogPosts).values([
	{ authorId: 'm1', title: 'New Rehearsal Space!', slug: 'new-rehearsal-space',
		content: '<h2>We found a new spot!</h2><p>After months of searching, we finally locked down an awesome rehearsal space downtown. The acoustics are incredible — the horns have never sounded better.</p><p>The landlord said we can make as much noise as we want after 6pm. Johnny already brought in his vintage Wurlitzer. This place is going to be <em>funky</em>.</p>',
		publishedAt: daysFromNow(-5) },
	{ authorId: 'm2', title: 'My Top 5 Funk Vocalists', slug: 'top-5-funk-vocalists',
		content: '<h2>The voices that shaped funk</h2><p>When people think funk, they think bass lines and horn sections. But the vocals? The vocals are what make you <strong>feel</strong> it.</p><ol><li><strong>Chaka Khan</strong> — No list is complete without her.</li><li><strong>James Brown</strong> — The Godfather.</li><li><strong>Betty Davis</strong> — Raw and unapologetic.</li><li><strong>Bootsy Collins</strong> — Bass AND vocals.</li><li><strong>Stevie Wonder</strong> — Not strictly funk, but undeniable groove.</li></ol>',
		publishedAt: daysFromNow(-12) },
	{ authorId: 'm1', title: 'How to Make an Awesome Blog Post', slug: 'blog-demo',
		content: '<div id="crazy-post" style="position:relative;;background:#0a0a0a;color:#f0f0f0;font-family:\'Segoe UI\',sans-serif;padding:0;;min-height:100vh">\n\n<!-- Parallax background -->\n<div style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;background:\n  repeating-linear-gradient(45deg,#ff00ff10 0px,#ff00ff10 40px,#00ffff10 40px,#00ffff10 80px),\n  repeating-linear-gradient(-45deg,#ffff0010 0px,#ffff0010 20px,#ff000010 20px,#ff000010 40px),\n  radial-gradient(circle at 20% 50%,#ff6b3520 0%,transparent 50%),\n  radial-gradient(circle at 80% 20%,#6b35ff20 0%,transparent 50%),\n  radial-gradient(circle at 50% 80%,#35ff6b20 0%,transparent 50%);\n"></div>\n\n<div style="position:relative;z-index:1;max-width:900px;margin:0 auto;padding:3rem 1.5rem">\n\n<h1 style="font-size:3rem;text-align:center;background:linear-gradient(90deg,#ff6b35,#f7c948,#63cdda,#ff6b35);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite;margin-bottom:1rem">Hey Bandmates! Make Cool Sh*t</h1>\n\n<style>@keyframes shimmer{0%{background-position:0% center}100%{background-position:200% center}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}</style>\n\n<p style="text-align:center;font-size:1.3rem;color:#a0a0a0;max-width:650px;margin:0 auto 3rem">Blog posts are <strong style="color:#ff6b35">raw HTML.</strong> You can make them look like <em>whatever you want.</em> Don\'t know HTML? Ask ChatGPT, Claude, or any AI to write it for you.</p>\n\n<!-- Getting started section -->\n<div style="background:#ffffff08;border:1px solid #ffffff15;border-radius:16px;padding:2rem;margin-bottom:3rem">\n<h2 style="color:#63cdda;text-align:center;margin-top:0">&#x1F4CB; The Easy Way (AI + Template)</h2>\n\n<p style="color:#a0a0a0;font-size:1.05rem;line-height:1.6;text-align:center;max-width:600px;margin:1rem auto">\n  <strong>Step 1:</strong> Copy the template below into ChatGPT/Claude.<br>\n  <strong>Step 2:</strong> Tell it <em>"Write a blog post for my funk band about [your topic]. Use the template structure but go wild with colors, animations, and custom styling. Make it completely different from the rest of the site."</em><br>\n  <strong>Step 3:</strong> Paste the result into the blog editor in <span style="color:#ff6b35">HTML mode</span>.<br>\n  <strong>Step 4:</strong> Add images by using <code style="background:#ffffff10;color:#f7c948;padding:0.15em 0.4em;border-radius:3px">./images/your-filename.jpg</code> in your HTML. Upload your images first with the <span style="color:#f7c948">"Img"</span> button — it automatically makes them available at that path. Super easy.</p>\n</p>\n\n<div style="background:#00000040;border:1px solid #ffffff10;border-radius:12px;padding:1.5rem;margin:1.5rem 0;overflow-x:auto">\n<pre style="color:#63cdda;font-size:0.8rem;line-height:1.5;margin:0"><code>&lt;h2&gt;Your Title&lt;/h2&gt;\n\n&lt;p&gt;Opening paragraph. What\'s this about?&lt;/p&gt;\n\n&lt;img src="./images/your-photo.jpg" alt="My photo" /&gt;\n\n&lt;blockquote&gt;\n  &lt;p&gt;"A memorable quote."&lt;/p&gt;\n&lt;/blockquote&gt;\n\n&lt;h3&gt;Section Heading&lt;/h3&gt;\n&lt;ul&gt;\n  &lt;li&gt;&lt;strong&gt;Bullet points&lt;/strong&gt; for lists&lt;/li&gt;\n  &lt;li&gt;Keep each bullet short and punchy&lt;/li&gt;\n&lt;/ul&gt;\n\n&lt;hr /&gt;\n&lt;p&gt;&lt;em&gt;Thanks for reading!&lt;/em&gt;&lt;/p&gt;</code></pre>\n</div>\n\n<p style="color:#888;font-size:0.9rem;text-align:center"><strong style="color:#f7c948">How images work:</strong> Upload any photo using the <strong style="color:#ff6b35">"Img"</strong> button in the toolbar. Then just write <code style="background:#ffffff10;color:#f7c948;padding:0.15em 0.4em;border-radius:3px">src="./images/filename.jpg"</code> in your HTML. The site automatically replaces it with the real URL. No copy-pasting needed.</p>\n</div>\n\n<!-- Animated cards -->\n<div style="display:flex;flex-wrap:wrap;gap:1.5rem;justify-content:center;margin-bottom:3rem">\n  <div style="flex:1;min-width:200px;background:#ffffff08;backdrop-filter:blur(10px);border:1px solid #ffffff15;border-radius:16px;padding:2rem;text-align:center;animation:float 3s ease-in-out infinite">\n    <div style="font-size:3rem;animation:spin 8s linear infinite;display:inline-block">&#x1F3B8;</div>\n    <h3 style="color:#ff6b35;margin:1rem 0 0.5rem">JavaScript Games</h3>\n    <p style="color:#888;font-size:0.95rem">Yes, you can embed actual games. Try the one below.</p>\n  </div>\n  <div style="flex:1;min-width:200px;background:#ffffff08;backdrop-filter:blur(10px);border:1px solid #ffffff15;border-radius:16px;padding:2rem;text-align:center;animation:float 3s ease-in-out infinite;animation-delay:0.5s">\n    <div style="font-size:3rem;animation:pulse 2s ease-in-out infinite">&#x26A1;</div>\n    <h3 style="color:#f7c948;margin:1rem 0 0.5rem">AI-Generated HTML</h3>\n    <p style="color:#888;font-size:0.95rem">Just describe what you want. AI writes the code.</p>\n  </div>\n  <div style="flex:1;min-width:200px;background:#ffffff08;backdrop-filter:blur(10px);border:1px solid #ffffff15;border-radius:16px;padding:2rem;text-align:center;animation:float 3s ease-in-out infinite;animation-delay:1s">\n    <div style="font-size:3rem">&#x1F30D;</div>\n    <h3 style="color:#63cdda;margin:1rem 0 0.5rem">YouTube &amp; Spotify</h3>\n    <p style="color:#888;font-size:0.95rem">Embed anything with an iframe — just paste the embed code.</p>\n  </div>\n</div>\n\n<!-- Canvas game -->\n<h2 style="text-align:center;color:#ff6b35;font-size:2rem;margin:3rem 0 1rem">&#x1F3AE; Catch the Funk Note</h2>\n<p style="text-align:center;color:#888;margin-bottom:1rem">This is a real game running in a blog post. Click the bouncing note.</p>\n\n<div style="display:flex;justify-content:center;margin-bottom:2rem">\n<canvas id="game" width="500" height="250" style="border:2px solid #ff6b3540;border-radius:12px;cursor:pointer;background:#00000040"></canvas>\n</div>\n<p id="score" style="text-align:center;font-size:1.5rem;color:#f7c948;font-weight:bold">Score: 0</p>\n\n<script>\n(function(){\n  var c=document.getElementById(\'game\');\n  if(!c)return;\n  var ctx=c.getContext(\'2d\'),x=250,y=125,dx=2,dy=1.5,r=25,s=0;\n  c.onclick=function(e){\n    var rect=c.getBoundingClientRect(),cx=e.clientX-rect.left,cy=e.clientY-rect.top;\n    if(Math.sqrt((cx-x)*(cx-x)+(cy-y)*(cy-y))<r){s++;document.getElementById(\'score\').textContent=\'Score: \'+s;dx*=1.2;dy*=1.2}\n  };\n  function draw(){\n    if(!c.isConnected)return;\n    ctx.clearRect(0,0,c.width,c.height);\n    x+=dx;y+=dy;\n    if(x<r||x>c.width-r)dx=-dx;\n    if(y<r||y>c.height-r)dy=-dy;\n    var grad=ctx.createRadialGradient(x,y,r*0.2,x,y,r);\n    grad.addColorStop(0,\'#ff6b35\');grad.addColorStop(0.5,\'#f7c948\');grad.addColorStop(1,\'#00000000\');\n    ctx.fillStyle=grad;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();\n    ctx.fillStyle=\'#fff\';ctx.font=\'bold 18px sans-serif\';ctx.textAlign=\'center\';ctx.textBaseline=\'middle\';ctx.fillText(\'\\u266B\',x,y+1);\n    requestAnimationFrame(draw);\n  }\n  draw();\n})();\n</script>\n\n<h2 style="text-align:center;color:#63cdda;font-size:1.8rem;margin:3rem 0 1rem">Pro Tips</h2>\n<div style="max-width:600px;margin:0 auto 2rem">\n<ul style="color:#a0a0a0;font-size:1.05rem;line-height:1.8">\n  <li>Use <strong style="color:#ff6b35">HTML mode</strong> for full control, or <strong style="color:#63cdda">Rich mode</strong> for WYSIWYG editing</li>\n  <li>Upload images first with the <strong style="color:#f7c948">Img button</strong>, then copy the URL into your HTML</li>\n  <li>Ask an AI to "<em>write me a blog post for my funk band about [topic]. Use the HTML template from the blog editor. Go wild with CSS.</em>"</li>\n  <li>You can paste YouTube/Spotify embed codes directly — they\'re just iframes</li>\n  <li>Wanna go back to normal? Just remove your <code style="background:#ffffff10;color:#f7c948;padding:0.15em 0.4em;border-radius:3px">&lt;style&gt;</code> tags</li>\n  <li>Hit the <strong style="color:#ff6b35">Preview</strong> below the editor to see how it\'ll look</li>\n</ul>\n</div>\n\n<blockquote style="border-left:4px solid #ff6b35;padding-left:1.5rem;margin:2rem auto;max-width:600px;color:#888;font-style:italic;font-size:1.1rem">\n  <p>"The people who are crazy enough to think they can change the world are the ones who do."</p>\n  <footer style="margin-top:0.5rem;font-style:normal;font-size:0.9rem;color:#63cdda">&mdash; Probably about funk</footer>\n</blockquote>\n\n<p style="text-align:center;color:#888;margin-top:3rem;font-style:italic">Go make something wild. The editor is yours. &mdash; Tristan</p>\n\n</div>\n</div>',
		publishedAt: daysFromNow(-3) },
]);

console.log('Seed complete! 9 members, instrument-based availability. 5-piece = guitar+bass+drums+vocals+keys. Full band adds trumpet+sax+trombone.');
process.exit(0);
