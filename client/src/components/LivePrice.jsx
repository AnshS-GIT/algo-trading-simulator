import { motion, AnimatePresence } from 'framer-motion';
import useWebSocket from "../hooks/useWebSocket";

export default function LivePrice() {
    const { data } = useWebSocket();

    return (
        <div className="mt-5 text-xl font-semibold text-white flex items-center space-x-2">
            <span>Live Price:</span>
            <div className="relative h-8 min-w-[100px] overflow-hidden flex items-center">
                <AnimatePresence mode="popLayout">
                    {data ? (
                        <motion.span
                            key={data.price}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="font-mono text-green-400 font-bold block absolute"
                        >
                            ${data.price}
                        </motion.span>
                    ) : (
                        <span className="text-gray-500 text-sm">Loading...</span>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
