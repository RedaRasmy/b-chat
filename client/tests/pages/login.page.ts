import { type Page } from '@playwright/test'

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/auth/login')
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email)
    await this.page.getByLabel('Password').fill(password)
    await this.page.getByRole('button', { name: /sign in/i }).click()
  }
}