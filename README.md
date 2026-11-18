# Bethel Worship Center

Static website for [bwcny.org](https://bwcny.org). No package installation or build step is required.

## Local preview

From the repository root, run `python3 -m http.server 8000`, then open `http://localhost:8000`.

## Editing the site

- Pages are ordinary HTML in the root and the named page directories. The existing `/youth/`, `/visit/`, and `/about/` URLs remain intact. `/ministries/youth/` redirects to `/youth/` on Netlify.
- `reform.css` is the shared visual layer; `faith.css` and `guides.css` author the narrative and practical layouts. `welcome.css` and `styles.css` supply the established structural base.
- `app.js` handles mobile navigation and the footer year. Essential content, chapter links and native FAQs work without JavaScript.
- `assets/images/` contains responsive WebP photos. Originals remain in `assets/photos/`. See `PHOTO-CREDITS.md` for the stock Bible photo source.
- Fonts are self-hosted with their licenses included.
- Schedules, navigation, and footers appear on multiple pages. Keep visible times and structured data consistent.
- Increase `CACHE_VERSION` in `sw.js` and the version query on changed CSS/JS references when publishing asset changes. This avoids pairing new HTML with a previous service worker's cached design.

## Design direction — visual storytelling with purpose (November 2026)

This is an art-directed website for a real local congregation, not a dashboard or a generic SaaS landing page. The identity blends deep navy, copper, warm paper and muted lilac, with original Bethel photography and a restrained architectural etching as the recurring backdrop. Display headings use the existing self-hosted Cormorant Garamond; information uses Inter. No third-party animation or font library is loaded.

**References studied for design decisions:** [Bridgetown Church / Belief](https://bridgetown.church/belief) for editorial faith long-form, [Church of the City NYC / Beliefs](https://church.nyc/beliefs) for meaningful doctrinal visual explanation, and [BibleProject](https://bibleproject.com/about/) for subject-led Christian illustration and a clear hierarchy. This website creates its own original visuals and keeps its own theology; it is not a copy of the referenced sites.

### Statement of Faith as an illustrated publication

- `/about/#faith` is six full-width editorial chapters rather than six identical dashboard-style cards. Alternating compositions, contrasting chapter atmospheres and original art plates give each teaching room to breathe.
- The opening spread acts as a cover and contents page, with direct anchor links to every doctrine. Each chapter has its actual teaching (unchanged), Scripture references (unchanged), a concise thematic subheading and a link to the next chapter.
- Original SVG art lives in `assets/faith/01-scripture.svg` through `06-holiness.svg`. The plates interpret Scripture, water and the Spirit, the Trinity, the cross and resurrection, repentance, and spiritual growth. They are large illustration compositions rather than icon badges.
- Readability is prioritized over tricks. Nothing hides behind an accordion, on-scroll JavaScript or hover effect. The responsive design rearranges the art and teaching into a comfortable single column on phones. Reduced-motion preferences are respected.
- All six original doctrine headings, nine original teaching paragraphs and six reference lists must remain verbatim, including the existing anchors `#creed-01` through `#creed-06`.

### The rest of the content

- `/visit/`: a four-step wayfinding sequence with spacious number/heading/body hierarchy rather than four illustrated cards.
- `/worship/`: an open three-part description of worship, Scripture and prayer.
- `/bible-study/` and `/prayer/`: purpose-built schedule layouts that emphasize when, what and how to join.
- `/ministry/`: study slides organized as an editorial downloadable archive, with filenames and files unchanged.
- `/events/`: real photographs and confirmed weekly events remain central; archived 2026 convention remains correctly dated.
- Homepage photo composition, six Life at Bethel destinations, service times and venue details remain; avoid adding unrelated ornaments or posed group-photo hero imagery.

### Implementation

- `reform.css`: typography, color, background etching and shared composition.
- `faith.css`: wholly distinct long-form beliefs chapters.
- `guides.css`: purposeful layouts for actual information on Visit, Worship, Prayer, Bible Study, Events and Resources.
- `assets/decor/arch-field.svg`: lightweight, low-opacity atmospheric texture.
- `assets/faith/*.svg`: six custom illustrations, locally hosted; no image search downloads or external dependency.
- `welcome.css` and `styles.css` remain the pre-existing base. `app.js` continues to handle navigation and footer year.
- The global animation script, faith-nav script, decorative hero drawing, rotating seal and little icon badges were intentionally removed. Interactions are limited to deliberate hover feedback and native anchor navigation.

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

Use the Netlify preview from PR #3. Most important: view `/about/#faith` at 320, 390, 768, 1024 and 1440 CSS px. Check image cropping / legibility, alternating chapter order, native anchor scrolling, reading width and the 6 chapter references. Check `/visit/`, `/worship/`, `/bible-study/`, `/prayer/`, `/events/` and `/ministry/` for content spacing and actual links. Confirm the existing site header/menu, service times, mobile gallery, FAQ, resources and address remain usable.

Static HTML checks and CSS parsing are not substitutes for a browser-rendered accessibility/visual audit. No such browser audit is claimed in this iteration.

Run `python3 -m http.server 8000` in the repository root to preview locally.
