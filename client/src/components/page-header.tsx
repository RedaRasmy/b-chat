import { SidebarTrigger } from "@/components/ui/sidebar"
import ConnectionButton from "@/features/chats/components/connection-button"
import type { ReactNode } from "react"

export default function PageHeader({ children }: { children: ReactNode }) {
    return (
        <header className="bg-sidebar h-12 flex items-center px-1 pr-3 gap-2 border-b">
            <SidebarTrigger size={"lg"} />
            <div className="flex justify-between items-center w-full">
                {children}
            </div>
            <ConnectionButton />
        </header>
    )
}
