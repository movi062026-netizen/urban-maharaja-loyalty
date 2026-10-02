import { motion } from 'framer-motion';
import BookingsList from '../../components/common/BookingsList';

export default function BookingsPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 text-on-surface"
      aria-label="Admin Table Bookings"
    >
      <BookingsList title="Executive Table Reservations &amp; Orders" />
    </motion.section>
  );
}
