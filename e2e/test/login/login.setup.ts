import { Page } from "@playwright/test";
import { test } from "../../fixtures";
import Login from "../../poms/login";
import { STORAGE_STATE } from "../../../playwright.config";

test.describe('User login', ()=>{
    test('should login user successfully', async({page, loginPage}: {page: Page, loginPage: Login})=>{
        await page.goto('/login')
        await loginPage.login({
           email: "oliver@example.com",
           password: "welcome",
           userName: "Oliver Smith"
        })
        await page.context().storageState({path:STORAGE_STATE})
    })
})