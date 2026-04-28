'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
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

interface FounderData {
  founderNameEn: string | null
  founderTitleEn: string | null
  founderDescriptionEn: string | null
  founderImage: string | null
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [founder, setFounder] = useState<FounderData | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.ok ? r.json() : [])
      .then(setTeam)
      .catch(() => {})

    fetch('/api/settings')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setFounder(d) })
      .catch(() => {})
  }, [])

  return (
    <>
      <Navbar />

      {/* ══════════════════ HERO ══════════════════ */}
      <section
        className="relative min-h-[90vh] w-full overflow-hidden flex flex-col justify-end"
        style={{ background: '#0E1118' }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(177,164,144,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(177,164,144,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Large faded number */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute right-[clamp(1rem,5vw,7rem)] top-1/2 -translate-y-1/2 font-[var(--font-playfair)] text-white/[0.03] select-none pointer-events-none"
          style={{ fontSize: 'clamp(200px, 28vw, 360px)', lineHeight: 1 }}
        >
          CDG
        </motion.span>

        <div className="relative z-10 px-[clamp(1.5rem,6vw,8rem)] pb-[clamp(4rem,8vw,10rem)] pt-[clamp(8rem,14vw,16rem)]">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="block w-8 h-px bg-[#B1A490]" />
            <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">
              Our People
            </span>
            <span className="block w-px h-3 bg-[#B1A490]/30" />
            <span className="font-[var(--font-libre-franklin)] text-[10px] text-white/25 uppercase tracking-[3px]">
              Criteria Designs Group
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-[var(--font-playfair)] italic font-normal text-white leading-[1.05]"
            style={{ fontSize: 'clamp(44px, 7.5vw, 108px)', maxWidth: '820px' }}
          >
            The Team<br />
            <span style={{ color: '#B1A490' }}>Behind CDG</span>
          </motion.h1>

          {/* Gold rule + caption */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex items-center gap-6 mt-10"
          >
            <motion.div
              className="h-px bg-[#B1A490]"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <p className="font-[var(--font-libre-franklin)] text-[13px] text-white/35 leading-relaxed max-w-[340px]">
              Architects, designers, and visionaries united by a singular pursuit of excellence.
            </p>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #0E1118)' }}
        />
      </section>

      {/* ══════════════════ FOUNDER SPOTLIGHT ══════════════════ */}
      {(founder?.founderNameEn || founder?.founderImage) && (
        <section
          data-navbar-dark
          className="w-full bg-white overflow-hidden"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
        >
          <div className="max-w-[1380px] mx-auto px-[clamp(1.5rem,6vw,8rem)] py-[clamp(4rem,8vw,11rem)]">
            <div className="flex flex-col lg:flex-row gap-[clamp(3rem,6vw,9rem)] items-start">

              {/* Portrait */}
              <motion.div
                className="lg:w-[42%] shrink-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative" style={{ paddingTop: '56px' }}>
                  {/* Decorative background block */}
                  <div
                    className="absolute left-0 bg-[#EDE9E3] rounded-3xl"
                    style={{ top: 0, width: '85%', height: '55%', zIndex: 0 }}
                  />

                  <motion.div
                    className="relative rounded-3xl overflow-hidden"
                    style={{
                      width: '78%',
                      aspectRatio: '3/4',
                      zIndex: 1,
                      boxShadow: '0 30px 80px -10px rgba(0,0,0,0.18)',
                    }}
                    initial={{ scale: 1.05 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {founder?.founderImage ? (
                      <img
                        src={founder.founderImage}
                        alt={founder.founderNameEn || 'Founder'}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div
                        className="w-full h-full bg-[#D5D1CC] flex items-center justify-center"
                        style={{ background: 'linear-gradient(160deg,#e0dbd4,#cac4bc)' }}
                      >
                        <span
                          className="font-[var(--font-playfair)] italic text-white/60"
                          style={{ fontSize: '80px' }}
                        >
                          {founder?.founderNameEn?.charAt(0) || 'F'}
                        </span>
                      </div>
                    )}
                  </motion.div>

                  {/* Floating role badge */}
                  <motion.div
                    className="absolute bottom-6 right-0 bg-[#181C23] rounded-2xl px-5 py-4"
                    style={{ zIndex: 2, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.55, duration: 0.6 }}
                  >
                    <p className="font-[var(--font-libre-franklin)] text-[9px] text-[#B1A490] uppercase tracking-[2.5px] mb-1">
                      Position
                    </p>
                    <p className="font-[var(--font-playfair)] italic text-white text-[15px]">
                      {founder?.founderTitleEn || 'Founder & CEO'}
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Text content */}
              <motion.div
                className="lg:w-[58%] flex flex-col justify-center pt-4 lg:pt-16"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center gap-3 mb-7">
                  <span className="w-7 h-px bg-[#B1A490]" />
                  <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">
                    Founder
                  </span>
                </div>

                <h2
                  className="font-[var(--font-playfair)] italic font-normal text-[#181C23] leading-[1.08] mb-8"
                  style={{ fontSize: 'clamp(32px, 4.5vw, 64px)' }}
                >
                  {founder?.founderNameEn || 'Our Founder'}
                </h2>

                <motion.div
                  className="w-12 h-[2px] bg-[#B1A490] mb-8 origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />

                {founder?.founderDescriptionEn && (
                  <p
                    className="font-[var(--font-libre-franklin)] text-[#5A5855] leading-[1.85]"
                    style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', maxWidth: '520px' }}
                  >
                    {founder.founderDescriptionEn}
                  </p>
                )}

                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-3 mt-10"
                >
                  <span className="font-[var(--font-libre-franklin)] text-[11px] text-[#181C23] uppercase tracking-[2.5px] group-hover:text-[#B1A490] transition-colors duration-300">
                    View Projects
                  </span>
                  <span className="block w-6 h-px bg-[#181C23] group-hover:w-10 group-hover:bg-[#B1A490] transition-all duration-400" />
                </Link>
              </motion.div>

            </div>
          </div>
        </section>
      )}

      {/* ══════════════════ TEAM GRID ══════════════════ */}
      {team.length > 0 && (
        <section
          className="w-full overflow-hidden"
          style={{ background: '#181C23' }}
        >
          <div className="max-w-[1380px] mx-auto px-[clamp(1.5rem,6vw,8rem)] py-[clamp(4rem,8vw,11rem)]">

            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-[clamp(3rem,5vw,6rem)]">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55 }}
                  className="flex items-center gap-3 mb-5"
                >
                  <span className="w-7 h-px bg-[#B1A490]" />
                  <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">
                    The CDG Family
                  </span>
                  <span className="w-px h-3 bg-white/10" />
                  <span className="font-[var(--font-libre-franklin)] text-[10px] text-white/20 uppercase tracking-[3px]">
                    {String(team.length).padStart(2, '0')} Members
                  </span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.08 }}
                  className="font-[var(--font-playfair)] italic font-normal text-white leading-[1.1]"
                  style={{ fontSize: 'clamp(28px, 3.5vw, 50px)' }}
                >
                  Crafting Excellence,<br />Together
                </motion.h2>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-[var(--font-libre-franklin)] text-[13px] text-white/30 leading-relaxed max-w-[260px] md:text-right pb-1"
              >
                Every member brings a unique discipline that elevates the collective vision.
              </motion.p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(10px,1.5vw,18px)]">
              {team.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.65, delay: (i % 3) * 0.08 }}
                  className="relative group cursor-default"
                  onMouseEnter={() => setHovered(member.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Gold top border */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] bg-[#B1A490] origin-left z-20 pointer-events-none"
                    style={{
                      transform: hovered === member.id ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1)',
                    }}
                  />

                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: '#0E1118' }}
                  >
                    {/* Portrait */}
                    <div
                      className="relative overflow-hidden"
                      style={{ aspectRatio: '3/4', maxHeight: '420px' }}
                    >
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.nameEn}
                          className="w-full h-full object-cover object-top"
                          style={{
                            transform: hovered === member.id ? 'scale(1.06)' : 'scale(1)',
                            filter: hovered === member.id ? 'none' : 'brightness(0.85)',
                            transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.7s ease',
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(160deg,#2a2f3a,#1a1e26)' }}
                        >
                          <span
                            className="font-[var(--font-playfair)] italic text-[#B1A490]/50"
                            style={{ fontSize: '72px' }}
                          >
                            {member.nameEn.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Hover overlay */}
                      <AnimatePresence>
                        {hovered === member.id && (member.bioEn || member.linkedin || member.email) && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex flex-col justify-end p-6"
                            style={{ background: 'linear-gradient(to top, rgba(14,17,24,0.95) 0%, rgba(14,17,24,0.5) 60%, transparent 100%)' }}
                          >
                            {member.bioEn && (
                              <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                                className="font-[var(--font-libre-franklin)] text-[12px] text-white/65 leading-[1.75] mb-4 line-clamp-4"
                              >
                                {member.bioEn}
                              </motion.p>
                            )}
                            {(member.linkedin || member.email) && (
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex gap-3"
                              >
                                {member.linkedin && (
                                  <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-full border border-[#B1A490]/40 flex items-center justify-center hover:bg-[#B1A490] hover:border-[#B1A490] transition-colors duration-250"
                                  >
                                    <Linkedin size={14} className="text-[#B1A490] group-hover:text-white" />
                                  </a>
                                )}
                                {member.email && (
                                  <a
                                    href={`mailto:${member.email}`}
                                    className="w-9 h-9 rounded-full border border-[#B1A490]/40 flex items-center justify-center hover:bg-[#B1A490] hover:border-[#B1A490] transition-colors duration-250"
                                  >
                                    <Mail size={14} className="text-[#B1A490]" />
                                  </a>
                                )}
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Info bar */}
                    <div className="px-5 py-5 flex items-center justify-between">
                      <div>
                        <p
                          className="font-[var(--font-playfair)] italic text-white"
                          style={{ fontSize: 'clamp(15px, 1.3vw, 19px)' }}
                        >
                          {member.nameEn}
                        </p>
                        <p
                          className="font-[var(--font-libre-franklin)] text-[#B1A490] uppercase mt-1"
                          style={{ fontSize: '10px', letterSpacing: '2px' }}
                        >
                          {member.roleEn}
                        </p>
                      </div>
                      <span
                        className="font-[var(--font-libre-franklin)] text-white/15 tabular-nums"
                        style={{ fontSize: '11px' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ══════════════════ JOIN CTA ══════════════════ */}
      <section
        data-navbar-dark
        className="w-full overflow-hidden"
        style={{ background: '#F5F0EB' }}
      >
        <div className="max-w-[1380px] mx-auto px-[clamp(1.5rem,6vw,8rem)] py-[clamp(5rem,9vw,12rem)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-7 h-px bg-[#B1A490]" />
                <span className="font-[var(--font-libre-franklin)] text-[10px] text-[#B1A490] uppercase tracking-[3px]">
                  Join Our Vision
                </span>
              </div>
              <h2
                className="font-[var(--font-playfair)] italic font-normal text-[#181C23] leading-[1.1]"
                style={{ fontSize: 'clamp(30px, 4vw, 58px)', maxWidth: '560px' }}
              >
                Be Part of Something Extraordinary
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.15 }}
              className="lg:max-w-[380px]"
            >
              <p
                className="font-[var(--font-libre-franklin)] text-[#5A5855] leading-[1.85] mb-9"
                style={{ fontSize: '14px' }}
              >
                We are always seeking passionate, driven individuals who share our commitment to design excellence and architectural innovation.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4"
              >
                <span
                  className="inline-flex items-center justify-center border border-[#181C23] px-9 py-4 rounded-full font-[var(--font-libre-franklin)] text-[11px] text-[#181C23] uppercase tracking-[2.5px] group-hover:bg-[#181C23] group-hover:text-white transition-all duration-400"
                >
                  Get in Touch
                </span>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
