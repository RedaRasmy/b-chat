/* eslint-disable react-refresh/only-export-components */
import {
    render,
    renderHook,
    type RenderHookOptions,
    type RenderOptions,
} from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import type { ReactNode } from "react"
import { AuthProvider } from "@/features/auth/provider"
import { UserProvider } from "@/features/auth/user-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import SocketProvider from "@/features/chats/components/socket-provider"

export function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })
}

function MainProviders({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={createTestQueryClient()}>
            <AuthProvider>
                <BrowserRouter>{children}</BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <MainProviders>
            <UserProvider>
                <SidebarProvider>
                    <SocketProvider>{children}</SocketProvider>
                </SidebarProvider>
            </UserProvider>
        </MainProviders>
    )
}

export const renderWithMain = (
    ui: React.ReactElement,
    options?: RenderOptions,
) => render(ui, { wrapper: MainProviders, ...options })

export const renderWithApp = (
    ui: React.ReactElement,
    options?: RenderOptions,
) => render(ui, { wrapper: AppProviders, ...options })

export const renderHookWithMain = <T,>(
    hook: () => T,
    options?: RenderHookOptions<unknown>,
) => renderHook(hook, { wrapper: MainProviders, ...options })

export const renderHookWithApp = <T,>(
    hook: () => T,
    options?: RenderHookOptions<unknown>,
) => renderHook(hook, { wrapper: AppProviders, ...options })

export * from "@testing-library/react"
