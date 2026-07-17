import {
    type ComponentProps,
    type ReactElement,
    type ReactNode,
    useState,
    useTransition,
} from "react"
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
import { useTranslation } from "react-i18next"

export function ActionButton({
    action,
    requireAreYouSure = false,
    areYouSureDescription,
    triggerElement,
    ...props
}: ComponentProps<typeof Button> & {
    action: () => unknown
    requireAreYouSure?: boolean
    areYouSureDescription?: ReactNode
    triggerElement?: ReactElement
}) {
    const [open, setOpen] = useState(false)
    const [isLoading, startTransition] = useTransition()

    function performAction() {
        startTransition(() => {
            action()
        })
        setOpen(false)
    }

    const { t } = useTranslation()

    const description =
        areYouSureDescription ?? t("confirmation.defaultDescription")

    if (requireAreYouSure) {
        return (
            <AlertDialog open={open || isLoading} onOpenChange={setOpen}>
                <AlertDialogTrigger
                    render={triggerElement}
                ></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t("confirmation.title")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t("buttons.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isLoading}
                            onClick={performAction}
                            variant={"destructive"}
                        >
                            <LoadingSwap isLoading={isLoading}>
                                {t("buttons.yes")}
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
