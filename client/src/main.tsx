import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import "./index.css"
import { router } from "@/routes.tsx"
import { AuthProvider } from "@/features/auth/provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import SocketProvider from "@/chats/components/socket-provider"

const client = new QueryClient()

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={client}>
        <AuthProvider>
            <SocketProvider>
                <RouterProvider router={router} />
            </SocketProvider>
        </AuthProvider>
    </QueryClientProvider>,
)
