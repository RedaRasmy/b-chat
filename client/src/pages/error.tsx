import { Button } from "@/components/ui/button"
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom"

export function ErrorBoundary() {
    let error = useRouteError()
    if (isRouteErrorResponse(error)) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-2">
                <h1 className="text-2xl font-semibold">
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
                <Link to={"/"}>
                    <Button>Home Page</Button>
                </Link>
            </div>
        )
    } else if (error instanceof Error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-2">
                <h1 className="text-2xl font-semibold">
                    Oops! Something went wrong.
                </h1>
                <p>{error.name || error.message}</p>
                <Link to={"/"}>
                    <Button>Home Page</Button>
                </Link>
            </div>
        )
    } else {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-2">
                <h1 className="text-2xl font-semibold">
                    Oops! Something went wrong.
                </h1>
                <Link to={"/"}>
                    <Button>Home Page</Button>
                </Link>
            </div>
        )
    }
}
