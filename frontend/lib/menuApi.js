import { request } from "./api";

export const getMenuPage = async (page = 1, limit = 10) => {
  const data = await request(`/menu?page=${page}&limit=${limit}`);
  if (Array.isArray(data)) {
    return {
      items: data,
      pagination: { page, limit, totalItems: data.length, totalPages: 1 },
    };
  }
  return data;
};