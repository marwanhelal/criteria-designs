import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ChevronDown, ChevronLeft, ChevronRight, Building, Leaf, Headset, Users, Armchair, Shield, Quote } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(24, 28, 35, 0.5) 0%, rgba(24, 28, 35, 0) 100%), linear-gradient(90deg, rgba(24, 28, 35, 0.5) 0%, rgba(24, 28, 35, 0.5) 100%)',
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-8 lg:px-[315px]">
          <Link
            href="/about"
            className="inline-flex items-center font-[var(--font-libre-franklin)] text-[14px] text-white uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/20 transition-colors w-fit"
          >
            Learn more
          </Link>

          {/* Scroll Down */}
          <div className="flex items-center gap-2 mt-16">
            <ChevronDown size={16} className="text-white" />
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-white uppercase tracking-[0.56px]">
              Scroll down
            </span>
          </div>
        </div>

        {/* Slide Controller */}
        <div className="absolute right-[96px] top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2">
          <div className="w-[3px] h-[20px] bg-white rounded-full" />
          <div className="w-[3px] h-[20px] bg-white/30 rounded-full" />
          <div className="w-[3px] h-[20px] bg-white/30 rounded-full" />
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="py-[140px] px-8">
        <div className="max-w-[1290px] mx-auto flex flex-col lg:flex-row gap-16">
          {/* Image */}
          <div className="w-full lg:w-[633px] h-[400px] lg:h-[630px] rounded-lg overflow-hidden bg-gray-200 shrink-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url('/images/about-bg.jpg')" }}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              Who we are
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-[48px] lg:leading-[56px] mt-4 max-w-[547px]">
              We build quality real estate projects since 1978
            </h2>
            <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-8 max-w-[526px]">
              Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit
            </p>
            <Link
              href="/about"
              className="inline-flex items-center font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/10 transition-colors w-fit mt-10"
            >
              more About us
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PROJECTS SECTION ===== */}
      <section className="bg-[#181C23] py-[140px] px-8">
        <div className="max-w-[1290px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Content */}
            <div className="lg:w-[400px] shrink-0">
              <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
                What we create
              </span>
              <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-white leading-[48px] lg:leading-[56px] mt-4">
                Explore latest projects
              </h2>
              <Link
                href="/projects"
                className="inline-flex items-center font-[var(--font-libre-franklin)] text-[14px] text-white uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/20 transition-colors w-fit mt-10"
              >
                all projects
              </Link>
            </div>

            {/* Project Cards */}
            <div className="flex gap-6 overflow-x-auto pb-4">
              {[
                { name: 'Rowaq Compound', location: 'New Cairo, Egy', area: '273,000 SQFT' },
                { name: 'EUA UNI.', location: 'Al-amin, North Coast', area: '418,550 SQFT' },
                { name: 'Crystal Yard Mall', location: 'New Cairo, Egy', area: '210,500 SQFT' },
              ].map((project, idx) => (
                <div
                  key={idx}
                  className="min-w-[300px] lg:min-w-[414px] bg-[#1E2330] rounded-lg overflow-hidden group cursor-pointer shrink-0"
                >
                  <div className="h-[380px] bg-gray-700 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{ backgroundImage: `url('/images/project-${idx + 1}.jpg')` }}
                    />
                  </div>
                  <div className="p-8">
                    <p className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px]">
                      {project.location}
                    </p>
                    <h3 className="font-[var(--font-merriweather)] text-[24px] text-white leading-[34px] mt-2">
                      {project.name}
                    </h3>
                    <p className="font-[var(--font-libre-franklin)] text-[16px] text-white/60 mt-4">
                      {project.area}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-4 mt-10">
            <button className="w-[60px] h-[60px] rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="w-[60px] h-[60px] rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 pt-16 border-t border-white/10">
            {[
              { number: '+500', label: 'Complete projects' },
              { number: '57', label: 'Projects under construction' },
              { number: '42', label: 'Projects underway' },
              { number: '25', label: 'Years of experience' },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="font-[var(--font-merriweather)] text-[48px] lg:text-[64px] text-white leading-[78px]">
                  {stat.number}
                </span>
                <span className="font-[var(--font-open-sans)] text-[14px] text-white/60 leading-[24px] max-w-[100px]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Large Image */}
          <div className="mt-20 h-[400px] lg:h-[800px] rounded-lg overflow-hidden bg-gray-700">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url('/images/project-large.jpg')" }}
            />
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="py-[140px] px-8">
        <div className="max-w-[1290px] mx-auto">
          <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
            why choose us
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-[48px] lg:leading-[56px] mt-4 max-w-[524px]">
            Making living spaces affordable
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 mt-16">
            {[
              { icon: Building, title: 'High Quality Products', desc: 'Veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam' },
              { icon: Leaf, title: 'Natural Environment', desc: 'Veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam' },
              { icon: Headset, title: 'Professional Services', desc: 'Veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam' },
              { icon: Users, title: 'Humanitarian Community', desc: 'Veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam' },
              { icon: Armchair, title: 'Comprehensive Amenities', desc: 'Veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam' },
              { icon: Shield, title: 'Absolute Security', desc: 'Veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam' },
            ].map((service, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="w-[120px] h-[120px] rounded-full bg-[#F5F0EB] flex items-center justify-center">
                  <service.icon size={50} className="text-[#B1A490]" />
                </div>
                <h3 className="font-[var(--font-merriweather)] text-[20px] text-[#181C23] leading-[28px] mt-8">
                  {service.title}
                </h3>
                <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-4 max-w-[366px]">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="bg-[#F5F0EB] py-[100px] px-8">
        <div className="max-w-[1290px] mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] rounded-full bg-gray-300 overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('/images/testimonial-avatar.jpg')" }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-[48px] h-[48px] rounded-full bg-[#B1A490] flex items-center justify-center">
              <Quote size={20} className="text-white" />
            </div>
          </div>

          {/* Quote */}
          <div>
            <p className="font-[var(--font-merriweather)] text-[20px] lg:text-[24px] text-[#181C23] leading-[36px] lg:leading-[46px] italic">
              &ldquo;Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut&rdquo;
            </p>
            <p className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] mt-8">
              Hesham helal / Ceo &amp; founder
            </p>

            {/* Dots */}
            <div className="flex gap-2 mt-8">
              <div className="w-[16px] h-[4px] rounded-full bg-[#B1A490]" />
              <div className="w-[16px] h-[4px] rounded-full bg-[#B1A490]/30" />
              <div className="w-[16px] h-[4px] rounded-full bg-[#B1A490]/30" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAREER / JOIN US SECTION ===== */}
      <section className="py-[140px] px-8">
        <div className="max-w-[1290px] mx-auto flex flex-col lg:flex-row gap-16">
          {/* Image */}
          <div className="w-full lg:w-[633px] h-[400px] lg:h-[630px] rounded-lg overflow-hidden bg-gray-200 shrink-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url('/images/career-bg.jpg')" }}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              Join with Us
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-[48px] lg:leading-[56px] mt-4 max-w-[547px]">
              Expand career and make your move to housale
            </h2>
            <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-8 max-w-[526px]">
              Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center font-[var(--font-libre-franklin)] text-[14px] text-[#181C23] uppercase tracking-[0.56px] leading-[24px] border-2 border-[#B1A490] px-[40px] py-[18px] rounded-[30px] hover:bg-[#B1A490]/10 transition-colors w-fit mt-10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
