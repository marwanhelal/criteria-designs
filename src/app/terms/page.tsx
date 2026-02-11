'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'

export default function TermsPage() {
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
              Terms of Service
            </h1>
          </AnimatedSection>

          <AnimatedSection className="mt-12 space-y-8">
            <div>
              <h2 className="font-[var(--font-merriweather)] text-[24px] text-[#181C23] leading-[34px]">
                1. Acceptance of Terms
              </h2>
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4">
                By accessing and using the Criteria Designs website, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </div>

            <div>
              <h2 className="font-[var(--font-merriweather)] text-[24px] text-[#181C23] leading-[34px]">
                2. Use of Content
              </h2>
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4">
                All content on this website, including images, text, designs, and graphics, is the property of Criteria Designs and is protected by copyright laws. You may not reproduce, distribute, or use any content without prior written permission.
              </p>
            </div>

            <div>
              <h2 className="font-[var(--font-merriweather)] text-[24px] text-[#181C23] leading-[34px]">
                3. Project Information
              </h2>
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4">
                Project details, renderings, and specifications displayed on this website are for informational purposes only and may be subject to change. Criteria Designs reserves the right to modify project details at any time.
              </p>
            </div>

            <div>
              <h2 className="font-[var(--font-merriweather)] text-[24px] text-[#181C23] leading-[34px]">
                4. Contact Information
              </h2>
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4">
                For any questions regarding these terms, please contact us at info@criteriadesigns.com.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  )
}
