import { test as base } from "@playwright/test"
import { RegisterPage } from "./pages/register.page"
import { LoginPage } from "./pages/login.page"
import { ProfilePage } from "./pages/profile.page"

export const test = base.extend<{
    register: RegisterPage
    login: LoginPage
    profile: ProfilePage
}>({
    register: async ({ page }, set) => {
        await set(new RegisterPage(page))
    },
    login: async ({ page }, set) => {
        await set(new LoginPage(page))
    },
    profile: async ({ page }, set) => {
        await set(new ProfilePage(page))
    },
})

export { expect } from "@playwright/test"
