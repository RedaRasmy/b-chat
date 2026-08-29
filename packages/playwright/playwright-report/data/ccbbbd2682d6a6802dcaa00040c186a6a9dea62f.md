# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth flow >> user can register and gets redirected
- Location: tests/auth.spec.ts:5:9

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:5173/auth/register", waiting until "load"

```

# Page snapshot

```yaml
- article [ref=e3]:
  - generic [ref=e6]:
    - heading "Unable to connect" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - text: Nightly can’t connect to the server at
      - strong [ref=e9]: localhost:5173
    - generic [ref=e10]:
      - heading "What can you do about it?" [level=3] [ref=e11]
      - list [ref=e12]:
        - listitem [ref=e13]: The site could be temporarily unavailable or too busy. Try again in a few moments.
        - listitem [ref=e14]: If you are unable to load any pages, check your computer’s network connection.
        - listitem [ref=e15]: If your computer or network is protected by a firewall or proxy, make sure that Nightly is permitted to access the web.
    - button "Try Again" [ref=e18]
```

# Test source

```ts
  1  | import { type Page } from "@playwright/test"
  2  | 
  3  | export class RegisterPage {
  4  |     constructor(public page: Page) {}
  5  | 
  6  |     async goto() {
> 7  |         await this.page.goto("/auth/register")
     |                         ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  8  |     }
  9  | 
  10 |     async fillName(name: string) {
  11 |         await this.page.getByLabel("Name").fill(name)
  12 |     }
  13 | 
  14 |     async fillEmail(email: string) {
  15 |         await this.page.getByLabel("Email").fill(email)
  16 |     }
  17 | 
  18 |     async fillPassword(password: string) {
  19 |         await this.page.getByLabel("Password", { exact: true }).fill(password)
  20 |     }
  21 | 
  22 |     async fillConfirmPassword(password: string) {
  23 |         await this.page.getByLabel("Confirm Password").fill(password)
  24 |     }
  25 | 
  26 |     async submit() {
  27 |         await this.page.getByRole("button", { name: /create account/i }).click()
  28 |     }
  29 | 
  30 |     async registerUser(
  31 |         data = {
  32 |             name: "reda",
  33 |             email: "reda@example.com",
  34 |             password: "password",
  35 |         },
  36 |     ) {
  37 |         await this.fillName(data.name)
  38 |         await this.fillEmail(data.email)
  39 |         await this.fillPassword(data.password)
  40 |         await this.fillConfirmPassword(data.password)
  41 |         await this.submit()
  42 |     }
  43 | }
  44 | 
```