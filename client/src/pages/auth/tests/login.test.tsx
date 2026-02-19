import LoginPage from "@/pages/auth/login"
import { server } from "@/test/mocks/server"
import { renderWithMain, screen, waitFor } from "@/test/utils"
import type { LoginCredentials } from "@bchat/types"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"

async function fillForm(
    {
        email = "reda@example.com",
        password = "Password123!",
    }: Partial<LoginCredentials> = {
        email: "reda@example.com",
        password: "Password123!",
    },
) {
    const user = userEvent.setup()

    await user.type(screen.getByLabelText("Email"), email)
    await user.type(screen.getByLabelText("Password"), password)

    return user
}

describe("LoginPage", () => {
    describe("rendering", () => {
        it("renders all form fields", () => {
            renderWithMain(<LoginPage />)

            expect(screen.getByLabelText("Email")).toBeInTheDocument()
            expect(screen.getByLabelText("Password")).toBeInTheDocument()

            expect(
                screen.getByRole("button", { name: /sign in/i }),
            ).toBeInTheDocument()
        })

        it("renders oauth buttons", () => {
            renderWithMain(<LoginPage />)

            expect(
                screen.getByRole("button", { name: /google/i }),
            ).toBeInTheDocument()
            expect(
                screen.getByRole("button", { name: /github/i }),
            ).toBeInTheDocument()
        })

        it("renders sign up link", () => {
            renderWithMain(<LoginPage />)

            expect(
                screen.getByRole("button", { name: /sign up/i }),
            ).toBeInTheDocument()
        })

        it("password field is hidden by default", () => {
            renderWithMain(<LoginPage />)

            expect(screen.getByLabelText("Password")).toHaveAttribute(
                "type",
                "password",
            )
        })
    })

    describe("password visibility toggle", () => {
        it("toggles password visibility", async () => {
            const user = userEvent.setup()
            renderWithMain(<LoginPage />)

            const passwordInput = screen.getByLabelText("Password")
            const toggleButton = screen.getByRole("button", { name: "" })

            expect(passwordInput).toHaveAttribute("type", "password")
            await user.click(toggleButton)
            expect(passwordInput).toHaveAttribute("type", "text")
            await user.click(toggleButton)
            expect(passwordInput).toHaveAttribute("type", "password")
        })
    })

    describe("validation", () => {
        it("shows error when submitting empty form", async () => {
            const user = userEvent.setup()
            renderWithMain(<LoginPage />)

            await user.click(screen.getByRole("button", { name: /sign in/i }))

            expect(
                await screen.findByText(/email is required/i),
            ).toBeInTheDocument()
            expect(
                await screen.findByText(/password is required/i),
            ).toBeInTheDocument()
        })

        it("shows error for invalid email", async () => {
            const user = userEvent.setup()
            renderWithMain(<LoginPage />)

            expect(screen.getByLabelText("Email")).toHaveAttribute(
                "type",
                "email",
            )

            await user.click(
                screen.getByRole("button", { name: /sign in/i }),
            )

            await user.type(screen.getByLabelText("Email"), "notanemail")

            expect(
                await screen.findByText(/invalid email/i),
            ).toBeInTheDocument()
        })

        it("shows error for weak password", async () => {
            renderWithMain(<LoginPage />)

            await fillForm({ password: "123" })
            const user = userEvent.setup()
            await user.click(
                screen.getByRole("button", { name: /sign in/i }),
            )

            expect(
                await screen.findByText(/password must be at least/i),
            ).toBeInTheDocument()
        })
    })

    describe("form submission", () => {
        it("disables submit button while submitting", async () => {
            server.use(
                http.post("/api/auth/login", async () => {
                    await new Promise((resolve) => setTimeout(resolve, 100))
                    return HttpResponse.json({ message: "ok" })
                }),
            )

            renderWithMain(<LoginPage />)
            await fillForm()

            const user = userEvent.setup()
            await user.click(
                screen.getByRole("button", { name: /sign in/i }),
            )

            expect(
                screen.getByRole("button", { name: /sign in/i }),
            ).toBeDisabled()
        })

        it("shows server error message on failed login", async () => {
            server.use(
                http.post("/api/auth/login", () =>
                    HttpResponse.json(
                        { message: "Invalid credentials" },
                        { status: 400 },
                    ),
                ),
            )

            renderWithMain(<LoginPage />)
            await fillForm()

            const user = userEvent.setup()
            await user.click(
                screen.getByRole("button", { name: /sign in/i }),
            )

            expect(
                await screen.findByText(/invalid credentials/i),
            ).toBeInTheDocument()
        })

        it("redirects after successful login", async () => {
            renderWithMain(<LoginPage />)
            await fillForm()

            const user = userEvent.setup()
            await user.click(
                screen.getByRole("button", { name: /sign in/i }),
            )

            await waitFor(() => {
                expect(window.location.pathname).toBe("/")
            })
        })
    })
})
