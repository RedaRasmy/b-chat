import { isToday, isYesterday, isThisWeek, format } from "date-fns"

export function getTime(date: Date | string | number) {
    if (isToday(date)) {
        return format(date, "HH:mm")
    }

    if (isYesterday(date)) {
        return "Yesterday"
    }

    if (isThisWeek(date, { weekStartsOn: 1 })) {
        return format(date, "EEEE")
    }

    return format(date, "d/M/yyyy") // "12/1/2026"
}
