import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import "./index.css"
import { router } from "@/routes.tsx"
import { AuthProvider } from "@/features/auth/provider"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { persister, queryClient } from "@/lib/query-client"
import "@/lib/i18n"
import i18n from "i18next"
import { TooltipProvider } from "@/components/ui/tooltip"

const updateHtmlAttributes = (lng: string) => {
    const dir = i18n.dir(lng)
    document.documentElement.dir = dir
    document.documentElement.lang = lng
}

updateHtmlAttributes(i18n.language)

i18n.on("languageChanged", (lng) => {
    updateHtmlAttributes(lng)
})

createRoot(document.getElementById("root")!).render(
    <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
            persister,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            dehydrateOptions: {
                shouldDehydrateQuery: () => false,
            },
        }}
    >
        <AuthProvider>
            <TooltipProvider>
                <RouterProvider router={router} />
            </TooltipProvider>
        </AuthProvider>
    </PersistQueryClientProvider>,
)
