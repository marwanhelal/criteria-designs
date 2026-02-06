'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate form submission - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubmitted(true)
    setSubmitting(false)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/contact-hero.jpg')" }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(24, 28, 35, 0.7) 0%, rgba(24, 28, 35, 0.5) 100%)',
            }}
          />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-8">
          <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
            Get in touch
          </span>
          <h1 className="font-[var(--font-merriweather)] text-[40px] lg:text-[56px] text-white leading-[52px] lg:leading-[68px] mt-4 max-w-[700px]">
            Contact Us
          </h1>
        </div>
      </section>

      {/* ===== CONTACT INFO + FORM ===== */}
      <section className="py-[140px] px-8">
        <div className="max-w-[1290px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Contact Information */}
            <div className="lg:w-[400px] shrink-0">
              <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
                Contact Information
              </span>
              <h2 className="font-[var(--font-merriweather)] text-[32px] text-[#181C23] leading-[48px] mt-4">
                Let&apos;s start a conversation
              </h2>
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-6">
                Have a project in mind? We&apos;d love to hear about it. Get in touch with us and let&apos;s create something amazing together.
              </p>

              <div className="space-y-8 mt-12">
                <div className="flex items-start gap-4">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#F5F0EB] flex items-center justify-center shrink-0">
                    <MapPin size={22} className="text-[#B1A490]" />
                  </div>
                  <div>
                    <h4 className="font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px]">
                      Address
                    </h4>
                    <p className="font-[var(--font-open-sans)] text-[15px] text-[#666] leading-[24px] mt-1">
                      Cairo, Egypt
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#F5F0EB] flex items-center justify-center shrink-0">
                    <Phone size={22} className="text-[#B1A490]" />
                  </div>
                  <div>
                    <h4 className="font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px]">
                      Phone
                    </h4>
                    <a href="tel:+201151724527" className="font-[var(--font-open-sans)] text-[15px] text-[#666] leading-[24px] mt-1 block hover:text-[#B1A490] transition-colors">
                      +20 115 172 4527
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#F5F0EB] flex items-center justify-center shrink-0">
                    <Mail size={22} className="text-[#B1A490]" />
                  </div>
                  <div>
                    <h4 className="font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px]">
                      Email
                    </h4>
                    <a href="mailto:info@criteriadesigns.com" className="font-[var(--font-open-sans)] text-[15px] text-[#666] leading-[24px] mt-1 block hover:text-[#B1A490] transition-colors">
                      info@criteriadesigns.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#F5F0EB] flex items-center justify-center shrink-0">
                    <Clock size={22} className="text-[#B1A490]" />
                  </div>
                  <div>
                    <h4 className="font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px]">
                      Working Hours
                    </h4>
                    <p className="font-[var(--font-open-sans)] text-[15px] text-[#666] leading-[24px] mt-1">
                      Sun - Thu: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="flex-1">
              {submitted ? (
                <div className="bg-[#F5F0EB] rounded-lg p-12 text-center">
                  <div className="w-[80px] h-[80px] rounded-full bg-[#B1A490] flex items-center justify-center mx-auto">
                    <Mail size={32} className="text-white" />
                  </div>
                  <h3 className="font-[var(--font-merriweather)] text-[28px] text-[#181C23] leading-[38px] mt-8">
                    Thank you!
                  </h3>
                  <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4 max-w-[400px] mx-auto">
                    Your message has been sent successfully. We&apos;ll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/10 transition-colors mt-8"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] block mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-4 border border-gray-200 rounded-lg font-[var(--font-open-sans)] text-[16px] text-[#181C23] focus:outline-none focus:border-[#B1A490] transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] block mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-6 py-4 border border-gray-200 rounded-lg font-[var(--font-open-sans)] text-[16px] text-[#181C23] focus:outline-none focus:border-[#B1A490] transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] block mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-6 py-4 border border-gray-200 rounded-lg font-[var(--font-open-sans)] text-[16px] text-[#181C23] focus:outline-none focus:border-[#B1A490] transition-colors"
                        placeholder="+20 xxx xxx xxxx"
                      />
                    </div>
                    <div>
                      <label className="font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] block mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-6 py-4 border border-gray-200 rounded-lg font-[var(--font-open-sans)] text-[16px] text-[#181C23] focus:outline-none focus:border-[#B1A490] transition-colors"
                        placeholder="Project inquiry"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] block mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-6 py-4 border border-gray-200 rounded-lg font-[var(--font-open-sans)] text-[16px] text-[#181C23] focus:outline-none focus:border-[#B1A490] transition-colors resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="font-[var(--font-libre-franklin)] text-[14px] text-white uppercase tracking-[0.56px] leading-[24px] bg-[#B1A490] px-[50px] py-[18px] rounded-[30px] hover:bg-[#9A8D79] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAP PLACEHOLDER ===== */}
      <section className="h-[450px] bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-[var(--font-open-sans)] text-[16px] text-[#666]">
            Map will be embedded here
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
