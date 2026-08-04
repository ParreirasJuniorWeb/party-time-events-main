import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_DEPLOYMENT_BACKEND_URL || "http://localhost:3000/api";
const normalizedBaseURL = API_BASE_URL.replace(/\/+$/, "");

const partyFetch = axios.create({
  baseURL: normalizedBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default partyFetch;
