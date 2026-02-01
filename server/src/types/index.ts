export type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

export type ToRecord<T extends readonly string[]> = Prettify<
    Record<T[number], string>
>
