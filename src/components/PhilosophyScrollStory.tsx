'use client'

import { useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import Image from 'next/image'

const EASE = [0.25, 0.4, 0.25, 1] as [number, number, number, number]

const chapters = [
  {
    num: '01',
    act: 'The Reach',
    subtitle:
      'Architecture touches everyone — not just those who seek it. Unlike a painting in a gallery, the built environment is an experience no one can opt out of.',
    image: '/images/philosophy/diagram-01.jpg',
  },
  {
    num: '02',
    act: 'The Space',
    subtitle:
      'More than 90% of our lives unfold inside buildings. Architecture directs the rhythm of cities and shapes psychological well-being for everyone.',
    image: '/images/philosophy/diagram-02.jpg',
  },
  {
    num: '03',
    act: 'The Mind',
    subtitle:
      'The built environment and nature converge to form the lens through which we perceive the world. Architecture is not backdrop — it is cause.',
    image: '/images/philosophy/diagram-03.jpg',
  },
  {
    num: '04',
    act: 'The Bond',
    subtitle:
      'Our Values Trilogy: human spiritual and material needs, environmental measures, and cultural identity — three forces united in every project we create.',
    image: '/images/philosophy/diagram-04.jpg',
  },
  {
    num: '05',
    act: 'The Solution',
    subtitle:
      'Nature, Human Values, and Art converge through design into innovative outcomes: Sustainability, Creativity, Uniqueness, and Resilience.',
    image: '/images/philosophy/diagram-05.jpg',
  },
]

// ── Desktop chapter panel ──────────────────────────────────────────
function ChapterPanel({
  chapter,
  isActive,
}: {
  chapter: (typeof chapters)[number]
  index: number
  isActive: boolean
}) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Watermark chapter number */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-1%',
          bottom: '-8%',
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(14rem, 26vw, 24rem)',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.02)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        {chapter.num}
      </div>

      {/* Left — text */}
      <motion.div
        animate={{ x: isActive ? 0 : 28, opacity: isActive ? 1 : 0.35 }}
        transition={{ duration: 0.75, ease: EASE }}
        style={{
          width: '38%',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 3% 0 6%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 22, height: 1, background: '#B1A490', opacity: 0.65 }} />
          <span
            style={{
              fontFamily: 'var(--font-libre-franklin)',
              fontSize: 10,
              color: '#B1A490',
              letterSpacing: '5px',
              textTransform: 'uppercase',
            }}
          >
            Chapter {chapter.num}
          </span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2.2rem, 3.2vw, 3.4rem)',
            fontStyle: 'italic',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.08,
            marginBottom: '1rem',
          }}
        >
          {chapter.act}
        </h3>

        <div
          style={{
            width: 40,
            height: 2,
            background: 'linear-gradient(to right, #B1A490, transparent)',
            marginBottom: '1.2rem',
          }}
        />

        <p
          style={{
            fontFamily: 'var(--font-merriweather)',
            fontSize: 'clamp(0.82rem, 1.1vw, 0.96rem)',
            color: 'rgba(255,255,255,0.52)',
            lineHeight: 1.95,
            maxWidth: 380,
          }}
        >
          {chapter.subtitle}
        </p>
      </motion.div>

      {/* Vertical divider */}
      <div
        style={{
          width: 1,
          flexShrink: 0,
          background:
            'linear-gradient(to bottom, transparent, rgba(177,164,144,0.14) 25%, rgba(177,164,144,0.14) 75%, transparent)',
          zIndex: 1,
        }}
      />

      {/* Right — diagram card (scale only, no opacity to avoid grey blending) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4% 5% 4% 4%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{ scale: isActive ? 1.0 : 0.88 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 16px 50px rgba(0,0,0,0.32), 0 0 0 1px rgba(177,164,144,0.12)',
            position: 'relative',
            width: '100%',
            maxWidth: 860,
          }}
        >
          {/* Gold top border */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: 2,
              background: 'linear-gradient(to right, transparent, #B1A490 20%, #B1A490 80%, transparent)',
              zIndex: 10,
            }}
          />

          {/* White diagram area */}
          <div style={{ background: '#ffffff', padding: 'clamp(1.2rem, 3vw, 2.5rem)' }}>
            <Image
              src={chapter.image}
              alt={chapter.act}
              width={1100}
              height={750}
              style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
              unoptimized
            />
          </div>

          {/* Dark caption bar */}
          <div
            style={{
              background: '#0D1018',
              padding: '0.6rem 1.6rem',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div style={{ width: 16, height: 1, background: 'rgba(177,164,144,0.5)', flexShrink: 0 }} />
            <span
              style={{
                fontFamily: 'var(--font-libre-franklin)',
                fontSize: 9,
                color: 'rgba(177,164,144,0.6)',
                letterSpacing: '3px',
                textTransform: 'uppercase',
              }}
            >
              Criteria Designs · {chapter.act}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ── Mobile chapter block ──────────────────────────────────────────
function MobileChapterBlock({ chapter }: { chapter: (typeof chapters)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div ref={ref} style={{ padding: '0 1.25rem 4rem' }}>
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}
      >
        <div style={{ width: 18, height: 1, background: '#B1A490', opacity: 0.65 }} />
        <span
          style={{
            fontFamily: 'var(--font-libre-franklin)',
            fontSize: 10,
            color: '#B1A490',
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}
        >
          Chapter {chapter.num}
        </span>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(1.9rem, 7vw, 2.6rem)',
          fontStyle: 'italic',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.1,
          marginBottom: '0.9rem',
        }}
      >
        {chapter.act}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
        style={{
          fontFamily: 'var(--font-merriweather)',
          fontSize: '0.88rem',
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.9,
          marginBottom: '1.5rem',
        }}
      >
        {chapter.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, delay: 0.22, ease: EASE }}
        style={{
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(177,164,144,0.1)',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, #B1A490 25%, #B1A490 75%, transparent)', zIndex: 10 }} />
        <div style={{ background: '#ffffff', padding: '1.2rem' }}>
          <Image src={chapter.image} alt={chapter.act} width={1100} height={750} style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} unoptimized />
        </div>
        <div style={{ background: '#0D1018', padding: '0.55rem 1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 14, height: 1, background: 'rgba(177,164,144,0.5)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-libre-franklin)', fontSize: 9, color: 'rgba(177,164,144,0.6)', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
            {chapter.act}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────
export default function PhilosophyScrollStory() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const reduce     = useReducedMotion()
  const [activeIdx, setActiveIdx] = useState(0)

  const { scrollYProgress } = useScroll({ target: sectionRef })

  // Smooth linear track — runs entirely on compositor, zero React re-renders
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-80%'])

  // Only update dots (cheap state, not tied to transform path)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const thresholds = [0.15, 0.35, 0.55, 0.75]
    let idx = 0
    for (const t of thresholds) { if (v >= t) idx++ }
    setActiveIdx(idx)
  })

  return (
    <>
      {/* ── Desktop: horizontal scroll ───────────── */}
      <div
        ref={sectionRef}
        className="hidden md:block"
        style={{ height: '500vh', background: '#181C23', borderTop: '1px solid rgba(177,164,144,0.07)' }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            background: '#181C23',
          }}
        >
          {/* Top label */}
          <div
            style={{
              position: 'absolute',
              top: 26,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ width: 26, height: 1, background: 'rgba(177,164,144,0.35)' }} />
            <span
              style={{
                fontFamily: 'var(--font-libre-franklin)',
                fontSize: 10,
                color: 'rgba(177,164,144,0.65)',
                letterSpacing: '5px',
                textTransform: 'uppercase',
              }}
            >
              Why Architecture Matters
            </span>
            <div style={{ width: 26, height: 1, background: 'rgba(177,164,144,0.35)' }} />
          </div>

          {/* Horizontal track */}
          <motion.div
            style={{
              x: reduce ? 0 : x,
              display: 'flex',
              width: '500vw',
              height: '100%',
              willChange: 'transform',
            }}
          >
            {chapters.map((chapter, i) => (
              <ChapterPanel
                key={chapter.num}
                chapter={chapter}
                index={i}
                isActive={activeIdx === i}
              />
            ))}
          </motion.div>

          {/* Progress dots */}
          <div
            style={{
              position: 'absolute',
              bottom: 30,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 10,
              zIndex: 20,
            }}
          >
            {chapters.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: i === activeIdx ? '#B1A490' : 'transparent',
                  borderColor: i === activeIdx ? '#B1A490' : 'rgba(177,164,144,0.3)',
                  scale: i === activeIdx ? 1.4 : 1,
                }}
                transition={{ duration: 0.35 }}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  border: '1px solid rgba(177,164,144,0.3)',
                }}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <motion.div
            animate={{ opacity: activeIdx >= 4 ? 0 : 0.45 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              bottom: 28,
              right: 44,
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-libre-franklin)',
                fontSize: 9,
                color: '#B1A490',
                letterSpacing: '3px',
                textTransform: 'uppercase',
              }}
            >
              scroll
            </span>
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
              <path d="M5 1v12M1 9l4 4 4-4" stroke="#B1A490" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* ── Mobile: vertical stack ────────────────── */}
      <section
        className="md:hidden"
        style={{
          background: '#181C23',
          borderTop: '1px solid rgba(177,164,144,0.07)',
          paddingTop: '3.5rem',
        }}
      >
        <div style={{ textAlign: 'center', padding: '0 1.5rem 3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 24, height: 1, background: 'rgba(177,164,144,0.4)' }} />
            <span style={{ fontFamily: 'var(--font-libre-franklin)', fontSize: 10, color: '#B1A490', letterSpacing: '5px', textTransform: 'uppercase' }}>
              The Evidence
            </span>
            <div style={{ width: 24, height: 1, background: 'rgba(177,164,144,0.4)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 8vw, 3rem)', fontStyle: 'italic', fontWeight: 700, color: '#ffffff', lineHeight: 1.1 }}>
            Why Architecture Matters
          </h2>
        </div>
        {chapters.map((chapter) => (
          <MobileChapterBlock key={chapter.num} chapter={chapter} />
        ))}
        <div style={{ height: '3rem' }} />
      </section>
    </>
  )
}
