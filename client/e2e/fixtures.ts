import { test as base } from "@playwright/test"
import { RegisterPage } from "./pages/register.page"
import { LoginPage } from "./pages/login.page"
import { ProfilePage } from "./pages/profile.page"
import { UsersPage } from "./pages/users.page"
import { DMPage } from "./pages/dm.page"

export const test = base.extend<{
    register: RegisterPage
    login: LoginPage
    profile: ProfilePage
    users: UsersPage
    dm: DMPage
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
    users: async ({ page }, set) => {
        await set(new UsersPage(page))
    },
    dm: async ({ page }, set) => {
        await set(new DMPage(page))
    },
})

export { expect } from "@playwright/test"
