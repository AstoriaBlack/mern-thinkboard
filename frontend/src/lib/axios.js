import axios from "axios";

//creating a dynamic baseURL based on environment
//since in production there is no localhost, we set the dynamic baseURL to /api
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";


//creating an axios instance with default baseURL
const api = axios.create({
    baseURL: BASE_URL,
});

export default api;