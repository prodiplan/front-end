"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  SparklesIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ConfirmationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page load
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-primary-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-full"
        >
          <CheckCircleIcon className="w-6 h-6 text-white" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-primary-50 flex flex-col overflow-hidden">
      {/* Navbar */}
      <div className="border-b border-neutral-200 bg-white bg-opacity-50 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 group"
            >
              <ArrowLeftIcon className="w-4 h-4 text-neutral-600 group-hover:text-primary-600 transition-colors" />
              <span className="text-neutral-600 group-hover:text-primary-600 transition-colors font-medium text-xs sm:text-sm">
                Kembali
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-primary-600" />
              </div>
              <span className="font-semibold text-neutral-900 text-xs sm:text-sm">ProdiPlan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-2 sm:px-4 py-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full h-full flex flex-col"
      >
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-primary-100 flex flex-col h-full">
          {/* Gradient Header */}
          <div className="bg-primary-600 px-4 sm:px-6 py-4 text-center flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-3 flex justify-center"
            >
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-8 h-8 text-primary-600" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl sm:text-2xl font-bold text-white mb-1"
            >
              Assesment Berhasil Dikirim! ✨
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white text-opacity-90 text-xs sm:text-sm"
            >
              Terima kasih telah menyelesaikan essai Anda
            </motion.p>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-4 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column - Main Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center lg:text-left"
              >
                <p className="text-neutral-700 text-xs sm:text-sm mb-3 leading-relaxed">
                  Jawaban Anda telah kami terima dan sedang dianalisis oleh sistem
                  AI kami dengan teknologi terkini.
                </p>

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 sm:p-4 mb-3">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-neutral-900 text-xs sm:text-sm mb-1">
                        Waktu Analisis: 2-24 Jam
                      </h3>
                      <p className="text-neutral-600 text-xs">
                        Hasil analisis biasanya siap dalam beberapa jam. Laporan komprehensif akan membantu Anda memahami kesiapan akademik.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-neutral-600 text-xs sm:text-sm">
                  Cek status di halaman
                  <span className="font-semibold text-primary-600">
                    {" "}
                    Profil Anda
                  </span>
                </p>
              </motion.div>

              {/* Right Column - What's Next */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                  Apa yang Terjadi Selanjutnya?
                </h3>
                <div className="space-y-2">
                {[
                  {
                    step: "1",
                    title: "Analisis AI",
                    desc: "Sistem menganalisis jawaban Anda",
                  },
                  {
                    step: "2",
                    title: "Perhitungan Skor",
                    desc: "Menghitung skor kesiapan",
                  },
                  {
                    step: "3",
                    title: "Pembuatan Laporan",
                    desc: "Membuat laporan komprehensif",
                  },
                  {
                    step: "4",
                    title: "Notifikasi",
                    desc: "Anda akan diberitahu",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.05 }}
                    className="flex items-start space-x-2 p-2 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-xs">
                      {item.step}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 text-xs">
                        {item.title}
                      </p>
                      <p className="text-neutral-600 text-xs">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-2 mt-4 flex-shrink-0"
            >
              <Link
                href="/profile"
                className="flex-1 btn btn-primary btn-sm sm:btn-md px-4 py-2 flex items-center justify-center space-x-1 text-center text-xs sm:text-sm"
              >
                <span>Ke Profil Saya</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 btn btn-secondary btn-sm sm:btn-md px-4 py-2 text-center text-xs sm:text-sm"
              >
                Kembali ke Dashboard
              </Link>
            </motion.div>

            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-2 pt-2 border-t border-neutral-200 text-center flex-shrink-0"
            >
              <p className="text-neutral-500 text-xs">
                💡 Jelajahi platform kami sambil menunggu hasil
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
