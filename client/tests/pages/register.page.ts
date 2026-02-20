import { type Page } from "@playwright/test"

export class RegisterPage {
    constructor(private page: Page) {}

    async goto() {
        await this.page.goto("/auth/register")
    }

    async fillName(name: string) {
        await this.page.getByLabel("Name").fill(name)
    }

    async fillEmail(email: string) {
        await this.page.getByLabel("Email").fill(email)
    }

    async fillPassword(password: string) {
        await this.page.getByLabel("Password", { exact: true }).fill(password)
    }

    async fillConfirmPassword(password: string) {
        await this.page.getByLabel("Confirm Password").fill(password)
    }

    async submit() {
        await this.page.getByRole("button", { name: /create account/i }).click()
    }

    async registerUser(
        data = {
            name: "reda",
            email: "reda@example.com",
            password: "password",
        },
    ) {
        await this.fillName(data.name)
        await this.fillEmail(data.email)
        await this.fillPassword(data.password)
        await this.fillConfirmPassword(data.password)
        await this.submit()
    }
}
