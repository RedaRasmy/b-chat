import type { ReactNode } from "react"

export default function Notification({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center justify-center gap-2 text-muted-foreground bg-accent px-4 py-1 rounded-xl">
            {children}
        </div>
    )
}
