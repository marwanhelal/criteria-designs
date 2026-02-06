import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Award, Users, Building, Clock, Target, Eye } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* ===== HERO BANNER ===== */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/about-hero.jpg')" }}
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
            Who we are
          </span>
          <h1 className="font-[var(--font-merriweather)] text-[40px] lg:text-[56px] text-white leading-[52px] lg:leading-[68px] mt-4 max-w-[700px]">
            About Criteria Designs
          </h1>
        </div>
      </section>

      {/* ===== ABOUT INTRO ===== */}
      <section className="py-[140px] px-8">
        <div className="max-w-[1290px] mx-auto flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-[633px] h-[400px] lg:h-[630px] rounded-lg overflow-hidden bg-gray-200 shrink-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url('/images/about-bg.jpg')" }}
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              Our Story
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-[48px] lg:leading-[56px] mt-4 max-w-[547px]">
              We build quality real estate projects since 1978
            </h2>
            <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-8 max-w-[526px]">
              Criteria Designs is a leading architecture and interior design firm dedicated to creating
              spaces that inspire. With decades of experience in the industry, we have built a reputation
              for delivering exceptional quality in every project we undertake.
            </p>
            <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4 max-w-[526px]">
              Our team of talented architects, designers, and engineers work collaboratively to transform
              visions into reality, ensuring every detail is meticulously crafted to exceed expectations.
            </p>
          </div>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="bg-[#181C23] py-[100px] px-8">
        <div className="max-w-[1290px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="w-[80px] h-[80px] rounded-full bg-white/10 flex items-center justify-center mb-8">
              <Target size={36} className="text-[#B1A490]" />
            </div>
            <h3 className="font-[var(--font-merriweather)] text-[28px] text-white leading-[38px]">
              Our Mission
            </h3>
            <p className="font-[var(--font-open-sans)] text-[16px] text-white/60 leading-[30px] mt-6">
              To create innovative, sustainable, and aesthetically compelling architectural solutions
              that enhance the quality of life for our clients and communities. We are committed to
              excellence in design, construction, and client service.
            </p>
          </div>
          <div>
            <div className="w-[80px] h-[80px] rounded-full bg-white/10 flex items-center justify-center mb-8">
              <Eye size={36} className="text-[#B1A490]" />
            </div>
            <h3 className="font-[var(--font-merriweather)] text-[28px] text-white leading-[38px]">
              Our Vision
            </h3>
            <p className="font-[var(--font-open-sans)] text-[16px] text-white/60 leading-[30px] mt-6">
              To be the most trusted and respected architecture firm in the region, known for
              transforming spaces into extraordinary experiences. We envision a future where every
              structure we design stands as a testament to innovation and timeless beauty.
            </p>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-[100px] px-8">
        <div className="max-w-[1290px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '+500', label: 'Complete projects', icon: Building },
              { number: '57', label: 'Projects under construction', icon: Clock },
              { number: '150+', label: 'Team members', icon: Users },
              { number: '25', label: 'Years of experience', icon: Award },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-[80px] h-[80px] rounded-full bg-[#F5F0EB] flex items-center justify-center mx-auto mb-6">
                  <stat.icon size={32} className="text-[#B1A490]" />
                </div>
                <span className="font-[var(--font-merriweather)] text-[48px] text-[#181C23] leading-[58px] block">
                  {stat.number}
                </span>
                <span className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[24px] mt-2 block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="bg-[#F5F0EB] py-[100px] px-8">
        <div className="max-w-[1290px] mx-auto">
          <div className="text-center mb-16">
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              Our values
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-[48px] lg:leading-[56px] mt-4">
              What drives us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Innovation',
                desc: 'We push boundaries and embrace new technologies to deliver cutting-edge architectural solutions.',
              },
              {
                title: 'Quality',
                desc: 'Every detail matters. We maintain the highest standards in design, materials, and execution.',
              },
              {
                title: 'Sustainability',
                desc: 'We design with the future in mind, incorporating eco-friendly practices and sustainable materials.',
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-10 rounded-lg">
                <span className="font-[var(--font-merriweather)] text-[64px] text-[#B1A490]/20 leading-[64px]">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-[var(--font-merriweather)] text-[24px] text-[#181C23] leading-[34px] mt-4">
                  {value.title}
                </h3>
                <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-[140px] px-8">
        <div className="max-w-[1290px] mx-auto text-center">
          <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-[48px] lg:leading-[56px] max-w-[600px] mx-auto">
            Ready to start your next project?
          </h2>
          <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-6 max-w-[500px] mx-auto">
            Let&apos;s work together to bring your vision to life. Contact us today to discuss your project.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/10 transition-colors mt-10"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
