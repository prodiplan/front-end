"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
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
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full"
        >
          <CheckCircleIcon className="w-8 h-8 text-white" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-primary-100">
          {/* Gradient Header */}
          <div className="bg-primary-600 px-8 py-12 sm:px-12 sm:py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 flex justify-center"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-12 h-12 sm:w-14 sm:h-14 text-primary-600" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
            >
              Assesment Berhasil Dikirim! ✨
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white text-opacity-90 text-base sm:text-lg"
            >
              Terima kasih telah menyelesaikan essai Anda
            </motion.p>
          </div>

          {/* Content */}
          <div className="px-8 py-12 sm:px-12 sm:py-14">
            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center mb-10"
            >
              <p className="text-neutral-700 text-base sm:text-lg mb-6 leading-relaxed">
                Jawaban Anda telah kami terima dan sedang dianalisis oleh sistem
                AI kami dengan teknologi terkini.
              </p>

              <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 sm:p-8 mb-8">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <ClockIcon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-neutral-900 text-base sm:text-lg mb-2">
                      Waktu Analisis: 2-24 Jam
                    </h3>
                    <p className="text-neutral-600 text-sm sm:text-base">
                      Biasanya hasil analisis akan siap dalam beberapa jam. Kami
                      akan membuat laporan komprehensif yang mendetail untuk
                      membantu Anda memahami kesiapan akademik dan profesional.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-neutral-600 text-sm sm:text-base">
                Anda dapat melihat status dan hasil analisis kapan saja di
                halaman
                <span className="font-semibold text-primary-600">
                  {" "}
                  Profil Anda
                </span>
              </p>
            </motion.div>

            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-10"
            >
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 text-center sm:text-left">
                Apa yang Terjadi Selanjutnya?
              </h3>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Analisis AI",
                    desc: "Sistem kami menganalisis setiap jawaban Anda secara mendalam",
                  },
                  {
                    step: "2",
                    title: "Perhitungan Skor",
                    desc: "Menghitung skor kesiapan berdasarkan berbagai parameter",
                  },
                  {
                    step: "3",
                    title: "Pembuatan Laporan",
                    desc: "Membuat laporan komprehensif dengan rekomendasi khusus",
                  },
                  {
                    step: "4",
                    title: "Notifikasi Anda",
                    desc: "Anda akan diberitahu ketika hasil sudah siap untuk dilihat",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {item.title}
                      </p>
                      <p className="text-neutral-600 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/profile"
                className="flex-1 btn btn-primary btn-lg px-6 py-3 flex items-center justify-center space-x-2 text-center"
              >
                <span>Ke Profil Saya</span>
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 btn btn-secondary btn-lg px-6 py-3 text-center"
              >
                Kembali ke Dashboard
              </Link>
            </motion.div>

            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-8 pt-6 border-t border-neutral-200 text-center"
            >
              <p className="text-neutral-500 text-xs sm:text-sm">
                💡 Tip: Anda bisa melanjutkan menjelajahi platform kami sambil
                menunggu hasil analisis Anda
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-8 text-center"
        >
          <p className="text-neutral-600 text-sm">
            Perlu bantuan? Hubungi kami di{" "}
            <a
              href="mailto:support@prodiplan.id"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              support@prodiplan.id
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
