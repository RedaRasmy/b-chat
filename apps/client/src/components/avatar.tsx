import { cn } from "@/lib/utils"
import type { OtherUser, Prettify, UserStatus } from "@bchat/types"

export default function Avatar({
    data,
    className,
}: {
    data:
        | Prettify<OtherUser & Partial<Pick<UserStatus, "status">>>
        | {
              id: string
              avatar?: string | null
              name: string
          }
    className?: string
}) {
    if (data.avatar)
        return (
            <div
                className={cn(
                    "size-8 relative border-black/90 borde shrink-0",
                    className,
                )}
            >
                <img src={data.avatar} className="rounded-full" />
                {"status" in data && (
                    <div
                        className={cn(
                            "size-[30%] bg-red-500 absolute bottom-0 right-0 rounded-full",
                            {
                                "bg-green-500": data.status === "online",
                            },
                        )}
                    />
                )}
            </div>
        )

    const colors = [
        "lightblue",
        "crimson",
        "lightsalmon",
        "aquamarine",
        "lavender",
        "yellow",
        "cyan",
        "gold",
        "lime",
        "aqua",
    ]

    const index = data.id.charCodeAt(4) % 10

    const color = colors[index]

    const character = data.name.charAt(0)

    return (
        <div
            className={cn(
                "size-8 rounded-full shrink-0 relative border-black/30 border flex items-center justify-center text-xl uppercase",
                className,
            )}
            style={{
                backgroundColor: color,
            }}
        >
            {character}
            {"status" in data && data.status && (
                <div
                    className={cn(
                        "size-[30%] bg-red-500 absolute bottom-0 right-0 rounded-full",
                        {
                            "bg-green-500": data.status === "online",
                        },
                    )}
                />
            )}
        </div>
    )
}
