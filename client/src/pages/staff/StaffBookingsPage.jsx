import { motion } from 'framer-motion';
import BookingsList from '../../components/common/BookingsList';

export default function StaffBookingsPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 text-on-surface"
      aria-label="Staff Table Bookings"
    >
      <BookingsList title="Floor Table Reservations &amp; Orders" />
    </motion.section>
  );
}
