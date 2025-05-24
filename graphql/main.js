
import { infoUser } from "./infoUser.js"
import { login } from "./login.js"
const token = localStorage.getItem("token")
if(!token)login()
else infoUser()
