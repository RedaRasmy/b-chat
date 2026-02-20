import { test, expect } from "@playwright/test"
import { RegisterPage } from "./pages/register.page"
import { LoginPage } from "./pages/login.page"

test.describe("Auth flow", () => {
    test("user can register and gets redirected", async ({ page }) => {
        const registerPage = new RegisterPage(page)
        await registerPage.goto()

        await registerPage.registerUser({
            name: "test",
            email: `test+${Date.now()}@example.com`,
            password: "password",
        })

        await expect(page).toHaveURL("/")
        await expect(page.getByText("Profile").first()).toBeVisible()
    })

    test("user can login after registering", async ({ page }) => {
        const name = "test-login"
        const email = `test+${Date.now()}@example.com`
        const password = "Password123!"

        // register first
        const registerPage = new RegisterPage(page)
        await registerPage.goto()
        await registerPage.registerUser({ name, email, password })

        // log out
        await page.getByRole("button", { name: /log out/i }).click()

        // log in
        const loginPage = new LoginPage(page)
        await loginPage.goto()
        await loginPage.login(email, password)

        await expect(page).toHaveURL("/")
        await page.getByText(/settings/i).click()
        await expect(page.getByLabel("Name")).toHaveValue(name)
    })

    test("cannot access app when not authenticated", async ({ page }) => {
        await page.goto("/")

        await expect(page).toHaveURL("/auth/login")
    })

    test("duplicate email shows error", async ({ page }) => {
        const email = "test@gmail.com"

        const registerPage = new RegisterPage(page)
        await registerPage.goto()
        await registerPage.registerUser({
            name: "Jane",
            email,
            password: "Password123!",
        })

        await expect(page.getByText(/email already in use/i)).toBeVisible()
    })
})
