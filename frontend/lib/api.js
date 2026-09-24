const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export async function request(path, options) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Request failed");
  return data;
}

export const createOrder = (payload) =>
  request("/orders", { method: "POST", body: JSON.stringify(payload) });
export const getOrder = (id) => request(`/orders/${id}`);