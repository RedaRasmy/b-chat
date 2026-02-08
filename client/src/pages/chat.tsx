import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { useParams } from "react-router-dom"

export default function ChatPage() {
    const params = useParams()
    const id = params.id!

    return (
        <div className="w-full h-screen grid grid-rows-[auto_1fr_auto]">
            <PageHeader>
                <h1>Chat:{id}</h1>
                <Button>btn</Button>
            </PageHeader>
            <main className="p-3 space-y-2 overflow-y-auto"></main>
            <footer className="bg-accent h-12 border-t"></footer>
        </div>
    )
}
