import {expect, Locator, Page} from '@playwright/test'
import {TASKS_TABLE_SELECTORS, COMMENT_SELECTORS} from '../constants/selectors/index'

export default class CommentsPage{
    constructor(
        public page: Page
    ){}

    addComment = async({
        message,
        taskName
    }:{
        message: string,
        taskName: string
    }): Promise<void>=>{

        await this.page.getByTestId(TASKS_TABLE_SELECTORS.pendingTasksTable).getByText(taskName).click()

        await this.page.getByTestId(COMMENT_SELECTORS.commentInput).fill(message)
        const btn: Locator = this.page.getByTestId(COMMENT_SELECTORS.commentSubmitButton)
        await btn.click()

        const messageBox = this.page.getByTestId(COMMENT_SELECTORS.uploadedComment)
        await expect(btn).toHaveText('Comment')
        await messageBox.scrollIntoViewIfNeeded()
        await expect(messageBox).toHaveText(message)
    }

    getCommentCount = async({
        taskName
    }:{
        taskName: string
    }):Promise<number>=>{
        const commentCell = this.page.getByRole('row', { name: taskName }).getByRole('cell').nth(3)
        const count = await commentCell.textContent()
        const previousCount = parseInt(count!) || 0
        return previousCount
    }

    commentVisisbility = async({
        taskName,
        message
    }:{
        taskName: string,
        message: string
    }): Promise<void>=>{
        await this.page.getByTestId('tasks-pending-table').getByText(taskName).click()
        const msg = this.page.getByText(message)
        await msg.scrollIntoViewIfNeeded()
        await expect(msg).toBeVisible()
    }
}