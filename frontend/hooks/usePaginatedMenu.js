import { useEffect, useState } from "react";
import { getMenuPage } from "../lib/menuApi";

export function usePaginatedMenu(limit = 10) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    getMenuPage(1, limit)
      .then(({ items: initialItems, pagination: initialPagination }) => {
        setItems(initialItems);
        setPagination(initialPagination);
      })
      .catch((requestError) => setError(requestError.message));
  }, [limit]);

  async function loadMore() {
    if (!pagination || loadingMore || pagination.page >= pagination.totalPages) return;
    setLoadingMore(true);
    try {
      const nextPage = await getMenuPage(pagination.page + 1, pagination.limit);
      setItems((currentItems) => [...currentItems, ...nextPage.items]);
      setPagination(nextPage.pagination);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingMore(false);
    }
  }

  return {
    items,
    error,
    loadingMore,
    hasMore: Boolean(pagination && pagination.page < pagination.totalPages),
    loadMore,
  };
}