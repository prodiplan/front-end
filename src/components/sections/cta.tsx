"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";

export function CTA() {
  const buttonHoverVariants = {
    hover: {
      scale: 1.08,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
      transition: {
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    tap: {
      scale: 0.92,
      transition: { duration: 0.15, ease: "easeInOut" },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 bg-primary-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-full text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            Penawaran Terbatas
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Waktunya Memilih Jurusan yang Tepat
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white text-opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Bergabunglah dengan ribuan siswa yang telah menemukan jurusan kuliah
            yang sesuai dengan potensi mereka—dan mencapai kesuksesan akademik.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.div
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <a
                href="/auth"
                className="btn bg-white text-primary-600 hover:bg-neutral-50 btn-lg px-8 py-4 font-semibold flex items-center space-x-2 shadow-strong"
              >
                <span>Mulai Gratis Sekarang</span>
                <ArrowRightIcon className="w-5 h-5" />
              </a>
            </motion.div>
            <motion.div
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <a
                href="/demo"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 btn-lg px-8 py-4 font-semibold backdrop-blur-sm"
              >
                Lihat Demo
              </a>
            </motion.div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-opacity-80"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-sm">Gratis untuk Coba</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm">Support Online</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5min</div>
              <div className="text-sm">Hasil Instan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-sm">Pengguna Aktif</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
