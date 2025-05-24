import { profilHtml } from "./config.js"
import { Fetch } from "./fetch.js"
import { login } from "./login.js"
import { level, projectsQuery, user, userInfo, xp } from "./query.js"

export const infoUser = async () => {
    document.body.innerHTML = profilHtml
    const data = await Fetch(user); // ✅ await it

    const header = document.getElementById("user")
    const p = document.createElement("strong")
    p.innerHTML = `Welcome ${data.data.user[0].login}`

    header.append(p)
    displayUserInfo(userInfo)
    logOut()
    xpUNDlevel(xp, level)
    displayProject(projectsQuery)
}
const displayUserInfo = async (user) => {
    const info = await Fetch(user)
    const container = document.createElement("div")
    container.id = "user-xp"
    const userInfo = document.createElement("div")
    userInfo.className = "user-info"

    const data = info.data.user[0].attrs
    userInfo.innerHTML = `
    <h2>👤 Profil User</h2>
    <div id = "profil" style="display: none;">
    <p><strong>Full name :</strong> ${data.
            firstName} ${data.lastName}</p>
        <p><strong>CIN :</strong> ${data.cin}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>tel :</strong> ${data.tel}</p>
        <p><strong>Gender :</strong> ${data.gender}</p>
        <p><strong>dateOfBirth :</strong> ${new Date(data.dateOfBirth).toLocaleDateString()}</p>
        <p><strong>birthCity :</strong> ${data.birthCity}</p>
        <p><strong>Adress :</strong> ${data.addressStreet}</p>
        <p><strong>
        
        birthCountry :</strong> ${data.birthCountry}</p>
        </div>
        `
    container.append(userInfo)
    document.body.appendChild(container)
    const h2 = document.querySelector("h2")
    let check = false
    h2.addEventListener("click", () => {
        const profil = document.getElementById("profil")
        if (!check) {
            profil.style.display = "block"
            check = true
        } else {
            profil.style.display = "none"
            check = false
        }
    })
}
const logOut = () => {
    const Logout = document.getElementById("log-out")
    Logout.addEventListener("click", () => {
        localStorage.removeItem("token")
        login()
    })
}
const xpUNDlevel = async (xpUser, levelUser) => {
    const xpData = await Fetch(xpUser)
    const levelData = await Fetch(levelUser)
    const numXp = xpData.data.transaction_aggregate.aggregate.sum.amount
    const level = levelData.data.transaction[0].amount
    const xpConv = convertXp(numXp)
    const levelXp = document.querySelector(".level-xp")

    levelXp.innerHTML = `
      <p id= "level"><strong>Current Level :</strong> ${level}</p>
       <p id="xp"><strong>Total XP :</strong> ${xpConv}</p>
     `

    //    document.getElementById("user-xp").append(levelXp)
}
const convertXp = (num) => {
    num /= 1000
    if (num < 1000) return num.toFixed(2) + "KB"
    else {
        num /= 1000
        return num.toFixed(2) + "MB"
    }
}
const displayProject = async (project) => {
    const projects = await Fetch(project)
    console.log(typeof projects.data.user[0].transactions);
    const dataProject = projects.data.user[0].transactions

    const divProject = document.createElement("div")
    divProject.setAttribute("class", "div-project")

    dataProject.forEach(element => {
        console.log(element.object.progresses[0].group.members);

        const div = document.createElement("div")
        div.className = "project-row"
        const divName = document.createElement("div")
        divName.className = "project-name"
        divName.innerHTML = element.object.name
        const divXp = document.createElement("div")
        divXp.className = "project-xp-time"
        const spanXp = document.createElement("span")
        spanXp.id = "project-xp"
        spanXp.innerHTML = convertXp(element.amount)
        const spanTime = document.createElement("span")
        spanTime.id = "project-time"
        spanTime.innerHTML = new Date(element.createdAt).toLocaleString()
        divXp.append(spanXp, spanTime)
        const members = element.object.progresses[0].group.members
        const divMember = document.createElement("div")
        divMember.className = "project-member"

        members.forEach(element => {
            console.log(element.userLogin);
            const a = document.createElement("a")
            a.href=`https://learn.zone01oujda.ma/git/${element.userLogin}`
            a.innerHTML = element.userLogin
            divMember.appendChild(a)

        })
        div.append(divName, divXp, divMember)
       divProject.append(div)
    })
     document.body.append(divProject)
}
