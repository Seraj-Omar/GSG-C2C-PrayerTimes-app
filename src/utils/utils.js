export async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("API Error:", err.message);
    throw new Error("Failed to load data. Please try again.");
  }
}
