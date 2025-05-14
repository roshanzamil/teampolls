import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  id: number;
}

export default function AnimatedButton({ id }: AnimatedButtonProps) {
  return (
    <motion.a
      href={`/poll/${id}`}
      className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-transform duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      📊 View Poll
    </motion.a>
  );
}
