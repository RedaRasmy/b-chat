// e2e/friendship.spec.ts
import { test, expect } from "./fixtures"
import { LoginPage } from "./pages/login.page"
import { ProfilePage } from "./pages/profile.page"
import { UsersPage } from "./pages/users.page"

test.describe("Friendship flow", () => {
    test("user can send and accept friend request", async ({ browser }) => {
        // Setup

        const userAContext = await browser.newContext()
        const userBContext = await browser.newContext()

        const pageA = await userAContext.newPage()
        const pageB = await userBContext.newPage()

        const loginA = new LoginPage(pageA)
        const loginB = new LoginPage(pageB)
        const usersA = new UsersPage(pageA)
        const profileA = new ProfilePage(pageA)
        const profileB = new ProfilePage(pageB)

        // Log in

        await loginA.goto()
        await loginA.login("reda@example.com", "password")
        await expect(pageA).toHaveURL("/")

        await loginB.goto()
        await loginB.login("ahmed@example.com", "password")
        await expect(pageB).toHaveURL("/")

        // Send request : A -> B

        await usersA.goto()
        await usersA.search("ahmed")
        await usersA.requestFirst()

        // Accept request

        await profileB.gotoRequests()
        await profileB.acceptFirst()

        // Both users see each other in friends list

        await profileA.gotoFriends()
        await expect(pageA.getByText("ahmed")).toBeVisible()

        await profileB.gotoFriends()
        await expect(pageB.getByText("reda")).toBeVisible()

        await userAContext.close()
        await userBContext.close()
    })
})
