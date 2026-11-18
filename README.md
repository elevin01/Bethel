# Bethel Worship Center

Static website for [bwcny.org](https://bwcny.org). No package installation or build step is required.

## Local preview

From the repository root, run `python3 -m http.server 8000`, then open `http://localhost:8000`.

## Editing the site

- Pages are ordinary HTML in the root and the named page directories. The existing `/youth/`, `/visit/`, and `/about/` URLs remain intact. `/ministries/youth/` redirects to `/youth/` on Netlify.
- `reform.css` is the current visual layer; `welcome.css` contains the shared layouts, and `styles.css` supplies base and retained About-page styles.
- `app.js` handles mobile navigation, the footer year, and statement-of-faith reveals. Essential content, links, and native FAQs work without JavaScript.
- `assets/images/` contains responsive WebP photos. Originals remain in `assets/photos/`. See `PHOTO-CREDITS.md` for the stock Bible photo source.
- Fonts are self-hosted with their licenses included.
- Schedules, navigation, and footers appear on multiple pages. Keep visible times and structured data consistent.
- Increase `CACHE_VERSION` in `sw.js` and the version query on changed CSS/JS references when publishing asset changes. This avoids pairing new HTML with a previous service worker's cached design.

## Editorial visual reform (November 2026)

The latest visual system is implemented in `reform.css`, linked after the existing styles on all 12 pages. This gives the church a focused, reversible design experiment without rewriting URLs, content, forms or page-specific behavior. The palette uses warm ivory, forest green, parchment and restrained copper. Self-hosted Cormorant Garamond display typography is paired with readable Inter navigation and body text; no external font or JavaScript dependencies are introduced.

- The homepage opens as an asymmetric editorial image composition: a clear invitation, Sunday worship times and the venue remain visible before scrolling.
- All six "Life at Bethel" links remain; their photos now form an asymmetric gallery on desktop and a snap-scrolling carousel with the next card visible on phones.
- The Sunday invitation, community image, weekly schedule, first-visit FAQs, and closing footer have distinct visual rhythms instead of repeating a default card pattern.
- Existing interior-page heroes, schedules, downloadable study resources, and visitor guidance share the typography, spacing and interaction design.
- Motion is restrained, with an optional entrance reveal and hover feedback, disabled when a visitor prefers reduced motion.
- No posed congregation group photo was reintroduced to the homepage. Action arrows remain inline SVGs, never emoji.

See `PHOTO-CREDITS.md` for image attribution; avoid unverified events or fabricated sermon placeholders.

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

## Preview and visual QA

This is a proposed design direction. Review the PR preview before merging. Check 320, 390, 768, 1024, and 1440 CSS pixel widths on the homepage and representative interior pages; specifically review image crop, gallery scrolling, mobile menu keyboard behavior, native FAQ expansion, and footer wrapping. Confirm the six gathering links, English and Malayalam times, address, downloads, and structured data remain intact. Test reduced-motion settings and reload after service worker installation.

Run `python3 -m http.server 8000` in the repository root for a local preview.
