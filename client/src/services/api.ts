// src/services/api.ts

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const testAPI = async (data: {
  url: string;
  requests: number;
  concurrency: number;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/test`, {
      method: "POST", // assuming POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getResults = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const res = await fetch(`${BASE_URL}/results`);

  if (!res.ok) {
    throw new Error("Failed to fetch results");
  }

  return res.json();
};  