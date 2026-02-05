import { type ComponentProps, type ReactNode, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LoadingSwap } from "@/components/loading-swap"

export function ActionButton({
    action,
    requireAreYouSure = false,
    areYouSureDescription = "This action cannot be undone.",
    ...props
}: ComponentProps<typeof Button> & {
    action: () => unknown
    requireAreYouSure?: boolean
    areYouSureDescription?: ReactNode
}) {
    const [isLoading, startTransition] = useTransition()

    function performAction() {
        startTransition(() => {
            action()
        })
    }

    if (requireAreYouSure) {
        return (
            <AlertDialog open={isLoading ? true : undefined}>
                <AlertDialogTrigger
                    render={<Button {...props} />}
                ></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {areYouSureDescription}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isLoading}
                            onClick={performAction}
                            variant={"destructive"}
                        >
                            <LoadingSwap isLoading={isLoading}>Yes</LoadingSwap>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    return (
        <Button
            {...props}
            disabled={props.disabled ?? isLoading}
            onClick={(e) => {
                performAction()
                props.onClick?.(e)
            }}
        >
            <LoadingSwap
                isLoading={isLoading}
                className="inline-flex items-center gap-2"
            >
                {props.children}
            </LoadingSwap>
        </Button>
    )
}
