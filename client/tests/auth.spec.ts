import { test, expect } from "./fixtures"

test.describe("Auth flow", () => {
    test("user can register and gets redirected", async ({ register }) => {
        await register.goto()

        await register.registerUser({
            name: "test",
            email: `test+${Date.now()}@example.com`,
            password: "password",
        })

        await expect(register.page).toHaveURL("/")
        await expect(register.page.getByText("Profile").first()).toBeVisible()
    })

    test("user can login after registering", async ({ register, login }) => {
        const name = "test-login"
        const email = `test+${Date.now()}@example.com`
        const password = "Password123!"

        // register first
        await register.goto()
        await register.registerUser({ name, email, password })

        // log out
        await register.page.getByRole("button", { name: /log out/i }).click()

        // log in
        await login.goto()
        await login.login(email, password)

        await expect(login.page).toHaveURL("/")
        await login.page.getByText(/settings/i).click()
        await expect(login.page.getByLabel("Name")).toHaveValue(name)
    })

    test("cannot access app when not authenticated", async ({ page }) => {
        await page.goto("/")

        await expect(page).toHaveURL("/auth/login")
    })

    test("duplicate email shows error", async ({ register }) => {
        const email = "omar@example.com"

        await register.goto()
        await register.registerUser({
            name: "any",
            email,
            password: "Password123!",
        })

        await expect(
            register.page.getByText(/email already in use/i),
        ).toBeVisible()
    })
})
