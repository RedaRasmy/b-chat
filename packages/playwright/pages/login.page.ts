import { type Page } from "@playwright/test"

export class LoginPage {
    constructor(public page: Page) {}

    async goto() {
        await this.page.goto("/auth/login")
    }

    async login(email: string, password: string) {
        await this.page.getByLabel("Email").fill(email)
        await this.page.getByLabel("Password").fill(password)
        await Promise.all([
            this.page.waitForURL("/"),
            this.page.getByRole("button", { name: /sign in/i }).click(),
        ])
        await this.page.getByRole("button", { name: /log out/i }).waitFor()
    }
}
