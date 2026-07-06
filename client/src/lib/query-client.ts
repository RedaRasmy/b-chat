import { QueryClient } from "@tanstack/react-query"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
        },
    },
})

export const persister = createAsyncStoragePersister({
    storage: window.localStorage,
})
