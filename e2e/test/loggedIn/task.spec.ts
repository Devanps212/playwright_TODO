import { Browser, expect, Page, TestInfo } from "@playwright/test";
import { test } from "../../fixtures";
import TaskPage from "../../poms/tasks";
import { faker } from "@faker-js/faker";
import Login from "../../poms/login";

test.describe('Task Page', ()=>{

    let taskName : string;

    test.beforeEach('should generate a task', async({page, task}: {page: Page, task: TaskPage}, testInfo:TestInfo)=>{
        taskName = faker.word.words({count: 5})

        if (testInfo.title.includes("[SKIP_SETUP]")) return;

        await page.goto('/')
        await task.addTask({taskName})
    })

    test.afterEach(async({page, task}: {page: Page, task: TaskPage})=>{
        page.goto('/')
        await task.completeTask({taskName})
        const completedTask = page
        .getByTestId("tasks-completed-table")
        .getByRole("row", { name: taskName })

        await completedTask.
        getByTestId("completed-task-delete-link")
        .click()

        await expect(completedTask).toBeHidden()
        await expect(page
            .getByTestId("tasks-pending-table")
            .getByRole("row", { name: taskName }))
            .toBeHidden()
    })

    test('should add a task', async({task}: {task:TaskPage})=>{
    })

    test('should complete a task', async({task}: {task:TaskPage})=>{
        await task.completeTask({taskName})
    })

    test('should delete a comlpeted task', async({task}: {task:TaskPage})=>{
        await task.completeTask({taskName})
        await task.deleteTask({taskName})
    })

    test('should star a task', async({page, task}: {page: Page, task:TaskPage})=>{
        await task.addStar({taskName})
        const starIcon = page.getByTestId("tasks-pending-table")
        .getByRole('row', { name: taskName })
        .getByTestId('pending-task-star-or-unstar-link')
        await starIcon.click();
        await expect(starIcon).toHaveClass(/ri-star-line/)
    })

    test('should create a new task with a different user as the assignee', async({
            task, 
            browser
        }: { 
            task: TaskPage, 
            browser: Browser
        })=>{
        await task.addTask({taskName, userName:'Sam Smith'})

        const newUserContext = await browser.newContext({
            storageState: {cookies:[], origins:[]}
        })

        const newPage = await newUserContext.newPage()

        const loginPage = new Login(newPage)

        newPage.goto('/')

        await loginPage.login({email:'sam@example.com', password:'welcome', userName:'Sam Smith'})
        await expect(newPage.getByTestId('tasks-pending-table')
        .getByRole('row', { name: taskName })).toBeVisible()

        await newPage.close()
        await newUserContext.close()
    })
})