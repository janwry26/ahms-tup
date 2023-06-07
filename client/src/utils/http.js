import axios from 'axios';

const instance = axios.create({
    // baseURL: "http://localhost:3001/api"
    baseURL: "https://ahms-tup.vercel.app/api"
})

export default instance;