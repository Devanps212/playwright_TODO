import {test} from '../fixtures/index'
import { STORAGE_STATE } from '../../playwright.config'
import fs from 'fs'

test('Teardown', async({})=>{
    fs.unlink(STORAGE_STATE, (error: NodeJS.ErrnoException | null)=>{
        if(error)return 
        console.error("error: ", error)
    })
})