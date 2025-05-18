
import { login } from "./login.js"
export  const Fetch = async (query) => {
    const token = localStorage.getItem("token")
    if (!token) {
        login()
        return
    }
    console.log(777, query);
    

    const url = "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql"

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {

                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        }
        )
        var data = await response.json()
        console.log(data);
        
        if (data.errors) {
            console.log(data);
            login()
            return
        }

    } catch (error) {
        console.error("Error:", error)
      
    }
}

