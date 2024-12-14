import { Page } from "@playwright/test";
import { test } from "../../fixtures";
import Login from "../../poms/login";
import { STORAGE_STATE } from "../../../playwright.config";
import { COMMON_TEXTS } from "../../constants/texts";

test.describe('User login', ()=>{
    test('should login user successfully', async({page, loginPage}: {page: Page, loginPage: Login})=>{
        await test.step("Step 1: Visit login page", async()=> page.goto("/"))
        await test.step("Step 2: Login and verify admin user", () =>
            loginPage.login({
              email: process.env.ADMIN_EMAIL!,
              password: process.env.ADMIN_PASSWORD!,
              userName: COMMON_TEXTS.defaultUserName,
            })
          );
        await page.context().storageState({path:STORAGE_STATE})
    })
})