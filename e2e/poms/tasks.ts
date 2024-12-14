import { expect, Locator, Page } from "@playwright/test";
import { CREATE_TASK_SELECTORS, NAVBAR_SELECTORS, TASKS_TABLE_SELECTORS } from "../constants/selectors";
import { COMMON_TEXTS, DASHBOARD_TEXTS } from '../constants/texts/index'

interface TaskName {
    taskName: string
}

interface CreateNewTaskProps extends TaskName {
    userName?: string;
}

export default class TaskPage{
    constructor(
        private page: Page
    ){}
    
    addTask = async({taskName, userName=COMMON_TEXTS.assigneeName}: CreateNewTaskProps)=>{

        await this.page.getByTestId(NAVBAR_SELECTORS.addTodoButton).click()

        await this.page.getByTestId(CREATE_TASK_SELECTORS.taskTitleField).fill(taskName)

        await this.page.locator(CREATE_TASK_SELECTORS.memberSelectContainer).click();
        await this.page.locator(CREATE_TASK_SELECTORS.memberOptionField).getByText(userName).click()
        await this.page.getByTestId(CREATE_TASK_SELECTORS.createTaskButton).click()

        const taskInDashBoard = this.page
        .getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable)
        .getByRole('row', { name: new RegExp(taskName, 'i')})

        await taskInDashBoard.scrollIntoViewIfNeeded()
        await expect(taskInDashBoard).toBeVisible()
    }

    completeTask = async({taskName}: {taskName: string}): Promise<void>=>{

        // await expect(this.page.getByRole("heading", { name: "Loading..." }))
        // .toBeHidden()

        const completed: Locator = this.page.getByTestId(TASKS_TABLE_SELECTORS.completedTasksTable)
        .getByRole('row', { name: taskName })

        const isTaskCompleted: number = await completed.count()

        if(isTaskCompleted)return

        await this.page
        .getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable)
        .getByRole('row', { name: taskName }).getByRole('checkbox')
        .click()

        await completed.scrollIntoViewIfNeeded()
        await expect(completed).toBeVisible()
    }

    deleteTask = async({taskName}: {taskName: string}): Promise<void>=>{
        const completedTask = this.page.getByTestId(TASKS_TABLE_SELECTORS.completedTasksTable)
        .getByRole('row', { name: taskName })

        const isTaskCompleted: number = await completedTask.count()

        if(isTaskCompleted)return

        await completedTask.getByTestId(TASKS_TABLE_SELECTORS.deleteTaskButton).click()
        await expect(completedTask).toBeHidden()

        await expect(this.page.getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable)
        .getByRole("row", { name: taskName })).toBeHidden()
    }

    addStar = async({taskName}: {taskName: string})=>{
        const starIcon = this.page.getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable)
        .getByRole('row', { name: taskName })
        .getByTestId(TASKS_TABLE_SELECTORS.starUnstarButton)

        await starIcon.click()
        await expect(starIcon).toHaveClass(DASHBOARD_TEXTS.starredTaskClass)

        await expect(this.page
        .getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable)
        .getByRole('row').nth(1)// Using nth methods here since we want to verify the first row of the table
        ).toContainText(taskName)
    }
}