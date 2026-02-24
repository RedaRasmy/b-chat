import { expect } from "@playwright/test"
import { BasePage } from "./base.page"

export class DMPage extends BasePage {
    getMessageInput() {
        return this.page.getByLabel("message")
    }

    getSendButton() {
        return this.page.getByRole("button", { name: /send/i })
    }

    getDeleteButton() {
        return this.page.getByRole("button", { name: /delete chat/i })
    }

    getConfirmButton() {
        return this.page.getByRole("button", { name: /yes/i })
    }

    async confirm() {
        await this.getConfirmButton().click()
    }

    async typeMessage(msg: string) {
        await this.getMessageInput().fill(msg)
    }

    async sendMessage(msg: string) {
        await this.getMessageInput().fill(msg)
        await this.getSendButton().click()
        await expect(this.getMessageInput()).toHaveValue("")
        await expect(this.getBody().getByText(msg)).toBeVisible()
    }

    async expectMessage(msg: string | RegExp) {
        await expect(this.getBody().getByText(msg)).toBeVisible()
    }

    async deleteChat() {
        await this.getDeleteButton().click()
        await this.confirm()
        await expect(this.page).toHaveURL("/")
    }
}
