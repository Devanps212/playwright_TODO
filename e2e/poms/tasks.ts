import { expect, Locator, Page } from "@playwright/test";


export default class TaskPage{
    constructor(
        public page: Page
    ){}
    
    addTask = async({taskName, userName='Oliver Smith'}: {taskName: string, userName?: string})=>{

        await expect(this.page.getByTestId('navbar-logout-link')).toBeVisible()
        await this.page.getByTestId('navbar-add-todo-link').click()

        await this.page.getByTestId('form-title-field').fill(taskName)

        await this.page.locator(".css-2b097c-container").click();
        await this.page.locator(".css-26l3qy-menu").getByText(userName).click()
        await this.page.getByTestId('form-submit-button').click()

        const taskInDashBoard = this.page
        .getByTestId('tasks-pending-table')
        .getByRole('row', { name: new RegExp(taskName, 'i')})

        await taskInDashBoard.scrollIntoViewIfNeeded()
        await expect(taskInDashBoard).toBeVisible()
    }

    completeTask = async({taskName}: {taskName: string}): Promise<void>=>{

        // await expect(this.page.getByRole("heading", { name: "Loading..." }))
        // .toBeHidden()

        const completed: Locator = this.page.getByTestId('tasks-completed-table')
        .getByRole('row', { name: taskName })

        const isTaskCompleted: number = await completed.count()

        if(isTaskCompleted)return

        await this.page
        .getByTestId('tasks-pending-table')
        .getByRole('row', { name: taskName }).getByRole('checkbox')
        .click()

        await completed.scrollIntoViewIfNeeded()
        await expect(completed).toBeVisible()
    }

    deleteTask = async({taskName}: {taskName: string}): Promise<void>=>{
        const completedTask = this.page.getByTestId('tasks-completed-table')
        .getByRole('row', { name: taskName })

        const isTaskCompleted: number = await completedTask.count()

        if(isTaskCompleted)return

        await completedTask.getByTestId('completed-task-delete-link').click()
        await expect(completedTask).toBeHidden()

        await expect(this.page.getByTestId("tasks-pending-table")
        .getByRole("row", { name: taskName })).toBeHidden()
    }

    addStar = async({taskName}: {taskName: string})=>{
        const starIcon = this.page.getByTestId("tasks-pending-table")
        .getByRole('row', { name: taskName })
        .getByTestId('pending-task-star-or-unstar-link')

        await starIcon.click()
        await expect(starIcon).toHaveClass(/ri-star-fill/i)

        await expect(this.page.getByTestId("tasks-pending-table").getByRole('row').nth(1)).toContainText(taskName)
    }
}