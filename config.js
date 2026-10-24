/* =========================================================
   YMH City · settings for hosting
   When you move the city to the YMH website, fill these in
   to measure visits and engagement. Leave blank to switch off.
   ========================================================= */
window.YMH_CONFIG = {
  /* Google Analytics 4 Measurement ID, e.g. 'G-ABC123XYZ'.
     Every event is sent as "ymh_<event>" with an "id" (the place
     or activity) and flags for returning visitors. */
  ga4: '',
  /* Optional: your own collector URL. Each event is POSTed as JSON
     with navigator.sendBeacon: {event, id, district, visitor,
     visit, returning, first_time_for_visitor, t}. */
  endpoint: '',
  /* Links shown in the YMH Hut and the (i) About panel.
     Leave a link blank and its button says "Link coming soon". */
  links: {
    website: 'https://www.youthformentalhealth.org',
    instagram: 'https://www.instagram.com/youthformentalheallth',
    email: 'communications@youthformentalhealth.org',
    volunteer: 'https://forms.gle/6U2YubSSmPP1tiUa7',
    whatsapp: 'https://chat.whatsapp.com/GSPQIFGwSr24hAlkwHGgH8'
  },
  /* Videos that play inside the city (Theatre, YMH Week hall).
     Put the .mp4 next to index.html (or any https URL that allows
     playback) and fill in src. Leave src empty to hide a video. */
  videos: [
    { id: 'confab2025', title: 'Confab 2025', desc: 'The YMH Confab 2025 film', src: '', poster: '', where: 'theatre' },
    { id: 'ymhweek2026', title: 'YMH Week 2026 highlights', desc: 'A look back at last year', src: '', poster: '', where: 'hall' }
  ]
};
