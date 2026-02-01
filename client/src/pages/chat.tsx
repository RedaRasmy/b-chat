import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useParams } from "react-router-dom"

export default function ChatPage() {
    const params = useParams()
    const id = params.id!

    return (
        <div className="w-full h-screen flex flex-col ">
            <header className="bg-accent h-12 flex items-center px-3 gap-3">
                <SidebarTrigger size={"lg"} />
                <div className="flex justify-between w-full">
                    <h1>Chat:{id}</h1>
                    <Button>btn</Button>
                </div>
            </header>
            <main className="flex-1"></main>
            <footer className="bg-accent h-12"></footer>
        </div>
    )
}
