'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Linkedin, Mail } from 'lucide-react'

interface TeamMember {
  id: string
  nameEn: string
  roleEn: string
  bioEn: string | null
  photo: string | null
  email: string | null
  linkedin: string | null
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.ok ? res.json() : [])
      .then(data => setTeam(data))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/team-hero.jpg')" }}
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
            Our people
          </span>
          <h1 className="font-[var(--font-merriweather)] text-[40px] lg:text-[56px] text-white leading-[52px] lg:leading-[68px] mt-4 max-w-[700px]">
            Our Team
          </h1>
        </div>
      </section>

      {/* ===== LEADERSHIP ===== */}
      <section className="py-[140px] px-8">
        <div className="max-w-[1290px] mx-auto">
          <div className="text-center mb-16">
            <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
              Leadership
            </span>
            <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-[48px] lg:leading-[56px] mt-4">
              Meet the people behind our success
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="font-[var(--font-open-sans)] text-[16px] text-[#666]">Loading team...</p>
            </div>
          ) : team.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <div key={member.id} className="group">
                  <div className="relative rounded-lg overflow-hidden bg-gray-200">
                    <div className="h-[400px] overflow-hidden">
                      {member.photo ? (
                        <div
                          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{ backgroundImage: `url('${member.photo}')` }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#B1A490]/20">
                          <span className="font-[var(--font-merriweather)] text-[64px] text-[#B1A490]">
                            {member.nameEn.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-[#181C23]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-[48px] h-[48px] rounded-full bg-white/20 flex items-center justify-center hover:bg-[#B1A490] transition-colors"
                        >
                          <Linkedin size={20} className="text-white" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-[48px] h-[48px] rounded-full bg-white/20 flex items-center justify-center hover:bg-[#B1A490] transition-colors"
                        >
                          <Mail size={20} className="text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-[var(--font-merriweather)] text-[20px] text-[#181C23] leading-[28px]">
                      {member.nameEn}
                    </h3>
                    <p className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] mt-1">
                      {member.roleEn}
                    </p>
                    {member.bioEn && (
                      <p className="font-[var(--font-open-sans)] text-[15px] text-[#666] leading-[26px] mt-4 line-clamp-3">
                        {member.bioEn}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Fallback static team */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'Hesham Helal', role: 'CEO & Founder', bio: 'With over 25 years of experience in architectural design, Hesham leads the vision and strategic direction of Criteria Designs.' },
                { name: 'Ahmed Hassan', role: 'Lead Architect', bio: 'Ahmed brings innovative design solutions and leads our architectural team in delivering award-winning projects.' },
                { name: 'Sara Mohamed', role: 'Interior Designer', bio: 'Sara transforms interior spaces with her keen eye for detail and passion for creating harmonious environments.' },
                { name: 'Omar Khalil', role: 'Project Manager', bio: 'Omar ensures every project is delivered on time and within budget while maintaining the highest quality standards.' },
              ].map((member, idx) => (
                <div key={idx} className="group">
                  <div className="relative rounded-lg overflow-hidden bg-gray-200">
                    <div className="h-[400px] overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-[#B1A490]/20">
                        <span className="font-[var(--font-merriweather)] text-[64px] text-[#B1A490]">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-[var(--font-merriweather)] text-[20px] text-[#181C23] leading-[28px]">
                      {member.name}
                    </h3>
                    <p className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] mt-1">
                      {member.role}
                    </p>
                    <p className="font-[var(--font-open-sans)] text-[15px] text-[#666] leading-[26px] mt-4 line-clamp-3">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== JOIN CTA ===== */}
      <section className="bg-[#F5F0EB] py-[100px] px-8">
        <div className="max-w-[1290px] mx-auto text-center">
          <span className="font-[var(--font-libre-franklin)] text-[14px] text-[#B1A490] uppercase tracking-[0.56px] leading-[24px]">
            Join with us
          </span>
          <h2 className="font-[var(--font-merriweather)] text-[32px] lg:text-[40px] text-[#181C23] leading-[48px] lg:leading-[56px] mt-4 max-w-[600px] mx-auto">
            Want to be part of our team?
          </h2>
          <p className="font-[var(--font-open-sans)] text-[16px] text-[#666] leading-[30px] mt-6 max-w-[500px] mx-auto">
            We&apos;re always looking for talented individuals who are passionate about architecture and design.
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
