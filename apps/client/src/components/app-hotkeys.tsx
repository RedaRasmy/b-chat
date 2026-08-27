import { useHotkeys } from "react-hotkeys-hook"
import { useNavigate } from "react-router-dom"

export default function AppHotkeys() {
    const navigate = useNavigate()

    useHotkeys(["a", "h", "f"], () => {
        navigate("/")
    })

    useHotkeys(["f"], () => {
        navigate("/?tab=friends")
    })

    useHotkeys(["shift+p"], () => {
        navigate("/?tab=posts")
    })

    useHotkeys(["r"], () => {
        navigate("/?tab=requests")
    })

    useHotkeys(["s"], () => {
        navigate("/?tab=settings")
    })

    useHotkeys("p", () => {
        navigate("/posts")
    })

    useHotkeys("u", () => {
        navigate("/users")
    })

    return null
}
