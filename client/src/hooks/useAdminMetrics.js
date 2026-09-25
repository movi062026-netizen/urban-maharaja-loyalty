import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/api';

export function useAdminMetrics(autoRefreshInterval = 30000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await adminApi.getDashboard();
      setData(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch imperial metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    if (autoRefreshInterval > 0) {
      const interval = setInterval(fetchMetrics, autoRefreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchMetrics, autoRefreshInterval]);

  return { data, loading, error, refetch: fetchMetrics };
}
