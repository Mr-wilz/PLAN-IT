import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`glass-card rounded-3xl p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}
