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

const langs = [
    { label: "English", value: "en" },
    { label: "Français", value: "fr" },
]

export default function LangSelector({ className }: { className?: string }) {
    const { t, i18n } = useTranslation("profile")
    return (
        <Select
            items={langs}
            value={i18n.language ?? "en"}
            id="select-lang"
            onValueChange={(lang) => {
                i18n.changeLanguage(lang ?? "en")
            }}
        >
            <SelectTrigger className={cn("w-full max-w-48", className)}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{t("preferences.language.label")}</SelectLabel>
                    {langs.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
