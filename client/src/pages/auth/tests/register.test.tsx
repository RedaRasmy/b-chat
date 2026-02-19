import RegisterPage from "@/pages/auth/register"
import { server } from "@/test/mocks/server"
import { renderWithMain, screen, waitFor } from "@/test/utils"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"

async function fillForm({
    name = "reda",
    email = "reda@example.com",
    password = "Password123!",
    confirmPassword = "Password123!",
} = {}) {
    const user = userEvent.setup()

    await user.type(screen.getByLabelText("Name"), name)
    await user.type(screen.getByLabelText("Email"), email)
    await user.type(screen.getByLabelText("Password"), password)
    await user.type(screen.getByLabelText("Confirm Password"), confirmPassword)

    return user
}

describe("RegisterPage", () => {
    describe("rendering", () => {
        it("renders all form fields", () => {
            renderWithMain(<RegisterPage />)

            expect(screen.getByLabelText("Name")).toBeInTheDocument()
            expect(screen.getByLabelText("Email")).toBeInTheDocument()
            expect(screen.getByLabelText("Password")).toBeInTheDocument()
            expect(
                screen.getByLabelText("Confirm Password"),
            ).toBeInTheDocument()
            expect(
                screen.getByRole("button", { name: /create account/i }),
            ).toBeInTheDocument()
        })

        it("renders oauth buttons", () => {
            renderWithMain(<RegisterPage />)

            expect(
                screen.getByRole("button", { name: /google/i }),
            ).toBeInTheDocument()
            expect(
                screen.getByRole("button", { name: /github/i }),
            ).toBeInTheDocument()
        })

        it("renders sign in link", () => {
            renderWithMain(<RegisterPage />)

            expect(
                screen.getByRole("link", { name: /back to home/i }),
            ).toBeInTheDocument()
            expect(
                screen.getByRole("button", { name: /sign in/i }),
            ).toBeInTheDocument()
        })

        it("password fields are hidden by default", () => {
            renderWithMain(<RegisterPage />)

            expect(screen.getByLabelText("Password")).toHaveAttribute(
                "type",
                "password",
            )
            expect(screen.getByLabelText("Confirm Password")).toHaveAttribute(
                "type",
                "password",
            )
        })
    })

    describe("password visibility toggle", () => {
        it("toggles password visibility", async () => {
            const user = userEvent.setup()
            renderWithMain(<RegisterPage />)

            const passwordInput = screen.getByLabelText("Password")
            const toggleButtons = screen.getAllByRole("button", { name: "" })

            expect(passwordInput).toHaveAttribute("type", "password")
            await user.click(toggleButtons[0])
            expect(passwordInput).toHaveAttribute("type", "text")
            await user.click(toggleButtons[0])
            expect(passwordInput).toHaveAttribute("type", "password")
        })
    })

    describe("validation", () => {
        it("shows error when submitting empty form", async () => {
            const user = userEvent.setup()
            renderWithMain(<RegisterPage />)

            await user.click(
                screen.getByRole("button", { name: /create account/i }),
            )

            expect(
                await screen.findByText(/name is required/i),
            ).toBeInTheDocument()
            expect(
                await screen.findByText(/email is required/i),
            ).toBeInTheDocument()
            expect(
                await screen.findByText(/password is required/i),
            ).toBeInTheDocument()
        })

        it("shows error for invalid email", async () => {
            const user = userEvent.setup()
            renderWithMain(<RegisterPage />)

            expect(screen.getByLabelText("Email")).toHaveAttribute("type","email")

            await user.click(
                screen.getByRole("button", { name: /create account/i }),
            )

            await user.type(screen.getByLabelText("Email"), "notanemail")

            expect(
                await screen.findByText(/invalid email/i),
            ).toBeInTheDocument()
        })

        it("shows error when passwords don't match", async () => {
            renderWithMain(<RegisterPage />)

            await fillForm({ confirmPassword: "DifferentPassword" })
            const user = userEvent.setup()
            await user.click(
                screen.getByRole("button", { name: /create account/i }),
            )

            expect(
                await screen.findByText(/passwords don't match/i),
            ).toBeInTheDocument()
        })

        it("shows error for weak password", async () => {
            renderWithMain(<RegisterPage />)

            await fillForm({ password: "123", confirmPassword: "123" })
            const user = userEvent.setup()
            await user.click(
                screen.getByRole("button", { name: /create account/i }),
            )

            expect(
                await screen.findByText(/password must be at least/i),
            ).toBeInTheDocument()
        })
    })

    describe("form submission", () => {
        it("disables submit button while submitting", async () => {
            server.use(
                http.post("/api/auth/register", async () => {
                    await new Promise((resolve) => setTimeout(resolve, 100))
                    return HttpResponse.json({ message: "ok" })
                }),
            )

            renderWithMain(<RegisterPage />)
            await fillForm()

            const user = userEvent.setup()
            await user.click(
                screen.getByRole("button", { name: /create account/i }),
            )

            expect(
                screen.getByRole("button", { name: /create account/i }),
            ).toBeDisabled()
        })

        it("shows server error message on failed registration", async () => {
            server.use(
                http.post("/api/auth/register", () =>
                    HttpResponse.json(
                        { message: "Email already in use" },
                        { status: 409 },
                    ),
                ),
            )

            renderWithMain(<RegisterPage />)
            await fillForm()

            const user = userEvent.setup()
            await user.click(
                screen.getByRole("button", { name: /create account/i }),
            )

            expect(
                await screen.findByText(/email already in use/i),
            ).toBeInTheDocument()
        })

        it("redirects after successful registration", async () => {
            renderWithMain(<RegisterPage />)
            await fillForm()

            const user = userEvent.setup()
            await user.click(
                screen.getByRole("button", { name: /create account/i }),
            )

            await waitFor(() => {
                expect(window.location.pathname).toBe("/")
            })
        })
    })
})
