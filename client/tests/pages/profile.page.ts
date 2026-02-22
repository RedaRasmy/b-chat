import { type Page } from "@playwright/test"
import { BasePage } from "./base.page"

export class ProfilePage extends BasePage {
    async goto() {
        await this.page.goto("/")
    }

    async gotoFriends() {
        await this.page.goto("/?tab=friends")
    }
    async gotoMyPosts() {
        await this.page.goto("/?tab=posts")
    }
    async gotoRequests() {
        await this.page.goto("/?tab=requests")
    }
    async gotoSettings() {
        await this.page.goto("/?tab=settings")
    }

    async fillName(name: string) {
        await this.page.getByLabel("Name").fill(name)
    }

    async updateProfile() {
        await this.page.getByRole("button", { name: /submit/i }).click()
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
        await this.page.getByRole("button", { name: /yes/i }).click()
    }

    async chatWithFirst() {
        await this.page.getByRole("button", { name: /chat/i }).first().click()
    }

    async logout() {
        await this.page.getByRole("button", { name: /log out/i }).click()
    }
}
