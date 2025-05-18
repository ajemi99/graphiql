import { Fetch } from "./home.js"
import { user } from "./query.js"

export const infoUser = async () => {
    console.log(1111, user);
    
    await Fetch(user)

}
