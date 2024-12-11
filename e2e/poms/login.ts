import { expect, Page } from "@playwright/test";

export default class Login{
    constructor(
        public page: Page
    ){}

    login = async({
        userName,
        email,
        password,
    }:{
        userName: string
        email: string,
        password: string,
    }): Promise<void>=>{
        await this.page.getByTestId('login-email-field').fill(email)
        await this.page.getByTestId('login-password-field').fill(password)
        await this.page.getByTestId('login-submit-button').click()
        
        await expect(this.page.getByTestId('navbar-username-label')).toHaveText(userName)
    }
}