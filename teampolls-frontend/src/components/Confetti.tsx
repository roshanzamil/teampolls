// Confetti.tsx
import { motion } from 'framer-motion';

const randomPosition = () => ({
  top: `${Math.random() * 80 + 10}%`,
  left: `${Math.random() * 80 + 10}%`,
});

export default function Confetti() {
  const confettiPieces = Array.from({ length: 20 });

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confettiPieces.map((_, index) => (
        <motion.span
          key={index}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            ...randomPosition(),
            scale: [0.8, 1.5, 0],
            opacity: [1, 0.8, 0],
          }}
          transition={{ duration: 1, ease: 'easeOut', delay: index * 0.05 }}
          className="absolute text-4xl select-none"
          style={{ color: randomColor() }}
        >
          🎉
        </motion.span>
      ))}
    </div>
  );
}

function randomColor() {
  const colors = ['#4DB6AC', '#FFB300', '#FF6384', '#36A2EB', '#9966FF'];
  return colors[Math.floor(Math.random() * colors.length)];
}
