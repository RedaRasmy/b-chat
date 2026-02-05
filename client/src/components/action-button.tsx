import { type ComponentProps, type ReactNode } from "react"
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
import { useMutation } from "@tanstack/react-query"

export function ActionButton({
    action,
    requireAreYouSure = false,
    areYouSureDescription = "This action cannot be undone.",
    ...props
}: ComponentProps<typeof Button> & {
    action: () => Promise<unknown>
    requireAreYouSure?: boolean
    areYouSureDescription?: ReactNode
}) {
    const mutation = useMutation({
        mutationFn: action,
    })

    function submit() {
        mutation.mutate()
    }

    if (requireAreYouSure) {
        return (
            <AlertDialog
                open={mutation.isIdle || mutation.isPending ? true : undefined}
            >
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
                            disabled={mutation.isPending}
                            onClick={submit}
                        >
                            <LoadingSwap isLoading={mutation.isPending}>
                                Yes
                            </LoadingSwap>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    return (
        <Button
            {...props}
            disabled={props.disabled ?? mutation.isPending}
            onClick={(e) => {
                submit()
                props.onClick?.(e)
            }}
        >
            <LoadingSwap
                isLoading={mutation.isPending}
                className="inline-flex items-center gap-2"
            >
                {props.children}
            </LoadingSwap>
        </Button>
    )
}
