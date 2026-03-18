# Himalayan International School, Maner — Website

Layout and flow are inspired by large school sites (e.g. [DPS Bangalore](https://dpsbangalore.edu.in/)): hero slideshow, stats strip, about block, campus carousel, motto/vision/mission, pledge, tabbed academics, facilities, location card, leadership, admissions banner, enquiry form, gallery, notices, contact.

## Run locally

```bash
cd "/Users/arj/Desktop/Himalayan International School Maner"
python3 -m http.server 8080
```

Open http://localhost:8080

## Customize

- **Stats numbers:** Edit `data-count` on `.stat-item__num` in `index.html`.
- **Hero slides:** Add/remove `.hero-slide` blocks; update `--slide-bg` and copy.
- **Enquiry form:** Wire `action` to your backend or form service; remove demo `alert` in `index.html`.
- **Floating “Enquire now”:** `.fab-enquire` in HTML/CSS.
