import { useState, useEffect, useCallback } from 'react';
import { adminApi, loyaltyApi } from '../services/api';
import toast from 'react-hot-toast';

export function useStaffQueue() {
  const [pendingStamps, setPendingStamps] = useState([]);
  const [recentPatrons, setRecentPatrons] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const [pendingRes, patronsRes] = await Promise.all([
        adminApi.getStamps({ status: 'PENDING', limit: 12 }).catch(() => ({ data: { data: [] } })),
        adminApi.getGuests({ page: 1, limit: 10 }).catch(() => ({ data: { data: [] } })),
      ]);

      setPendingStamps(pendingRes.data?.data || []);
      setRecentPatrons(patronsRes.data?.data || []);
    } catch (err) {
      // Non-fatal
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    // Auto-refresh queue every 15 seconds for live dining room updates
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  const approveStamp = async (stampId) => {
    try {
      await loyaltyApi.approveStamp(stampId);
      toast.success('Royal seal verified and granted!');
      await fetchQueue();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to approve seal');
      return false;
    }
  };

  const rejectStamp = async (stampId, reason) => {
    try {
      await loyaltyApi.rejectStamp(stampId, reason);
      toast.success('Stamp request rejected');
      await fetchQueue();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to reject stamp');
      return false;
    }
  };

  return {
    pendingStamps,
    recentPatrons,
    loading,
    refreshQueue: fetchQueue,
    approveStamp,
    rejectStamp,
  };
}
