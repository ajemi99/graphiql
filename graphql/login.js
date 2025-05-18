import { loginHtml } from "./config.js"
// import { infoUser } from "./infoUser.js"


export const login = () => {

   const div = document.createElement("div")
   div.className = "container"
   div.innerHTML = loginHtml
    document.body.append(div)
    const form = document.getElementById("login-form")
    const urlSignin = "https://learn.zone01oujda.ma/api/auth/signin"
    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const userName = document.getElementById("username-email").value
        const password = document.getElementById("password").value

        const convertData = btoa(`${userName}:${password}`)

        try {
            const response = await fetch(urlSignin, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": `Basic ${convertData}`
                }
            })
           
                const data = await response.json()
                console.log(data)
                if (data.error)throw data.error
                localStorage.setItem("token", data)
         
            
        } catch (error) {
           errorhandl(error)

        }
    })
}
const errorhandl = (error)=>{
    const div = document.getElementById("error")
    div.innerHTML = error
    setTimeout(() => {
        div.innerHTML =""
    }, 3000);


}