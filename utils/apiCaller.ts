import { getUserToken } from "@/lib/dal";
import axios from "axios";

const BASE_URL = "https://engine.thapartimetable.com";
const BASE_URL_LOCAL = "http://localhost:8080";

interface APICallerParams {
  path: string; // The specific path like '/login'
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  auth?: boolean;
}

export const APICaller = async ({
  path,
  method = "POST",
  body,
  headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin":
      "http://localhost:8080, https://engine.thapartimetable.com",
  },
  auth = false,
}: APICallerParams) => {
  let BASE = BASE_URL;
  if (process.env.NODE_ENV === "development") {
    BASE = BASE_URL_LOCAL;
  }
  try {
    if (auth === true) {
      const token = await getUserToken();
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await axios({
      url: `${BASE}${path}`,
      method,
      headers,
      data: body,
      withCredentials: false,
    });
    return { response: response, data: response.data };
  } catch (error) {
    console.error("API call failed", error);
    throw error;
  }
};
