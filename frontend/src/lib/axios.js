import axios from "axios";

//creating an axios instance with default baseURL
const api = axios.create({
    baseURL: "http://localhost:5001/api",
});

export default api;