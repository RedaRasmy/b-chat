import { Page } from "@playwright/test"
import { BasePage } from "./base.page"

export class DMPage extends BasePage {
    async sendMessage(msg: string) {
        // await this.page.
    }

    async deleteChat() {}
}
