import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import "./index.css"
import { router } from "@/routes.tsx"
import { AuthProvider } from "@/features/auth/provider"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { persister, queryClient } from "@/lib/query-client"

createRoot(document.getElementById("root")!).render(
    <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
            persister,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        }}
    >
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </PersistQueryClientProvider>,
)
