import axios from "axios"
const BASE_URL = process.env.REACT_APP_API_URL;

export async function FetchProduct(){
    return axios.get(`${BASE_URL}/api/v1/brands/products/7`,{
        headers : {
            'x-access-token': localStorage.getItem("token")
        }
    })
}
export async function FetchCategory(){
    return axios.get(`${BASE_URL}/api/v1/categories`,{
        headers : {
            'x-access-token': localStorage.getItem("token")
        }
    })
}

export async function FetchBrandApi() {
    return axios.get(`${BASE_URL}/api/v1/brands`, {
        headers: {
            'x-access-token': localStorage.getItem("token")
        }
    })
}

export async function doctor_register(data){
    return axios.post(`${BASE_URL}/api/v1/auth/doctor_register`, data);
}
