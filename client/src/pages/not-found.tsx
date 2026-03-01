import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen flex-col gap-2">
            <h1 className="text-3xl font-semibold">Page not found</h1>
            <Link to={"/"}>
                <Button>Home Page</Button>
            </Link>
        </div>
    )
}
