import { Spinner } from "@/components/ui/spinner"

export default function LoadingPage() {
    return (
        <div className="flex h-full items-center justify-center">
            <Spinner className="text-primary size-10" />
        </div>
    )
}
