import { useState, useCallback, useRef, useEffect } from "react";

const useObserver = (
  getItems: (
    page: number
  ) => Promise<{
    status: number;
    data: any;
  }>
) => {
  const [items, setItems] = useState<{
    results: { [keys: string]: any }[];
    pagination: { totalPages: number; page: number };
  }>({ results: [], pagination: { totalPages: 0, page: 0 } });

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const end = page === items.pagination.totalPages;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;

      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((page) => page + 1);
        }
      });
      if (node && page < items.pagination.totalPages)
        observerRef.current.observe(node);
    },
    [items.pagination.totalPages, loading, page]
  );

  useEffect(() => {
    setLoading(true);
    getItems(page)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          setItems((prevItems) => ({
            results: [...prevItems.results, ...res.data.results],
            pagination: res.data.pagination,
          }));
        } else {
          throw new Error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [getItems, page]);

  return { loading, results: items.results, lastItemRef, end };
};

export default useObserver;
