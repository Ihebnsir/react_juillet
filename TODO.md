# TODO - SkillBridge preloader

- [ ] Review current preloader logic: ensure it shows on app start/refresh and NOT on route navigation.
- [ ] Update preloader singleton to key off session (or remove localStorage persistence) to match refresh behavior.
- [ ] Ensure preloader stays visible ~2s and fades out smoothly, without impacting existing app functionality.
- [ ] Improve premium look: verify CSS for logo/spinner responsiveness + accessibility (reduced motion, aria, contrast).
- [ ] Update React components/CSS only where necessary.
- [ ] Run tests/build to confirm no runtime errors.
- [ ] Provide summary of modified files.
