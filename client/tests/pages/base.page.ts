import { expect, Page } from "@playwright/test"

export class BasePage {
    constructor(public page: Page) {}

    async toggleSidebar() {
        await this.page.getByRole("button", { name: /toggle sidebar/i }).click()
    }

    async gotoProfile() {
        await this.page.getByRole("button", { name: /profile/i }).click()
        await expect(this.page).toHaveURL("/")
    }

    async gotoPosts() {
        await this.page
            .getByRole("button", { name: /posts/i, exact: true })
            .click()
        await expect(this.page).toHaveURL("/posts")
    }

    async gotoUsers() {
        await this.page.getByRole("button", { name: /users/i }).click()
        await expect(this.page).toHaveURL("/users")
    }
}
