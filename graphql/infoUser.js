import { profilHtml } from "./config.js"
import { Fetch } from "./fetch.js"
import { login } from "./login.js"
import { failedAudits, level, projectsQuery, succeededAudits, user, userInfo, xp } from "./query.js"

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
    auditSvg(failedAudits, succeededAudits)
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

    const dataProject = projects.data.user[0].transactions

    const divProject = document.createElement("div")
    divProject.setAttribute("class", "div-project")

    dataProject.forEach(element => {
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
            const a = document.createElement("a")
            a.href = `https://learn.zone01oujda.ma/git/${element.userLogin}`
            a.innerHTML = element.userLogin
            divMember.appendChild(a)

        })
        div.append(divName, divXp, divMember)
        divProject.append(div)
    })
    document.body.append(divProject)
}
const auditSvg = async (failedD, succeeded) => {
    const respFailed = await Fetch(failedD)
    const respSucceeded = await Fetch(succeeded)
    const countFailed = respFailed.data.user[0].audits_aggregate.aggregate.count
    const countSucceeded = respSucceeded.data.user[0].audits_aggregate.aggregate.count
    const total = countSucceeded + countFailed
    const successRatio = countSucceeded / total;
    const failedRatio = countFailed / total;
    const circleLength = 2 * Math.PI * 90; // محيط الدائرة
    const successStroke = circleLength * successRatio;
    const failedStroke = circleLength * failedRatio;
    const divSvg = document.createElement("div")
    const svgg = document.createElement("div")
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "200");
    svg.setAttribute("height", "200");
    const bg = document.createElementNS(svgNS, "circle");
    bg.setAttribute("cx", "100");
    bg.setAttribute("cy", "100");
    bg.setAttribute("r", "90");
    bg.setAttribute("stroke", "#eee");
    bg.setAttribute("stroke-width", "20");
    bg.setAttribute("fill", "none");
    svg.appendChild(bg);
    const success = document.createElementNS(svgNS, "circle");
    success.setAttribute("cx", "100");
    success.setAttribute("cy", "100");
    success.setAttribute("r", "90");
    success.setAttribute("stroke", "green");
    success.setAttribute("stroke-width", "20");
    success.setAttribute("fill", "none");
    success.setAttribute("stroke-dasharray", `${successStroke} ${circleLength}`);
    success.setAttribute("stroke-dashoffset", "0");
    const text = document.createElementNS(svgNS, "text")
    text.setAttribute("x", "100")
    text.setAttribute("y", "110")
    text.setAttribute("text-anchor", "middle")
    text.setAttribute("font-size", "30")
    text.textContent = `${total} 
    Audits`

    svg.append(success, text);
    svgg.append(svg)
    const failed = document.createElementNS(svgNS, "circle");
    failed.setAttribute("cx", "100")
    failed.setAttribute("cy", "100")
    failed.setAttribute("r", "90")
    failed.setAttribute("stroke", "red")
    failed.setAttribute("stroke-width", "20")
    failed.setAttribute("fill", "none")
    failed.setAttribute("stroke-dasharray", `${failedStroke} ${circleLength}`)
    failed.setAttribute("stroke-dashoffset", `-${successStroke}`)
    svg.append(failed)
    svgg.append(svg)
    divSvg.append(svgg)

    const info = document.createElement("div")
    const pS = document.createElement("p")
    pS.innerHTML = `success-audits ✅: ${Math.round(successRatio * 100)}%`
    pS.style.color = "green"
    const pF = document.createElement("p")
    pF.innerHTML = `failed-audits❌: ${Math.round(failedRatio * 100)}% `
    pF.style.color = "red"
    info.append(pS, pF)
    info.style.margin = "20px"
    divSvg.append(info)
    divSvg.style.display = "flex"
    divSvg.style.justifyContent = "center"
    divSvg.style.alignItems = "center"
    divSvg.style.fontFamily = "sans-serif"
    document.body.append(divSvg)
}
