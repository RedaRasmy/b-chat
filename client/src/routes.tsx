import App from "@/App"
import ChatPage from "@/pages/chat"
import HomePage from "@/pages/home"
import LoginPage from "@/pages/auth/login"
import PostsPage from "@/pages/posts"
import RegisterPage from "@/pages/auth/register"
import { createBrowserRouter } from "react-router-dom"
import AuthLayout from "@/pages/auth"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "/chat/:id",
                element: <ChatPage />,
            },
            {
                path: "/posts",
                element: <PostsPage />,
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
