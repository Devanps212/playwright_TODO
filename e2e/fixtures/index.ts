import {test as base, Page} from '@playwright/test'
import Login from "../poms/login";
import TaskPage from '../poms/tasks';

interface ExtendedFeature{
    loginPage: Login
    task: TaskPage
}

export const test = base.extend<ExtendedFeature>({
    loginPage : async({page}: {page: Page}, use)=>{
        const login = new Login(page)
        await use(login)
    },

    task :async({page}: {page: Page}, use)=>{
        const tasks = new TaskPage(page)
        await use(tasks)
    }
})

