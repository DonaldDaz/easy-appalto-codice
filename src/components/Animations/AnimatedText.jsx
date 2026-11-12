import { motion } from "framer-motion";

const AnimatedText = ({ text, darkMode }) => {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Ritardo tra ogni lettera
      },
    },
  };

  const letterVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      style={{ display: "flex", overflow: "hidden", alignItems: "center" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          style={{
            display: "inline-block",
            fontSize: "1.4em",
            color: darkMode ? "#fcfcfc" : "#17726d",
          }}
          variants={letterVariants}
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

export { AnimatedText };
