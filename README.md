# Bethel Worship Center

Static website for [bwcny.org](https://bwcny.org). No package installation or build step is required.

## Local preview

From the repository root, run `python3 -m http.server 8000`, then open `http://localhost:8000`.

## Editing the site

- Pages are ordinary HTML in the root and the named page directories. The existing `/youth/`, `/visit/`, and `/about/` URLs remain intact. `/ministries/youth/` redirects to `/youth/` on Netlify.
- `welcome.css` contains the shared theme and responsive layouts. `styles.css` supplies base and retained About-page styles.
- `app.js` handles mobile navigation, the footer year, and statement-of-faith reveals. Essential content, links, and native FAQs work without JavaScript.
- `assets/images/` contains responsive WebP photos. Originals remain in `assets/photos/`. See `PHOTO-CREDITS.md` for the stock Bible photo source.
- Fonts are self-hosted with their licenses included.
- Schedules, navigation, and footers appear on multiple pages. Keep visible times and structured data consistent.
- Increase `CACHE_VERSION` in `sw.js` and the version query on changed CSS/JS references when publishing asset changes. This avoids pairing new HTML with a previous service worker's cached design.

## Design direction

The homepage uses a full-width Bethel worship photo, direct sans-serif typography, Sunday times, and the lower-level venue details. Mobile uses a portrait worship photo from the same existing collection. “Life at Bethel” introduces youth and Bible study; “Life is better shared” accompanies the outdoor congregation photo. The Sunday introduction uses a heading and welcome copy in two columns, stacking on phones. The posed church-family photo is omitted from the homepage and its sharing metadata.

References studied for composition and visitor information: [Austin Stone](https://www.austinstone.org/), [Bridgetown](https://bridgetown.church/), and [VIVE](https://vivechurch.org/). All congregation imagery is from Bethel's existing source; no other church's photography is used.

Interior pages use distinct layouts: photographic openings for church life, an arrival guide for visitors, weekly schedule rows, and a study download list. Keep service information close to the relevant action and avoid adding the same generic closing section to every page.

All navigation and action arrows are inline SVGs with the shared `.w-icon` class, `aria-hidden="true"`, and `focusable="false"`. Use the forward, external-link, down, or download path that matches the destination. Do not substitute Unicode arrows: mobile platforms can render them as colorful emoji.

## Content and search

- `/bible-study/` provides the Monday online and Saturday in-person study details.
- `/online/` is the single page for the Zoom link, meeting details, and online gathering schedule; it replaces the duplicated modal markup.
- `/ministry/` links to the three real study presentations in `assets/ppt/`. Add a sermon archive only after recordings, titles, speakers, and dates are supplied. No fabricated sermon entries or placeholder players are published.
- The June 2026 convention remains clearly archived. Add future events only when dates and details are confirmed.
- Prayer and youth pages direct visitors to gatherings and pastors. Online forms require a monitored recipient and working delivery service.
- Each page has a unique title and description, an apex-domain canonical URL, sharing metadata, and JSON-LD for the church, organization, website, and page. Interior pages include breadcrumbs. Sunday worship periods match the visible schedule.
- The previous geographic coordinates were not verified for the venue and have been omitted. The full postal address, named host church, and address-based map link are provided. Add precise coordinates only after confirming the entrance location.
- Keep `sitemap.xml` synchronized with indexable pages and meaningful content changes. Local wording describes a Bronxville church serving Yonkers and Westchester; it does not imply separate campuses.
- Structured data helps describe the content. It does not guarantee a search feature or map ranking. Do not invent dated event instances to obtain event rich results.

## Zoom host follow-up

The existing meeting ID and passcode are preserved on `/online/` so visitors can still join. Website edits do **not** change Zoom account security.

The meeting host should review the recurring meeting in Zoom, enable a Waiting Room with host admission, and update its passcode if needed. After any change, supply the official invitation link and current joining instructions for `/online/`. A passcode published on a public website should not be treated as a private access control. Do not claim that a Waiting Room is active without checking the meeting settings.

Official guidance: [Zoom meeting security options](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0059862).

## Verification of this revision

The Netlify PR preview was checked in Chromium at 320, 390, 768, and 1440 CSS pixels across all 12 pages (48 layouts). No horizontal overflow, failed images, main-heading count errors, or remaining text arrows were found. All 89 action icons are SVGs hidden from screen readers. Axe WCAG A/AA checks returned no violations on the 12 pages at 390 pixels. Menu opening, Escape/focus return, native FAQ expansion, and a real PowerPoint download passed. Local links, anchors, JSON-LD parsing, sitemap XML, JavaScript syntax, and whitespace checks passed. Automated checks supplement visual inspection; they are not a complete accessibility certification.

The temporary preview review page and its test dependency are removed from the final branch contents.
