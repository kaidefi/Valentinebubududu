import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

/**
 * Design Philosophy: Playful Romance with Emotional Reactions
 * - Dudu (the bear) is asking for your heart
 * - Emotional reactions when "No" is clicked repeatedly
 * - Complete screen transformation on "Yes"
 * - Celebration with Bubu and Dudu happy together
 */

const DUDU_REACTIONS = [
  {
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663276445111/sQHPXJRCXWZpoLuK.webp",
    label: "hopeful",
  },
  {
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663276445111/QrbtSyXYnFUiRhqV.webp",
    label: "sad",
  },
  {
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663276445111/kKnAiGJtwVlXoahv.webp",
    label: "crying",
  },
];

const BUBU_HAPPY = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663276445111/CxArJPQRWGnfBIiu.webp";

const DUDU_HAPPY = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663276445111/qiOBOHCqeJAXxjLf.webp";

export default function Home() {
  const [yesClicked, setYesClicked] = useState(false);
  const [noClickCount, setNoClickCount] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentDuduReaction = DUDU_REACTIONS[Math.min(noClickCount, 2)];

  // Handle "No" button evasion
  const handleNoHover = () => {
    if (!yesClicked) {
      setNoClickCount((prev) => prev + 1);
      setYesScale((prev) => Math.min(prev + 0.15, 2.5));

      // Move the button away
      const randomX = (Math.random() - 0.5) * 300;
      const randomY = (Math.random() - 0.5) * 300;
      setNoPosition({ x: randomX, y: randomY });
    }
  };

  const handleYesClick = () => {
    setYesClicked(true);
  };

  // Floating hearts animation
  const FloatingHearts = () => {
    return (
      <>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="fixed pointer-events-none text-red-400"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              opacity: 0,
            }}
            animate={{
              y: -50,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          >
            <Heart size={20 + Math.random() * 30} fill="currentColor" />
          </motion.div>
        ))}
      </>
    );
  };

  // Celebration confetti
  const Confetti = () => {
    return (
      <>
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="fixed pointer-events-none"
            initial={{
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
              opacity: 1,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              opacity: 0,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 2 + Math.random() * 1,
              ease: "easeOut",
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: [
                  "#ff69b4",
                  "#ff1493",
                  "#ffc0cb",
                  "#ffb6c1",
                  "#ff69b4",
                ][i % 5],
              }}
            />
          </motion.div>
        ))}
      </>
    );
  };

  // Initial screen - asking for valentine
  const AskingScreen = () => (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
      {/* Dudu character with reactions */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <motion.img
          src={currentDuduReaction.image}
          alt="Dudu asking"
          className="w-48 h-48 md:w-64 md:h-64 object-contain"
          animate={{
            y: noClickCount > 0 ? [0, -10, 0] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </motion.div>

      {/* Main question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-red-600 mb-4 drop-shadow-lg">
          Will you be my Valentine?
        </h1>
        <p className="text-xl md:text-2xl text-pink-600 drop-shadow-md">
          - Dudu 💕
        </p>
      </motion.div>

      {/* Buttons container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative flex gap-6 justify-center items-center flex-wrap"
      >
        {/* Yes button - grows larger */}
        <motion.button
          onClick={handleYesClick}
          whileHover={{ scale: yesScale * 1.05 }}
          whileTap={{ scale: yesScale * 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          style={{
            transform: `scale(${yesScale})`,
            transformOrigin: "center",
          }}
        >
          YES! 💕
        </motion.button>

        {/* No button - evades cursor */}
        <motion.button
          ref={noButtonRef}
          onMouseEnter={handleNoHover}
          onTouchStart={handleNoHover}
          animate={{
            x: noPosition.x,
            y: noPosition.y,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 10,
          }}
          className="px-8 py-4 bg-gray-400 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          disabled={yesClicked}
        >
          No...
        </motion.button>
      </motion.div>

      {/* Evasion counter hint */}
      {noClickCount > 0 && noClickCount < 3 && !yesClicked && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-pink-600 text-lg drop-shadow-md"
        >
          Dudu is getting sad... 😢
        </motion.p>
      )}

      {noClickCount >= 3 && !yesClicked && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-red-600 text-lg font-bold drop-shadow-md"
        >
          You can't escape! Dudu won't give up! 💔
        </motion.p>
      )}

      {/* Decorative elements */}
      <motion.div
        className="fixed bottom-10 left-10 text-4xl pointer-events-none"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      >
        💝
      </motion.div>

      <motion.div
        className="fixed top-10 right-10 text-4xl pointer-events-none"
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          duration: 3,
          delay: 0.5,
          repeat: Infinity,
        }}
      >
        💖
      </motion.div>

      <motion.div
        className="fixed bottom-1/3 right-10 text-3xl pointer-events-none"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      >
        ✨
      </motion.div>
    </div>
  );

  // Celebration screen - after saying yes
  const CelebrationScreen = () => (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
      {/* Happy characters - Bubu and Dudu hugging */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 mb-12 justify-center items-center flex-wrap"
      >
        <motion.img
          src="https://s3.getstickerpack.com/storage/uploads/sticker-pack/bbdd-hugging/sticker_4.gif?48ffac833ee69bfb04cc9b919ca576e3&d=200x200"
          alt="Bubu and Dudu hugging"
          className="w-96 h-auto md:w-full md:h-auto object-contain"
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </motion.div>

      {/* Success message */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <motion.h2
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="text-5xl md:text-6xl font-bold text-red-600 drop-shadow-lg mb-6"
        >
          YES! 🎉💕
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-3xl md:text-4xl text-pink-600 drop-shadow-md mb-4"
        >
          Bubu & Dudu are so happy!
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-2xl text-pink-500 drop-shadow-md"
        >
          Happy Valentine's Day! 💗
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xl text-red-500 drop-shadow-md mt-6"
        >
          You made them the happiest bears in the world! 🐻💕🐼
        </motion.p>
      </motion.div>

      {/* Decorative floating elements */}
      <motion.div
        className="fixed bottom-10 left-10 text-5xl pointer-events-none"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        💝
      </motion.div>

      <motion.div
        className="fixed top-10 right-10 text-5xl pointer-events-none"
        animate={{
          y: [0, 30, 0],
          rotate: [0, -10, 10, 0],
        }}
        transition={{
          duration: 2,
          delay: 0.5,
          repeat: Infinity,
        }}
      >
        💖
      </motion.div>

      <motion.div
        className="fixed bottom-1/3 right-10 text-4xl pointer-events-none"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      >
        ✨
      </motion.div>

      <motion.div
        className="fixed top-1/4 left-1/4 text-4xl pointer-events-none"
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      >
        💫
      </motion.div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/LGMw6IOl4UiEZWeI6jfPJN/sandbox/hmpUc7BHAj5Qw5j4UVfIZo-img-1_1770034386000_na1fn_dmFsZW50aW5lLWhlcm8.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvTEdNdzZJT2w0VWlFWldlSTZqZlBKTi9zYW5kYm94L2htcFVjN0JIQWo1UXc1ajRVVmZJWm8taW1nLTFfMTc3MDAzNDM4NjAwMF9uYTFmbl9kbUZzWlc1MGFXNWxMV2hsY204LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=uF1jKOUec6I5S2tYpoyD4UhShopdT1~nQUgWiuES73jg5~Cvf8hbwgMXy1eXY4pEiUMzwxE8ZMLzVz6TLb84lBcJ4FDy4bZXLEShTmQUTMFdpsK~3k8E9F7l8mt2nbFCBwodbTIMsboJInrWlUnR37B5c1Az6rlD2xEXBx4ClqG37qcjfQR8ug027C9fLy~uI~61p-Q8H8XRTnvBuRYU9ZF1-2qJAXawMLYnVSFzOku0YAWufwVlrvS3FA31ukaoKv4AeqJVBc0qDeIS618jbi-JbyqyN1BD8fOOmqYkM4B8rUFuMMFW3By2xfr49hXKZPR2ubVJM62kydx3CGt74w__')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Floating hearts background */}
      <FloatingHearts />

      {/* Celebration confetti - only show after yes clicked */}
      <AnimatePresence>
        {yesClicked && <Confetti />}
      </AnimatePresence>

      {/* Screen content */}
      <AnimatePresence mode="wait">
        {yesClicked ? (
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CelebrationScreen />
          </motion.div>
        ) : (
          <motion.div
            key="asking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AskingScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
