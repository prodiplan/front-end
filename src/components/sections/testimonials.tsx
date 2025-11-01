"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const testimonials = [
    {
      id: 1,
      name: "Sarah Putri",
      role: "Siswa SMA Kelas 12",
      avatar: "SP",
      content:
        "ProdiPlan membantu saya menemukan jurusan Computer Science yang ternyata sangat cocok dengan minat dan bakat saya. Analisis AI-nya sangat akurat!",
      rating: 5,
      major: "Computer Science",
      school: "SMAN 3 Jakarta",
      achievement: "Diterima di 3 PTN favorit",
    },
    {
      id: 2,
      name: "Rizki Ahmad",
      role: "Siswa SMA Kelas 12",
      avatar: "RA",
      content:
        "Saya awalnya bingung memilih jurusan, tapi setelah menggunakan ProdiPlan, saya jadi tahu bahwa Mechanical Engineering adalah pilihan terbaik untuk saya.",
      rating: 5,
      major: "Mechanical Engineering",
      school: "SMA Negeri 1 Bandung",
      achievement: "Dapat beasiswa prestasi",
    },
    {
      id: 3,
      name: "Maya Indah",
      role: "Siswa SMA Kelas 12",
      avatar: "MI",
      content:
        "Feedback yang diberikan sangat detail dan membantu saya mempersiapkan diri lebih baik untuk jurusan Psikologi. Highly recommended!",
      rating: 5,
      major: "Psychology",
      school: "SMAN 1 Surabaya",
      achievement: "Lolos seleksi mandiri",
    },
    {
      id: 4,
      name: "Kevin Pratama",
      role: "Siswa SMA Kelas 12",
      avatar: "KP",
      content:
        "Platform ini luar biasa! AI analysis-nya membantu saya mengenal potensi diri yang saya tidak sadari sebelumnya.",
      rating: 5,
      major: "Business Administration",
      school: "SMA Privat Budi Mulia",
      achievement: "Diterima di universitas impian",
    },
  ];

  const stats = [
    {
      number: "10,000+",
      label: "Siswa Terbantu",
      description: "Telah menemukan jurusan impian mereka",
    },
    {
      number: "95%",
      label: "Tingkat Kepuasan",
      description: "Pengguna sangat puas dengan hasil analisis",
    },
    {
      number: "85%",
      label: "Tingkat Keberhasilan",
      description: "Diterima di jurusan pilihan",
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

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            Kisah Nyata
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight"
          >
            Ribuan Siswa Telah Menemukan Jalur Sukses
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed"
          >
            Lihat bagaimana ProdiPlan membantu siswa membuat keputusan karir
            yang transformatif.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-neutral-900 mb-2">
                {stat.label}
              </div>
              <div className="text-neutral-600">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="card p-8 md:p-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Avatar and Info */}
              <div className="md:col-span-1">
                <div className="text-center md:text-left">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto md:mx-0 mb-4">
                    {testimonials[currentIndex].avatar}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-1">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    {testimonials[currentIndex].role}
                  </p>
                  <div className="flex items-center justify-center md:justify-start space-x-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map(
                      (_, i) => (
                        <StarIcon
                          key={i}
                          className="w-5 h-5 text-semantic-warning fill-current"
                        />
                      )
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <AcademicCapIcon className="w-4 h-4 text-primary-600 mr-2" />
                      <span className="text-neutral-700">
                        {testimonials[currentIndex].major}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <BriefcaseIcon className="w-4 h-4 text-primary-600 mr-2" />
                      <span className="text-neutral-700">
                        {testimonials[currentIndex].achievement}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-2">
                <blockquote className="text-lg md:text-xl text-neutral-700 leading-relaxed italic">
                  "{testimonials[currentIndex].content}"
                </blockquote>
                <div className="mt-6 text-sm text-neutral-600">
                  <p className="font-medium">
                    {testimonials[currentIndex].school}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-medium flex items-center justify-center text-neutral-600 hover:text-primary-600 hover:shadow-strong transition-all duration-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-medium flex items-center justify-center text-neutral-600 hover:text-primary-600 hover:shadow-strong transition-all duration-200"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-primary-600"
                    : "bg-neutral-300 hover:bg-neutral-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Bergabunglah dengan Kisah Sukses Mereka
            </h3>
            <p className="text-neutral-600 mb-8 max-w-2xl mx-auto">
              Mulai perjalanan Anda menemukan jurusan kuliah yang tepat hari
              ini.
            </p>
          </motion.div>
          <motion.a
            href="/auth"
            className="inline-block btn btn-primary btn-lg"
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Mulai Analisis Gratis
          </motion.a>
        </div>
      </div>
    </section>
  );
}
