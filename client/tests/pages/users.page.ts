import { type Page } from "@playwright/test"

export class UsersPage {
    constructor(public page: Page) {}

    async goto() {
        await this.page.goto("/users")
    }

    async search(name: string) {
        await this.page.getByPlaceholder(/find users/i).fill(name)
    }

    async requestFirst() {
        await this.page
            .getByRole("button", { name: /add friend/i })
            .first()
            .click()
    }

    async cancelFirst() {
        await this.page
            .getByRole("button", { name: /pending/i })
            .first()
            .click()
    }

    async acceptFirst() {
        await this.page
            .getByRole("button", { name: /accept/i })
            .first()
            .click()
    }

    async rejectFirst() {
        await this.page
            .getByRole("button", { name: /reject/i })
            .first()
            .click()
    }

    async unfriendFirst() {
        await this.page
            .getByRole("button", { name: /unfriend/i })
            .first()
            .click()
    }

    async chatWithFirst() {
        await this.page.getByRole("button", { name: /chat/i }).first().click()
    }

    async toggleSidebar() {
        await this.page.getByRole("button", { name: /toggle sidebar/i }).click()
    }
}
