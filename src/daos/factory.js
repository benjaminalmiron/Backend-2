import {configObject} from "../config/index.js"
import userDAO  from "./users.dao.js"

const {persistence} = configObject
let usersDao 

switch(persistence){
    
    default:
    
    usersDao = userDAO
    break; 
}

export default usersDao