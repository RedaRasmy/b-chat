import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"
import NotFound from "@/pages/not-found"
import { ErrorBoundary } from "@/pages/error"
import LoadingPage from "@/pages/loading"
const ChatPage = lazy(() => import("@/pages/chat"))
const App = lazy(() => import("@/App"))
const ProfilePage = lazy(() => import("@/pages/profile"))
const LoginPage = lazy(() => import("@/pages/auth/login"))
const RegisterPage = lazy(() => import("@/pages/auth/register"))
const PostsPage = lazy(() => import("@/pages/posts"))
const UsersPage = lazy(() => import("@/pages/users"))
const AuthLayout = lazy(() => import("@/pages/auth"))

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<LoadingPage />}>
                <App />
            </Suspense>
        ),
        ErrorBoundary,
        children: [
            {
                index: true,
                element: <ProfilePage />,
            },
            {
                path: "/chats/:id",
                element: <ChatPage />,
            },
            {
                path: "/posts",
                element: <PostsPage />,
            },
            {
                path: "/users",
                element: <UsersPage />,
            },
        ],
    },
    {
        path: "/auth",
        element: (
            <Suspense fallback={<LoadingPage />}>
                <AuthLayout />
            </Suspense>
        ),
        children: [
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
])
