"use client";

import { motion } from "framer-motion";
import {
  SparklesIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export function Features() {
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

  const features = [
    {
      icon: SparklesIcon,
      title: "Analisis AI Mendalam",
      description:
        "Teknologi Natural Language Processing menganalisis esai dengan akurasi tinggi untuk mengungkap kepribadian, minat, dan potensi Anda.",
      color: "primary",
    },
    {
      icon: AcademicCapIcon,
      title: "Rekomendasi Jurusan",
      description:
        "Dapatkan 3-5 rekomendasi jurusan yang dipersonalisasi berdasarkan profil akademik dan minat karir unik Anda.",
      color: "secondary",
    },
    {
      icon: ChartBarIcon,
      title: "Progress Tracking Real-time",
      description:
        "Pantau perkembangan kesiapan Anda melalui dashboard interaktif dengan metrik yang mudah dipahami.",
      color: "primary",
    },
    {
      icon: ShieldCheckIcon,
      title: "Keamanan Data Enterprise",
      description:
        "Data pribadi Anda dilindungi dengan enkripsi tingkat militer dan mematuhi standar privasi internasional.",
      color: "secondary",
    },
    {
      icon: ClockIcon,
      title: "Hasil Instan dalam 5 Menit",
      description:
        "Dapatkan laporan komprehensif dan actionable feedback tanpa perlu menunggu lama.",
      color: "primary",
    },
    {
      icon: DocumentTextIcon,
      title: "Laporan Detail & Lengkap",
      description:
        "Analisis mendalam tentang kekuatan, area pengembangan, potensi sukses, dan strategi persiapan yang terukur.",
      color: "secondary",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
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
    <section id="features" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-4"
          >
            Fitur & Kemampuan
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight"
          >
            Layanan Lengkap untuk Kesuksesan Karir Anda
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed"
          >
            Teknologi AI terdepan memberikan analisis mendalam, rekomendasi
            personal, dan panduan persiapan untuk memilih jurusan yang tepat.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="card card-hover p-8 h-full border border-neutral-200"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                  feature.color === "primary"
                    ? "bg-primary-100"
                    : "bg-secondary-100"
                }`}
              >
                <feature.icon
                  className={`w-8 h-8 ${
                    feature.color === "primary"
                      ? "text-primary-600"
                      : "text-secondary-600"
                  }`}
                />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="bg-primary-600 rounded-2xl p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Siap Mencari Jurusan Impianmu?
            </h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan siswa yang telah menemukan jurusan
              kuliah yang tepat melalui platform kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <a
                  href="/auth"
                  className="btn bg-white text-primary-600 hover:bg-neutral-50 btn-lg px-8 py-4 font-semibold"
                >
                  Mulai Gratis Sekarang
                </a>
              </motion.div>
              <motion.div
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <a
                  href="#how-it-works"
                  className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 btn-lg px-8 py-4 font-semibold"
                >
                  Pelajari Lebih Lanjut
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
