import { expect, Page } from "@playwright/test";
import { LOGIN_SELECTORS, NAVBAR_SELECTORS } from "../constants/selectors";

interface LoginPageProps {
    email: string;
    password: string;
    userName: string;
}

export default class Login{
    constructor(
        private page: Page
    ){}

    login = async({
        userName,
        email,
        password,
    }:LoginPageProps): Promise<void>=>{
        await this.page.getByTestId(LOGIN_SELECTORS.emailField).fill(email)
        await this.page.getByTestId(LOGIN_SELECTORS.passwordField).fill(password)
        await this.page.getByTestId(LOGIN_SELECTORS.loginButton).click()
        
        await expect(this.page.getByTestId(NAVBAR_SELECTORS.usernameLabel)).toHaveText(userName)
        await expect(this.page.getByTestId(NAVBAR_SELECTORS.logoutButton)).toBeVisible()
    }
}