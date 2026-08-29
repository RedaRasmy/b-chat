# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dms.spec.ts >> DM flow >> user can start conversation and send message
- Location: tests/dms.spec.ts:61:9

# Error details

```
Error: apiRequestContext.post: connect ECONNREFUSED ::1:3000
Call log:
  - → POST http://localhost:3000/api/test/seed
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:153.0) Gecko/20100101 Firefox/153.0
    - accept: */*
    - accept-encoding: gzip,deflate,br

```