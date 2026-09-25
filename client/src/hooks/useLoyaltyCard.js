import { useState, useEffect, useCallback } from 'react';
import { loyaltyApi } from '../services/api';
import toast from 'react-hot-toast';

export function useLoyaltyCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await loyaltyApi.getMyCard();
      setData(res.data.data);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to load Maharaja Card';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCard();
  }, [fetchCard]);

  const requestStamp = async () => {
    try {
      await loyaltyApi.requestMyStamp();
      toast.success('Dining seal requested! Waiter/Concierge will verify your visit.');
      await fetchCard();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to request seal');
      return false;
    }
  };

  const startNextCycle = async () => {
    try {
      await loyaltyApi.startNextCycle();
      toast.success('Next Maharaja Card cycle activated!');
      await fetchCard();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to start next cycle');
      return false;
    }
  };

  return {
    data,
    loading,
    error,
    refresh: fetchCard,
    requestStamp,
    startNextCycle,
  };
}
