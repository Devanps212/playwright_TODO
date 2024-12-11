// import {Page} from '@playwright/test'
// import { faker } from '@faker-js/faker'
// import Login from '../poms/login'
// import { test } from '../fixtures'
// import TaskPage from '../poms/tasks'

// test.describe('Task page', ()=>{

//     let taskName : string;
//     test.beforeEach('generate task', async({})=>{
//         taskName = faker.word.words({count:5})
//     })

//     test('should create tasks', async({page, loginPage, task}: {page: Page, loginPage: Login, task: TaskPage})=>{ 
        
//         await page.goto('/login')
//         await loginPage.login({
//            email: "oliver@example.com",
//            password: "welcome"
//         })

//         await task.addTask({taskName})
//     })

//     test.afterEach('clear task', ()=>{
//         taskName = ''
//     })
// })