import { type Page } from "@playwright/test"

export class ProfilePage {
    constructor(public page: Page) {}

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

    async logout() {
        await this.page.getByRole("button", { name: /log out/i }).click()
    }

    // async toggleSidebar() {
    //     await this.page.getByRole("button", { name: "" }).click()
    // }
}
