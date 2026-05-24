# Landing Platform Requirements Plan

This file tracks the 13 requirement groups from `Update.md`. It should stay factual: a requirement is marked complete only when the code path, CMS workflow, and build verification are in place.

## Current Status

| Section | Requirement Group | Status | Notes |
|---|---|---:|---|
| 1 | Full architecture rebuild | Mostly Done | Monorepo, typed API, service layer, MySQL schema, and admin/public split are in place. Production observability and migration discipline still need real environment validation. |
| 2 | Dynamic landing-page system | Done | Project slug routing, subdomain resolution, dynamic project payloads, developer payloads, campaign sections, media, SEO, and lead forms are wired. Project `developerId` now validates and persists. |
| 3 | UI/UX complete redesign | Mostly Done | Premium landing sections, Lenis scrolling, motion, sticky lead capture, and responsive layouts exist. Needs final visual QA on real project media and devices. |
| 4 | Landing page content structure | Done | Current order: hero/form, conversion highlights, details/amenities, payment, gallery/video, location, campaign sections, developer, final contact. |
| 5 | Video section rebuild | Mostly Done | Lazy thumbnail-first modal exists with provider support. Needs browser QA against production YouTube/Facebook/Drive URLs. |
| 6 | Payment plan system | Done | Admin-editable plans persist through project save and render as dynamic cards. |
| 7 | Admin dashboard rebuild | Mostly Done | Projects, leads, media, amenities, developers, and dashboard pages exist with structured workflows. Some UX polish and deeper validation can still improve reliability. |
| 8 | Media management system | Mostly Done | Upload, generated variants, metadata editing, categories, attachment controls, sort ordering, delete cleanup, and copy URL are implemented. Drag/drop is represented by ordering controls; full drag/drop can be added later. |
| 9 | Facilities and amenities system | Done | Central amenities library supports generated slugs, icon names, categories, descriptions, active state, and project assignment. |
| 10 | Multi-developer system | Mostly Done | Developer CRUD, logo URL/upload, branding, contact data, social fields, SEO fields, and project connection are wired. Slug renaming remains intentionally conservative. |
| 11 | CRM and lead management | Mostly Done | Storage, statuses, notes, project/campaign/date/search filters, pagination, filtered authenticated CSV export, attribution, and stats are implemented. Deeper campaign analytics dashboards remain future work. |
| 12 | SEO and performance | Mostly Done | Dynamic metadata, OG, canonical URLs, sitemap, robots, JSON-LD product/developer/FAQ data, upload variants, lazy video, and reduced-motion Lenis fallback are implemented. Needs final production canonical/subdomain QA. |
| 13 | Deployment and production | Partial | Docker, env examples, upload config, rate limiting, and checklist docs exist. Needs real server verification for wildcard DNS, upload permissions, TLS, backups, monitoring, and storage strategy. |

## Completed In Latest Implementation Pass

- Added `developerId` validation and project create/update persistence.
- Fixed amenity creation so the API generates slugs when the admin UI sends only name/icon/category/description.
- Added active/inactive amenity management in the admin page.
- Added authenticated filtered CSV export from the leads page.
- Added project, campaign, date, status, and search filters to admin leads.
- Added lead notes editing inside the expanded lead row.
- Added media metadata editing for title, alt text, category, and project attachment.
- Added bulk upload options for selected project, developer, and category.
- Added media sort persistence and generated-file cleanup on delete.
- Added `originalUrl`, `webpUrl`, `thumbnailUrl`, `mediumUrl`, and `size` to media storage contracts.
- Added `UPLOADS_DIR` support for API static serving and image optimization.
- Added basic rate limiting for auth and lead submission routes.
- Removed sensitive startup logging of raw DB/CORS config details.
- Added reduced-motion handling for global Lenis smooth scrolling.
- Expanded JSON-LD with developer, project offer, and FAQ data.

## Remaining Work Before Calling It Production-Ready

- Run browser QA for admin project editing, lead export, media upload/delete, and mobile sticky lead capture.
- Verify canonical behavior on root domain, slug routes, and real project subdomains.
- Test media migration on an existing database using `db/media_asset_metadata_migration.sql`.
- Validate upload folder permissions and backup policy on the production server.
- Add monitoring/log aggregation and a production health-check endpoint strategy.
- Add deeper campaign analytics dashboards beyond current stats and filters.
