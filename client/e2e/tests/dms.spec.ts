import { BrowserContext, Page } from "@playwright/test"
import { test } from "../fixtures"
import { LoginPage } from "../pages/login.page"
import { ProfilePage } from "../pages/profile.page"
import { UsersPage } from "../pages/users.page"
import { DMPage } from "../pages/dm.page"

test.describe.configure({ mode: "serial" })

test.describe("DM flow", () => {
    let userAContext: BrowserContext
    let userBContext: BrowserContext
    let pageA: Page
    let pageB: Page
    let loginA: LoginPage
    let loginB: LoginPage
    let usersA: UsersPage
    let profileA: ProfilePage
    let profileB: ProfilePage
    let dmA: DMPage
    let dmB: DMPage

    test.beforeAll(async ({ browser, request }) => {
        test.setTimeout(120000)
        // reset DB
        await request.post("http://localhost:3000/api/test/seed")

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
        dmA = new DMPage(pageA)
        dmB = new DMPage(pageB)

        // log in
        await loginA.goto()
        await loginA.login("reda@example.com", "password")

        await loginB.goto()
        await loginB.login("ahmed@example.com", "password")

        // add friend
        await usersA.goto()
        await usersA.search("ahmed")
        await usersA.requestFirst()

        await profileB.gotoRequests()
        await profileB.acceptFirst()

        await profileA.goto()
        await profileB.goto()
    })

    test("user can start conversation and send message", async () => {
        await profileA.chatWithFirst()
        await dmA.sendMessage("hello")

        await dmB.gotoFirstDM()
        await dmB.expectMessage("hello")

        await dmB.sendMessage("hi")
        await dmA.expectMessage("hi")

        await userAContext.close()
        await userBContext.close()
    })
})
