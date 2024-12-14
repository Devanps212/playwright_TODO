import {test as base, Page} from '@playwright/test'
import Login from "../poms/login";
import TaskPage from '../poms/tasks';
import CommentsPage from '../poms/comments';

interface ExtendedFeature{
    loginPage: Login
    task: TaskPage,
    comment: CommentsPage
}

export const test = base.extend<ExtendedFeature>({
    loginPage : async({page}: {page: Page}, use):Promise<void>=>{
        const login = new Login(page)
        await use(login)
    },

    task :async({page}: {page: Page}, use):Promise<void>=>{
        const tasks = new TaskPage(page)
        await use(tasks)
    },

    comment: async({page}:{page: Page}, use):Promise<void>=>{
        const comments = new CommentsPage(page)
        await use(comments)
    }
})

