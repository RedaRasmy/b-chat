import { test as base } from "@playwright/test"
import { RegisterPage } from "./pages/register.page"
import { LoginPage } from "./pages/login.page"

export const test = base.extend<{
    register: RegisterPage
    login: LoginPage
}>({
    register: async ({ page }, set) => {
        await set(new RegisterPage(page))
    },
    login: async ({ page }, set) => {
        await set(new LoginPage(page))
    },
})

export { expect } from "@playwright/test"
