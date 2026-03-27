# Registration Fix Progress

**Status:** Plan Approved & Implementing

## Steps:
- [x] Understand files (index.html, server.js, DB)
- [x] Create this TODO.md
- [ ] Refactor server.js /api/register to async/await + Promise DB queries
- [ ] Add detailed logging
- [ ] Restart server (`pkill -f 'node server.js' && npm start`)
- [ ] Test registration (student + teacher)
- [ ] Verify users in DB
- [ ] Update TODO.md
- [ ] Complete task

**Current Issue:** 400 Bad Request on /api/register - likely validation failure. Server logs needed for exact error.

**Next:** Edit server.js
