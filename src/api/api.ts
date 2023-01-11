import axios from "axios"
import { v4 as uuidv4 } from "uuid";
const urlBase = "http://localhost:3000/";

const authKey = "unw4e2bb-22ef-4f09-a796-062f4693fb2b";

export async function getRequest(endpoint : string, data : any)  {
    return new Promise((resolve, reject) => {
        let str = urlBase+endpoint;
        if (str.includes("?")) {
            str += `&authKey=${authKey}`
        } else {
            str += `?authKey=${authKey}`
        }
        axios.get(str).then((response : any) => {
            resolve(response.data);
        }).catch((err : any) => {
            reject(err);
        })
        
    })
}

export async function postRequest(endpoint : string, data : any) {
    return new Promise((resolve, reject) => {
        let str = urlBase+endpoint;
        if (str.includes("?")) {
            str += `&authKey=${authKey}`
        } else {
            str += `?authKey=${authKey}`
        }
        axios.post(str,data).then((response : any) => {
            resolve(response.data);
        }).catch((err : any) => {
            reject(err);
        })
        
    })
}


export function generateUUID(): string {
    return uuidv4();
}