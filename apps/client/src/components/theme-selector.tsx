import { useTheme, type Theme } from "@/components/theme-provider"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

const themes = ["light", "dark"]

export default function ThemeSelector({ className }: { className?: string }) {
    const { setTheme, theme } = useTheme()
    const { t } = useTranslation("profile")
    return (
        <Select
            value={t(`preferences.theme.${theme}`)}
            id="select-theme"
            onValueChange={(theme) => {
                if (theme) setTheme(theme as Theme)
            }}
        >
            <SelectTrigger className={cn("w-full max-w-48", className)}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{t("preferences.theme.label")}</SelectLabel>
                    {themes.map((theme) => (
                        <SelectItem key={theme} value={theme}>
                            {t(`preferences.theme.${theme}`)}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
