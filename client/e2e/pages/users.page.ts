import { BasePage } from "./base.page"

export class UsersPage extends BasePage {
    async goto() {
        await this.page.goto("/users")
        await this.page.getByPlaceholder(/find users/i).waitFor()
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
        await this.page.getByRole("button", { name: /yes/i }).click()
    }

    async chatWithFirst() {
        await this.page.getByRole("button", { name: /chat/i }).first().click()
    }
}
