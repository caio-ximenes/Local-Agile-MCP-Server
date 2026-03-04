import axios from "axios"
import { config } from "./config.js"

const clickUpClient = axios.create({
    baseURL: "https://api.clickup.com/api/v2",
    headers: {
        Authorization: config.clickupToken,
        accept: 'application/json'
    }
})

export default clickUpClient
