import axios from "axios";

// You can set your API base URL here
export const api = axios.create({
	baseURL: "http://localhost:5000/api",
	headers: {
		"Content-Type": "application/json",
	},
});
