import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export default function LoadingPage({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "flex h-screen items-center justify-center",
                className,
            )}
        >
            <Spinner className="text-primary size-10" />
        </div>
    )
}
