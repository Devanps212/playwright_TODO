import { Browser, BrowserContext, expect, Locator, Page, TestInfo } from "@playwright/test";
import { test } from "../../fixtures";
import TaskPage from "../../poms/tasks";
import { faker } from "@faker-js/faker";
import Login from "../../poms/login";
import CommentsPage from "../../poms/comments";
import { COMMON_TEXTS, DASHBOARD_TEXTS } from "../../constants/texts";
import { TASKS_TABLE_SELECTORS, NAVBAR_SELECTORS, COMMENT_SELECTORS } from "../../constants/selectors";

test.describe('Task Page', ()=>{

    let taskName : string;

    test.beforeEach('should generate a task and add that task', async({
        page, 
        task
    }:{
        page: Page, 
        task: TaskPage}, 
        testInfo:TestInfo
    )=>{
        taskName = faker.word.words({count: 5})
        if (testInfo.title.includes(COMMON_TEXTS.skipSetup)) return;

        await page.goto('/')
        await task.addTask({taskName})
    })

    test.afterEach(async({
        page, 
        task,
    }: {
        page: Page, 
        task: TaskPage,
    }, testInfo: TestInfo
    )=>{
        if (testInfo.title.includes(COMMON_TEXTS.skipAfter)) return;
        await page.goto('/')
        await task.completeTask({taskName})
        const completedTask = page
        .getByTestId(TASKS_TABLE_SELECTORS.completedTasksTable)
        .getByRole("row", { name: taskName })

        await completedTask.
        getByTestId(TASKS_TABLE_SELECTORS.deleteTaskButton)
        .click()

        await expect(completedTask).toBeHidden()
        await expect(page
            .getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable)
            .getByRole("row", { name: taskName }))
            .toBeHidden()
    })

    test('should add a task', async({task}: {task:TaskPage})=>{
    })

    test(`should complete a task ${COMMON_TEXTS.skipAfter}`, async({task}: {task:TaskPage})=>{
        await task.completeTask({taskName})
    })

    test(`should delete a comlpeted task ${COMMON_TEXTS.skipAfter}`, async({task}: {task:TaskPage})=>{
        await task.completeTask({taskName})
        await task.deleteTask({taskName})
    })

    test('should star a task', async({
        page, 
        task
    }: {
        page: Page, 
        task:TaskPage
    })=>{
        await task.addStar({taskName})
        const starIcon = page.getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable)
        .getByRole('row', { name: taskName })
        .getByTestId(TASKS_TABLE_SELECTORS.starUnstarButton)
        await starIcon.click();
        await expect(starIcon).toHaveClass(DASHBOARD_TEXTS.unstarTaskClass)
    })

    test(`should create a new task with a different user as the assignee ${[COMMON_TEXTS.skipSetup]}`, async({
            task,
            page, 
            browser
        }: { 
            task: TaskPage,
            page: Page 
            browser: Browser
        })=>{
            await page.goto('/')
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

    test('should add a new commment as creator and verify it can be visible by assignee', async({
        page, comment, browser
    }:{
        page: Page, 
        comment: CommentsPage, 
        browser: Browser
    })=>{
        let assignee: string;
        let previousCount = await comment.getCommentCount({taskName})
        const assigneeText = await page.getByRole('row', {name: taskName})
        .getByRole('cell').nth(2)
        .textContent()
        
        assignee = assigneeText!
        
        const message: string = faker.word.words({count: 8})
        await test.step('Step 1: Add a new Comment and check comment count', async()=>{
            await comment.addComment({message,taskName})
            await page.goto('/')
            const updatedCount = await comment.getCommentCount({taskName})
            expect(updatedCount).toBeGreaterThan(previousCount)
            previousCount = updatedCount
        })

        const newContext: BrowserContext = await browser.newContext({
            storageState:{cookies:[], origins:[]}
        })
        const newPage = await newContext.newPage()
        
        await test.step('Step 2: Login as assignee and check if comment is visible', async()=>{
            await newPage.goto('/')
            const loginAssignee = new Login(newPage)
            const email : string = assignee.toLowerCase().split(' ')[0]
            await loginAssignee.login({
                email: `${email}@example.com`,
                password:'welcome',
                userName:assignee!
            })

            await expect(newPage.getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable)
            .getByRole('row', { name:taskName })).toBeVisible()

            await comment.commentVisisbility({taskName, message})
            await page.goto('/')
            const updatedCount = await comment.getCommentCount({taskName})
            expect(updatedCount).toStrictEqual(previousCount)

            await newPage.close()
            await newContext.close()
        })
    })

    test(`should add a new commment as assignee and verify it can be visible by creator ${COMMON_TEXTS.skipSetup}`, async({
        page, 
        comment, 
        browser,
        task
    }:{
        page: Page, 
        comment: CommentsPage, 
        browser: Browser,
        task: TaskPage
    })=>{
        await page.goto('/')
        const assignee = COMMON_TEXTS.assigneeName
        await task.addTask({taskName, userName:assignee})
        let previousCount: number = await comment.getCommentCount({taskName})
        const message: string = faker.word.words({count:5})

        await page.getByTestId(NAVBAR_SELECTORS.logoutButton).click()

        const newContext: BrowserContext = await browser.newContext({
            storageState:{cookies:[], origins:[]}
        })

        const newPage = await newContext.newPage()

        await test.step('Step 1: Login as assignee and post a comment', async()=>{
            const assigneeLogin = new Login(newPage)
            await newPage.goto('/login')
            const email: string = COMMON_TEXTS.assigneeMail
            await assigneeLogin.login({email, password:'welcome',userName:assignee})
            await newPage.getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable).getByText(taskName).click()
            
            await newPage.getByTestId(COMMENT_SELECTORS.commentInput).fill(message)
            const btn: Locator = newPage.getByTestId(COMMENT_SELECTORS.commentSubmitButton)
            await btn.click()
            
            const messageBox = newPage.getByTestId(COMMENT_SELECTORS.uploadedComment)
            await expect(btn).toHaveText('Comment')
            await messageBox.scrollIntoViewIfNeeded()
            await expect(messageBox).toHaveText(message)
        })


        await test.step('Step 2: Check comment count and close newPage and context', async()=>{
            await newPage.goto('/');   
            await newPage.getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable).getByText(taskName).click()
            const msg = newPage.getByText(message)
            await msg.scrollIntoViewIfNeeded()
            await expect(msg).toBeVisible()

            await newPage.goto('/')
        
            const commentCell = newPage.getByRole('row', { name: taskName }).getByRole('cell').nth(3)
            const count = await commentCell.textContent()
            const updatedCount: number = parseInt(count!) || 0
            expect(updatedCount).toBeGreaterThan(previousCount)
            previousCount = updatedCount

            await newPage.close()
            await newContext.close()
        })
        
        await test.step('Step 3: Login as creator and check the comment is visible', async()=>{
            const creatorLogin = new Login(page)
            await page.goto('/')
            await creatorLogin.login({
                email: COMMON_TEXTS.defaulUserMail,
                password: "welcome",
                userName: COMMON_TEXTS.defaultUserName
            })

            await comment.commentVisisbility({taskName, message})
            await page.goto('/')
            const updatedCount = await comment.getCommentCount({taskName})
            expect(updatedCount).toStrictEqual(previousCount)
        })
    })
})