import { createBrowserRouter } from "react-router-dom"
import { lazy } from "react"
import App from "@/App"
const ChatPage = lazy(() => import("@/pages/chat"))
const ProfilePage = lazy(() => import("@/pages/profile"))
const LoginPage = lazy(() => import("@/pages/auth/login"))
const RegisterPage = lazy(() => import("@/pages/auth/register"))
const PostsPage = lazy(() => import("@/pages/posts"))
const UsersPage = lazy(() => import("@/pages/users"))
const AuthLayout = lazy(() => import("@/pages/auth"))

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
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
        element: <AuthLayout />,
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
])
