'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />

      <section data-navbar-dark className="pt-[160px] pb-[100px] px-8">
        <div className="max-w-[800px] mx-auto">
          <AnimatedSection>
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              Legal
            </span>
            <h1 className="font-[var(--font-merriweather)] text-[40px] text-[#181C23] leading-[52px] mt-4">
              Privacy Policy
            </h1>
          </AnimatedSection>

          <AnimatedSection className="mt-12 space-y-8">
            <div>
              <h2 className="font-[var(--font-merriweather)] text-[24px] text-[#181C23] leading-[34px]">
                1. Information We Collect
              </h2>
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4">
                When you use our contact form, we collect your name, email address, phone number, and message content. We use this information solely to respond to your inquiry and do not share it with third parties.
              </p>
            </div>

            <div>
              <h2 className="font-[var(--font-merriweather)] text-[24px] text-[#181C23] leading-[34px]">
                2. How We Use Your Information
              </h2>
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4">
                We use the information provided to communicate with you about potential projects, respond to inquiries, and improve our services. We do not sell or rent your personal information to third parties.
              </p>
            </div>

            <div>
              <h2 className="font-[var(--font-merriweather)] text-[24px] text-[#181C23] leading-[34px]">
                3. Cookies
              </h2>
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4">
                This website uses essential cookies to ensure proper functionality, including session management for the admin panel. We do not use tracking cookies or third-party analytics.
              </p>
            </div>

            <div>
              <h2 className="font-[var(--font-merriweather)] text-[24px] text-[#181C23] leading-[34px]">
                4. Data Security
              </h2>
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="font-[var(--font-merriweather)] text-[24px] text-[#181C23] leading-[34px]">
                5. Contact Us
              </h2>
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4">
                If you have any questions about this privacy policy, please contact us at info@criteriadesigns.com.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  )
}
