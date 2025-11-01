"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/auth-provider";
import SplitText from "@/components/ui/SplitText";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 animate-pulse">
            <SparklesIcon className="w-8 h-8 text-primary-600" />
          </div>
          <p className="text-neutral-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const features = [
    {
      icon: ClockIcon,
      title: "Cepat & Efisien",
      description: "Selesaikan dalam waktu singkat dengan hasil akurat",
    },
    {
      icon: ChartBarIcon,
      title: "Analisis Mendalam",
      description: "Penjelasan detail tentang kesiapan dan rekomendasi",
    },
    {
      icon: AcademicCapIcon,
      title: "Expert Insight",
      description: "Nasihat berdasarkan pengalaman ribuan siswa",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-white" />

          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              {/* Greeting */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-8"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Selamat datang kembali, {user.full_name?.split(" ")[0]}!
              </motion.div>

              {/* Main Headline */}
              <div className="mb-6">
                <SplitText
                  text="Siap Menemukan Jurusan yang Tepat?"
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight"
                  tag="h1"
                  delay={100}
                  duration={2.5}
                  ease="elastic.out(0.8, 0.3)"
                  splitType="words"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-50px"
                />
              </div>

              {/* Subheadline */}
              <div className="mb-12">
                <SplitText
                  text="Analisis mendalam dengan teknologi AI untuk mengungkap potensi sejati Anda dan menemukan jurusan yang paling sesuai dengan aspirasi masa depan Anda."
                  className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed"
                  tag="p"
                  delay={70}
                  duration={1.8}
                  ease="power3.out"
                  splitType="words"
                  from={{ opacity: 0, y: 20 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.15}
                  rootMargin="-30px"
                />
              </div>

              {/* CTA Button */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center mb-16"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/essay-grader"
                    className="btn btn-primary btn-lg text-lg px-8 py-4 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <span>Mulai Test Sekarang</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Quick Info */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-neutral-600 mb-12"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-secondary-600" />
                  <span>Durasi: ±10-15 menit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-secondary-600" />
                  <span>Hasil instan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-secondary-600" />
                  <span>Bebas revisi</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Apa yang akan Anda dapatkan?
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Dapatkan analisis komprehensif untuk membantu keputusan jurusan
                Anda
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="card card-hover p-8"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-full mb-6">
                    <feature.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                Cara Kerja Test Kami
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Proses simple namun mendalam untuk hasil maksimal
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {[
                {
                  step: "01",
                  title: "Mulai Test",
                  description: "Jawab pertanyaan essay dengan jujur",
                },
                {
                  step: "02",
                  title: "Analisis AI",
                  description: "Sistem AI menganalisis jawaban Anda",
                },
                {
                  step: "03",
                  title: "Dapatkan Insight",
                  description: "Lihat hasil analisis mendalam",
                },
                {
                  step: "04",
                  title: "Ambil Tindakan",
                  description: "Ikuti rekomendasi untuk sukses",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="card p-6 text-center h-full flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold text-primary-600 mb-3">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {item.description}
                    </p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2">
                      <ArrowRightIcon className="w-8 h-8 text-primary-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-primary-600" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob" />
            <div className="absolute -bottom-8 right-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Jangan Ragu Lagi, Mulai Sekarang!
              </h2>
              <p className="text-lg text-white text-opacity-90 max-w-2xl mx-auto mb-8">
                Ribuan siswa telah menemukan jurusan impian mereka melalui
                platform kami. Saatnya Anda untuk menemukan potensi sejati.
              </p>
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/essay-grader"
                  className="inline-flex items-center space-x-2 bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-neutral-100 transition-all shadow-lg"
                >
                  <span>Mulai Test Gratis Sekarang</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
