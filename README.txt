YMH City - hosting package (v8)

1. Upload every file in this folder to one folder on your web server. Keep the names unchanged.
2. Open index.html in a browser. Everything runs in the browser; there's nothing to install.

Adding your own videos (Confab 2025 film, YMH Week highlights)
- Put the .mp4 file in this same folder, e.g. confab2025.mp4.
- In config.js, find the "videos" list and set src: 'confab2025.mp4' for that entry. You can also set poster: 'confab-poster.jpg' to show a still image before playback.
- Use H.264 video with AAC audio in an .mp4 file, under about 100 MB.
- Theatre videos play on the cinema screen. The "hall" video plays on the YMH Week screen.

Links in the YMH Hut and the (i) About panel
- config.js -> links: website, instagram, email, volunteer, whatsapp.
- The volunteer form and WhatsApp community links are already filled in. Leave a link blank to show "Link coming soon".

Analytics on your own site
- config.js -> ga4: your Google Analytics 4 ID, or endpoint: a URL that receives JSON events.
- The player counter and policy wall in the Claude version use Claude's shared database. They only work in the published Claude artifact; on your own site, use ga4 or endpoint instead.
