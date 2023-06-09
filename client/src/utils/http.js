import axios from 'axios';

const instance = axios.create({
    baseURL: "http://localhost:3001/api"
    // baseURL: "https://ahms.onrender.com/api"
})

export default instance;
