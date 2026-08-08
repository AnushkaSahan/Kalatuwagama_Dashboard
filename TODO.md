# TODO: Per-image Cover/Contain Fit (imageFit) feature

Status: Completed

## Backend

- [x] Add `imageFit` field (default "cover") to entities: Event, Monk, Teacher, TempleHistory, FoundationProject, DonationInfo, Gallery
- [x] Add `imageFit` to corresponding DTOs
- [x] Update service impls to default imageFit = "cover" when null (create + update)
- [x] Rebuild backend (`mvn clean package`) to verify compilation

## Frontend — upload components

- [x] Add Cover/Contain toggle to `ImageUploadField` (persist via onChange)
- [x] Add per-image Cover/Contain toggle to `MultiImageUploadField`
- [x] Ensure preview uses the selected fit live

## Frontend — pages wiring

- [x] Pass `imageFit` through form state in each edit/create page (Events, Gallery, MonkManagement, Teachers, TempleHistory, FoundationProjects, DonationDetails)
- [x] Submit `imageFit` in create/update payloads
- [x] Render cards using saved `imageFit` (object-cover / object-contain) across display grids

## Verification

- [x] `npm run build` passes
- [x] Backend compiles and endpoints return imageFit

## Bug fix

- [x] Remove conflicting `@Lob` annotation on `ContactMessage.message` (caused 500 on `GET /api/contact-messages`)
