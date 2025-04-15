import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

export const getTopCoins = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1,
        sparkline: true,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as Error;
    if (axios.isAxiosError(err)) {
      console.warn(
        "Top coins fetch failed:",
        err.message ?? "Unknown Axios error"
      );
    } else {
      console.error("Unexpected error in getTopCoins:", JSON.stringify(err));
    }
    return null;
  }
};

export const getGlobalStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/global`);
    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // ✅ Avoid full console error unless in dev
      if (process.env.NODE_ENV === "development") {
        console.warn("Global stats fetch failed:", error.message);
      }
    } else {
      console.error("Unexpected error in getGlobalStats:", error);
    }
    return null; // Safe fallback
  }
};
