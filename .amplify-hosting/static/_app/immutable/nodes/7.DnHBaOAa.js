import{A as e,C as t,D as n,G as r,J as i,K as a,N as o,R as s,S as c,T as l,U as u,W as d,Y as f,b as p,c as m,d as h,et as g,it as _,j as v,l as y,o as b,q as x,rt as S,s as C,tt as w,w as T,x as E}from"../chunks/Cqs9FcHY.js";import"../chunks/xihTtKlq.js";import{t as D}from"../chunks/D6AzP5fq.js";import{n as O,t as k}from"../chunks/BLDSjXwz.js";var A=n(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Post created successfully!</p>`),j=n(`<p class="mb-6 rounded-lg border border-green-700 bg-green-900/20 p-3 text-sm text-green-400">Post archived.</p>`),M=n(`<div class="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"><div class="min-w-0 flex-1"><a target="_blank" class="font-medium text-amber-400 hover:underline"> </a> <p class="text-xs text-zinc-400"> </p></div> <div class="flex items-center gap-2 shrink-0 ml-3"><a class="rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-400 hover:border-zinc-500">Edit</a></div></div>`),N=n(`<h2 class="mb-3 text-sm font-medium text-yellow-400">Drafts</h2> <div class="mb-6 space-y-2"></div> <hr class="mb-6 border-zinc-800"/>`,1),P=n(`<p class="text-zinc-500">No posts yet. Create your first one!</p>`),F=n(`<div class="flex items-center justify-between rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-3"><div class="min-w-0 flex-1"><span class="text-sm text-zinc-500"> </span> <span class="ml-2 text-xs text-zinc-600"> </span></div> <form method="POST" action="?/unarchive"><input type="hidden" name="id"/> <button type="submit" class="text-xs text-amber-400 hover:underline">Restore</button></form></div>`),I=n(`<div class="mt-10"><h2 class="mb-3 text-sm font-medium text-zinc-500">Archived Posts</h2> <div class="space-y-2"></div></div>`),L=n(`<div class="mb-8"><button class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400">New Post</button></div> <details class="mb-8 rounded-lg border border-zinc-800 bg-zinc-900"><summary class="flex cursor-pointer items-center justify-between p-4"><span class="text-sm font-medium text-zinc-400">Blog post HTML template</span> <button type="button" class="rounded bg-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"> </button></summary> <pre class="max-h-64 overflow-auto bg-zinc-950 px-4 pb-4 text-xs text-zinc-400"><code></code></pre> <p class="px-4 pb-4 text-xs text-zinc-600">Copy this template, fill it in with your content, then paste the result into the blog editor.</p></details>  <!> <h2 class="mb-3 text-sm font-medium text-green-400">Published</h2> <div class="space-y-2"><!> <!></div> <!>`,1),R=n(`<p class="text-sm text-red-400"> </p>`),z=n(`<div class="mt-8 overflow-hidden border-y border-zinc-700" style="width:100vw;position:relative;left:50%;right:50%;margin-left:-50vw;margin-right:-50vw"><div class="border-b border-zinc-800 bg-zinc-950 px-4 py-1.5 text-xs text-zinc-500"><div class="flex items-center justify-between"><span class="text-amber-400 font-bold">Preview</span> <span> </span></div></div> <div class="border-b border-zinc-800 bg-zinc-950/90 px-4 py-4"><div class="mx-auto flex max-w-6xl items-center justify-between"><span class="font-display text-xl tracking-tight text-amber-400">FLYING FUNK</span> <div class="hidden gap-6 text-sm font-semibold text-zinc-400 sm:flex"><span>Home</span><span>Book Us</span><span>Blog</span><span>Music</span><span>Login</span></div> <span class="text-xl text-zinc-400 sm:hidden">☰</span></div></div> <div class="bg-zinc-950 pb-8"><div class="prose prose-invert prose-amber max-w-none"></div></div></div>`),B=n(`<form method="POST" action="?/create" class="space-y-4"><div><label for="title" class="mb-1 block text-sm text-zinc-400">Title</label> <input type="text" id="title" name="title" required="" class="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 focus:border-amber-500 focus:outline-none"/></div> <div><label for="slug" class="mb-1 block text-sm text-zinc-400">Page Address</label> <div class="flex items-center gap-0 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3"><span class="text-sm text-zinc-600">flyingfunk.com/blog/</span> <input type="text" id="slug" name="slug" class="min-w-0 flex-1 bg-transparent font-mono text-sm text-zinc-400 focus:outline-none"/></div> <p class="mt-1 text-xs text-zinc-600">This becomes the web address for your blog post. Update the title to regenerate it, or type your own.</p></div> <div><label for="content" class="mb-1 block text-sm text-zinc-400">Content</label> <!> <div class="mt-4"><!> <input type="hidden" name="content"/></div></div> <div class="flex items-center gap-2"><input type="checkbox" id="published" name="published" class="accent-amber-500"/> <label for="published" class="text-sm text-zinc-400">Publish immediately</label></div> <!> <div class="flex gap-3"><button type="submit" class="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400">Save Post</button> <button type="button" class="rounded-lg border border-zinc-700 px-6 py-3 text-sm transition-colors hover:border-zinc-500">Cancel</button></div></form> <!>`,1),V=n(`<h1 class="mb-8 text-3xl font-bold text-amber-400">Blog Posts</h1> <!> <!> <!>`,1);function H(e,n){w(n,!0);let H=i(!1),U=i(``),W=i(``),G=i(!1),K=i(``),q=i(!1);i(!1);let J=i(a([])),ee=f(()=>k(o(K),o(J))),Y=i(!1);async function X(){await navigator.clipboard.writeText(te),x(Y,!0),setTimeout(()=>x(Y,!1),2e3)}let te=`<div class="mx-auto max-w-3xl">

<h2>Your Catchy Title Here</h2>

<p>Start with an engaging opening paragraph that hooks the reader.
What's this post about?</p>

<img src="./images/your-image.jpg" alt="Description" style="max-width:100%;border-radius:8px" />

<blockquote>
  <p>A memorable quote from your bandmate.</p>
</blockquote>

<h3>Section Heading</h3>

<p>Dive deeper. Tell a story about a gig, rehearsal, or gear you love.</p>

<ul>
  <li><strong>Bullet points</strong> for lists</li>
  <li>Like your top 5 albums or favorite venues</li>
</ul>

<hr />

<p><em>Thanks for reading! Come see us at our next show.</em></p>

</div>`;function ne(){x(H,!0),x(U,``),x(W,``),x(G,!1),x(K,``),x(q,!1)}function re(){o(G)||(o(U)?x(W,o(U).toLowerCase().replace(/'/g,``).replace(/[^a-z0-9]+/g,`-`).replace(/^-|-$/g,``),!0):x(W,``))}var Z=V(),Q=r(d(Z),2),ie=e=>{l(e,A())};t(Q,e=>{n.form?.createSuccess&&e(ie)});var $=r(Q,2),ae=e=>{l(e,j())};t($,e=>{n.form?.archiveSuccess&&e(ae)});var oe=r($,2),se=e=>{let i=f(()=>n.data.posts.filter(e=>!e.publishedAt)),a=f(()=>n.data.posts.filter(e=>e.publishedAt));var p=L(),g=d(p),b=u(g);_(g);var x=r(g,2),C=u(x),w=r(u(C),2),D=u(w,!0);_(w),_(C);var O=r(C,2),k=u(O);k.textContent=`<div class="mx-auto max-w-3xl">

<h2>Your Catchy Title Here</h2>

<p>Start with an engaging opening paragraph that hooks the reader.
What's this post about?</p>

<img src="./images/your-image.jpg" alt="Description" style="max-width:100%;border-radius:8px" />

<blockquote>
  <p>A memorable quote from your bandmate.</p>
</blockquote>

<h3>Section Heading</h3>

<p>Dive deeper. Tell a story about a gig, rehearsal, or gear you love.</p>

<ul>
  <li><strong>Bullet points</strong> for lists</li>
  <li>Like your top 5 albums or favorite venues</li>
</ul>

<hr />

<p><em>Thanks for reading! Come see us at our next show.</em></p>

</div>`,_(O),S(2),_(x);var A=r(x,2),j=e=>{var t=N(),n=r(d(t),2);E(n,21,()=>o(i),c,(e,t)=>{var n=M(),i=u(n),a=u(i),c=u(a,!0);_(a);var d=r(a,2),f=u(d);_(d),_(i);var p=r(i,2),m=u(p);_(p),_(n),s(()=>{y(a,`href`,`/blog/`+o(t).slug),T(c,o(t).title||`(Untitled)`),T(f,`${o(t).authorName??``} ·
							${o(t).publishedAt?`Published `+o(t).publishedAt:`Draft`}`),y(m,`href`,`/admin/blog/`+o(t).id)}),l(e,n)}),_(n),S(2),l(e,t)};t(A,e=>{o(i).length>0&&e(j)});var R=r(A,4),z=u(R);E(z,17,()=>o(a),c,(e,t)=>{var n=M(),i=u(n),a=u(i),c=u(a,!0);_(a);var d=r(a,2),f=u(d);_(d),_(i);var p=r(i,2),m=u(p);_(p),_(n),s(()=>{y(a,`href`,`/blog/`+o(t).slug),T(c,o(t).title||`(Untitled)`),T(f,`${o(t).authorName??``} ·
						${o(t).publishedAt?`Published `+o(t).publishedAt:`Draft`}`),y(m,`href`,`/admin/blog/`+o(t).id)}),l(e,n)});var B=r(z,2),V=e=>{l(e,P())};t(B,e=>{o(a).length===0&&o(i).length===0&&e(V)}),_(R);var H=r(R,2),U=e=>{var t=I(),i=r(u(t),2);E(i,21,()=>n.data.archivedPosts,c,(e,t)=>{var n=F(),i=u(n),a=u(i),c=u(a,!0);_(a);var d=r(a,2),f=u(d,!0);_(d),_(i);var p=r(i,2),g=u(p);m(g),S(2),_(p),_(n),s(()=>{T(c,o(t).title||`(Untitled)`),T(f,o(t).authorName),h(g,o(t).id)}),l(e,n)}),_(i),_(t),l(e,t)};t(H,e=>{n.data.archivedPosts.length>0&&e(U)}),s(()=>T(D,o(Y)?`Copied!`:`Copy`)),v(`click`,b,ne),v(`click`,w,e=>{e.preventDefault(),X()}),l(e,p)},ce=e=>{var i=B(),a=d(i),c=u(a),f=r(u(c),2);m(f),_(c);var g=r(c,2),y=r(u(g),2),w=r(u(y),2);m(w),_(y),S(2),_(g);var E=r(g,2),k=r(u(E),2);O(k,{scope:`blog-new`,onImagesChanged:e=>x(J,e,!0)});var A=r(k,2),j=u(A);D(j,{get content(){return o(K)},onUpdate:e=>x(K,e,!0),get galleryImages(){return o(J)},placeholder:`Write your post...`});var M=r(j,2);m(M),_(A),_(E);var N=r(E,2),P=u(N);m(P),S(2),_(N);var F=r(N,2),I=e=>{var t=R(),r=u(t,!0);_(t),s(()=>T(r,n.form.createError)),l(e,t)};t(F,e=>{n.form?.createError&&e(I)});var L=r(F,2),V=r(u(L),2);_(L),_(a);var Y=r(a,2),X=e=>{var t=z(),n=u(t),i=u(n),a=r(u(i),2),c=u(a,!0);_(a),_(i),_(n);var d=r(n,4),f=u(d);p(f,()=>o(ee),!0),_(f),_(d),_(t),s(()=>T(c,o(W)?`flyingfunk.com/blog/`+o(W):`flyingfunk.com/blog/...`)),l(e,t)};t(Y,e=>{o(K)&&e(X)}),s(()=>h(M,o(K))),v(`keydown`,a,e=>{e.key===`Enter`&&!(e.target instanceof HTMLTextAreaElement)&&e.preventDefault()}),v(`input`,f,re),C(f,()=>o(U),e=>x(U,e)),v(`input`,w,()=>x(G,!0)),C(w,()=>o(W),e=>x(W,e)),b(P,()=>o(q),e=>x(q,e)),v(`click`,V,()=>x(H,!1)),l(e,i)};t(oe,e=>{o(H)?e(ce,-1):e(se)}),l(e,Z),g()}e([`click`,`keydown`,`input`]);export{H as component};