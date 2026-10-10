# Bethel Worship Center

Static website for [bwcny.org](https://www.bwcny.org). No package installation or build step is required.

## Local preview

From the repository root, run `python3 -m http.server 8000`, then open `http://localhost:8000`.

## Editing the site

- Pages are ordinary HTML in the root and the named page directories.
- `welcome.css` contains the shared welcoming theme and responsive layouts. `styles.css` supplies base and retained About-page styles.
- `app.js` handles the mobile menu, accessible Zoom dialog, footer year, and About-page reveals.
- `assets/images/` contains responsive WebP photos. Original congregation photos remain in `assets/photos/`. See `PHOTO-CREDITS.md` for the stock photo source.
- Fonts are self-hosted in `assets/fonts/`, with their licenses included.
- The schedule, navigation, and footer appear on multiple pages. Keep times and links consistent when editing them.
- Increase `CACHE_VERSION` in `sw.js` when publishing asset changes so returning visitors receive the new assets.

## Content and connections

The Resources page links to the three study presentations that exist in `assets/ppt/`. The June 2026 convention is archived on the Events page. Add future events only when dates and details are confirmed.

Prayer and youth pages direct visitors to the existing gatherings and pastors. They do not collect submissions: a monitored recipient and working delivery service must be configured before adding online forms. The prior demo submission handlers and sample sermon links have been removed.

The Zoom dialog uses the meeting ID and passcode previously published on the site. If these change, update the shared dialog markup on every page.

## Refresh verification

Browser checks cover all 10 pages at 320, 390, 768, and 1440 CSS pixels, including overflow, images, fonts, local anchors, and page headings. Mobile navigation, Escape handling, the Zoom dialog, native FAQs, and a real presentation download were exercised. Automated accessibility checks supplement visual review; they are not a complete accessibility certification.
