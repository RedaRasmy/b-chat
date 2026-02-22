// e2e/friendship.spec.ts
import { BrowserContext, Page } from "@playwright/test"
import { test, expect } from "./fixtures"
import { LoginPage } from "./pages/login.page"
import { ProfilePage } from "./pages/profile.page"
import { UsersPage } from "./pages/users.page"

// test.beforeEach(async ({ request }) => {
//     await request.post("http://localhost:5173/api/test/seed")
// })
test.describe.configure({ mode: "serial" })

test.describe("Friendship flow", () => {
    let userAContext: BrowserContext
    let userBContext: BrowserContext
    let pageA: Page
    let pageB: Page
    let loginA: LoginPage
    let loginB: LoginPage
    let usersA: UsersPage
    let profileA: ProfilePage
    let profileB: ProfilePage

    test.beforeEach(async ({ browser, request }) => {
        // reset DB
        await request.post("http://localhost:5173/api/test/seed")

        // setup
        userAContext = await browser.newContext()
        userBContext = await browser.newContext()
        pageA = await userAContext.newPage()
        pageB = await userBContext.newPage()

        loginA = new LoginPage(pageA)
        loginB = new LoginPage(pageB)
        usersA = new UsersPage(pageA)
        profileA = new ProfilePage(pageA)
        profileB = new ProfilePage(pageB)

        // log in
        await loginA.goto()
        await loginA.login("reda@example.com", "password")

        await loginB.goto()
        await loginB.login("ahmed@example.com", "password")
    })

    test("user can send and accept friend request", async () => {
        await usersA.goto()
        await usersA.search("ahmed")
        await usersA.requestFirst()

        await profileB.gotoRequests()
        await profileB.acceptFirst()

        await profileA.gotoFriends()
        await expect(pageA.getByText("ahmed")).toBeVisible()

        await profileB.gotoFriends()
        await expect(pageB.getByText("reda")).toBeVisible()

        await userAContext.close()
        await userBContext.close()
    })
    test("user can reject friend request", async () => {
        await usersA.goto()
        await usersA.search("ahmed")
        await usersA.requestFirst()

        await profileB.gotoRequests()
        await profileB.rejectFirst()

        await expect(pageB.getByText("reda")).not.toBeVisible()

        await profileB.gotoFriends()
        await expect(pageB.getByText("reda")).not.toBeVisible()
    })

    test("user can remove friend", async () => {
        await usersA.goto()
        await usersA.search("ahmed")
        await usersA.requestFirst()
        await profileB.gotoRequests()
        await profileB.acceptFirst()

        await profileA.gotoFriends()
        await profileA.unfriendFirst()
        await expect(pageA.getByText("ahmed")).not.toBeVisible()

        await profileB.gotoFriends()
        await expect(pageB.getByText("reda")).not.toBeVisible()
    })
})
