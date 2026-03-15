import { useRef, useEffect, useCallback } from 'react';

/**
 * Hook for infinite scroll: detects when sentinel enters viewport and triggers load.
 * @param {Function} onLoadMore - Called when user scrolls near bottom
 * @param {boolean} hasMore - Whether more data is available
 * @param {boolean} loading - Whether a fetch is in progress
 * @returns {{ loadMoreRef: React.RefObject }}
 */
export function useInfiniteScroll(onLoadMore, hasMore, loading) {
  const loadMoreRef = useRef(null);

  const handleIntersect = useCallback(
    (entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting || loading || !hasMore) return;
      onLoadMore();
    },
    [onLoadMore, hasMore, loading]
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return { loadMoreRef };
}
