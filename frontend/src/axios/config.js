import axios from "axios";

const partyFetch = axios.create({
    baseURL: import.meta.env.VITE_DEPLOYMENT_BACKEND_URL || "http://localhost:3000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

export default partyFetch;