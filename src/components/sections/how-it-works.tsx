"use client";

import { motion } from "framer-motion";
import {
  UserIcon,
  DocumentTextIcon,
  SparklesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export function HowItWorks() {
  const buttonHoverVariants = {
    hover: {
      scale: 1.08,
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

  const steps = [
    {
      number: 1,
      title: "Daftar & Buat Profil",
      description:
        "Buat akun gratis dan lengkapi profil dengan informasi pendidikan dan minat jurusan Anda.",
      icon: UserIcon,
    },
    {
      number: 2,
      title: "Tulis Esai",
      description:
        "Jawab pertanyaan personal tentang jurusan impian Anda dengan gaya bahasa yang natural.",
      icon: DocumentTextIcon,
    },
    {
      number: 3,
      title: "AI Analysis",
      description:
        "AI kami menganalisis esai Anda untuk memahami kepribadian, motivasi, dan kesiapan.",
      icon: SparklesIcon,
    },
    {
      number: 4,
      title: "Dapatkan Hasil",
      description:
        "Terima laporan lengkap dengan rekomendasi jurusan dan saran untuk persiapan Anda.",
      icon: ChartBarIcon,
    },
  ];

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="how-it-works" className="py-20 bg-neutral-50">
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
            Proses Sederhana
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight"
          >
            Empat Langkah Menuju Keputusan Tepat
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed"
          >
            Dari pendaftaran hingga hasil analisis—semuanya dirancang untuk
            membuat proses memilih jurusan semudah dan secepat mungkin.
          </motion.p>
        </motion.div>

        <div className="relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center relative"
              >
                {/* Step Number */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-medium">
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                  <step.icon className="w-8 h-8 text-primary-600" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 bg-white rounded-2xl p-8 shadow-soft"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                Lihat Analisis AI dalam Aksi
              </h3>
              <p className="text-neutral-600 mb-6 leading-relaxed">
                Platform kami menggunakan teknologi Natural Language Processing
                (NLP) dan machine learning untuk menganalisis esai Anda dengan
                kedalaman yang luar biasa. Setiap kata dan kalimat dievaluasi
                untuk memahami:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-neutral-700">
                    Motivasi dan minat terhadap jurusan
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-neutral-700">
                    Kesiapan akademik dan pemahaman konsep
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-neutral-700">
                    Kepribadian dan gaya belajar
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-neutral-700">
                    Potensi kesuksesan di jurusan pilihan
                  </span>
                </li>
              </ul>
              <div className="mt-8">
                <motion.a
                  href="/auth"
                  className="inline-block btn btn-primary btn-lg"
                  variants={buttonHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Coba Sekarang Gratis
                </motion.a>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 h-96 flex items-center justify-center border border-primary-200">
              <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <SparklesIcon className="w-16 h-16 text-primary-600" />
                </div>
                <h4 className="text-xl font-semibold text-neutral-900 mb-2">
                  AI Analysis Engine
                </h4>
                <p className="text-neutral-600">
                  Teknologi terdepan untuk analisis esai yang akurat dan
                  mendalam
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
