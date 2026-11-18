# Bethel Worship Center

Static website for [bwcny.org](https://bwcny.org). No package installation or build step is required.

## Local preview

From the repository root, run `python3 -m http.server 8000`, then open `http://localhost:8000`.

## Editing the site

- Pages are ordinary HTML in the root and the named page directories. The existing `/youth/`, `/visit/`, and `/about/` URLs remain intact. `/ministries/youth/` redirects to `/youth/` on Netlify.
- `reform.css` is the shared visual layer; `faith.css` and `guides.css` are content-focused additions. `welcome.css` contains the shared layouts, and `styles.css` supplies base and retained About-page styles.
- `app.js` handles mobile navigation, the footer year, and statement-of-faith reveals. Essential content, links, and native FAQs work without JavaScript.
- `assets/images/` contains responsive WebP photos. Originals remain in `assets/photos/`. See `PHOTO-CREDITS.md` for the stock Bible photo source.
- Fonts are self-hosted with their licenses included.
- Schedules, navigation, and footers appear on multiple pages. Keep visible times and structured data consistent.
- Increase `CACHE_VERSION` in `sw.js` and the version query on changed CSS/JS references when publishing asset changes. This avoids pairing new HTML with a previous service worker's cached design.

## Editorial visual reform (November 2026)

This PR is a **content-first visual experiment**. The shared identity uses midnight blue, warm ivory, copper, soft gold and restrained lavender. Self-hosted Cormorant Garamond display typography is paired with Inter for body copy, navigation, times and directions. The photo-led homepage retains six Life at Bethel destinations, Sunday service times, the venue and mobile gallery.

The design's depth comes from the lightweight local `assets/decor/arch-field.svg` pattern used behind selected sections, fine borders, and layered light. We deliberately **removed** the animated hero ornament, rotating Sunday seal, decorative icons on photography, parallax, global scroll reveals and gallery meter after feedback. Illustrations should help someone understand actual content, not fill empty space.

### Focus: the Statement of Faith

- `faith.css` redesigns **About → What we believe** as a readable, six-chapter reading room: a chapter index, six prominent **doctrine-specific hand-drawn inline SVGs**, concise “At a glance” summaries, full original teaching text, and Scripture references.
- The original six doctrines, order, anchors (`#creed-01` through `#creed-06`), and references are preserved. Summaries are navigation aids, not replacements for the complete statement.
- `faith-nav.js` highlights the current chapter as the visitor reads. Navigation links are native anchors; content remains fully visible when scripts are disabled. The mobile index reflows to two or three columns.
- The design avoids long auto-animated text sections; only icon hover transitions and current-location changes are used, with motion preferences respected.

### Practical visual guides

- `guides.css` adds meaningful illustrations beside the four first-visit steps, three parts of Sunday worship, Monday/Saturday Bible-study options, and prayer gatherings.
- Every illustration is an inline SVG with `aria-hidden`; it accompanies, never replaces, text.
- No fabricated events, new ministry programs, forms or claims have been introduced.

### Files and upkeep

- `reform.css`: site-wide typography, responsive layouts and photographic editorial theme.
- `faith.css`: Statement of Faith reading interface.
- `guides.css`: first-visit, worship, study and prayer comprehension aids.
- `faith-nav.js`: optional accessible active-chapter indicator.
- `assets/decor/arch-field.svg`: faint architectural background texture.
- `welcome.css` and `styles.css` remain the base layers; `app.js` still handles the mobile menu and footer year.
- Versioned CSS/JS links and the `sw.js` cache version must be kept aligned.

See `PHOTO-CREDITS.md` for image attribution.

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

Review the Netlify PR preview at 320, 390, 768, 1024 and 1440 CSS pixels, especially **About → What we believe** (chapter index, long doctrines, Scripture references), Visit (four steps/FAQ), Worship, Bible Study and Prayer. Check mobile navigation and gallery swipe, visual contrast, horizontal overflow, anchor focus/scroll offsets, reduced-motion settings and service-worker reload behavior.

Automated structural checks, HTML link checks, CSS balance and JavaScript syntax tests do not replace a browser-rendered visual or accessibility audit. This PR stays unmerged for review.

Run `python3 -m http.server 8000` from the repository root to preview locally.
