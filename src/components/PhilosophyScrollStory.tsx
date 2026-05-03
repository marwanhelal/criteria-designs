'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
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
      'More than 90% of our lives unfold inside buildings. Architecture directs the rhythm of cities, shapes psychological well-being, and frames daily life for everyone.',
    image: '/images/philosophy/diagram-02.jpg',
  },
  {
    num: '03',
    act: 'The Mind',
    subtitle:
      'The built environment and nature converge to form the lens through which we perceive and understand the world. Architecture is not backdrop — it is cause.',
    image: '/images/philosophy/diagram-03.jpg',
  },
  {
    num: '04',
    act: 'The Bond',
    subtitle:
      'Our Values Trilogy: human spiritual and material needs, environmental measures, and cultural identity — three forces united in every project we undertake.',
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

// ── Scene ─────────────────────────────────────────────────────────
function SceneBlock({
  chapter,
  index,
}: {
  chapter: (typeof chapters)[number]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.18 })
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Three depth layers — different scroll speeds
  const numYRaw  = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])
  const textYRaw = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const cardYRaw = useTransform(scrollYProgress, [0, 1], ['-4%',  '4%'])
  const scaleRaw = useTransform(scrollYProgress, [0.08, 0.55], [0.93, 1.01])

  const numY  = reduce ? undefined : numYRaw
  const textY = reduce ? undefined : textYRaw
  const cardY = reduce ? undefined : cardYRaw
  const cardScale = reduce ? undefined : scaleRaw

  const dur = reduce ? 0 : 1

  const isEven = index % 2 === 0

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden py-20 px-6 md:px-16"
      style={{ minHeight: '100vh' }}
    >
      {/* Watermark chapter number — fastest parallax */}
      <motion.div
        aria-hidden="true"
        style={{
          y: numY,
          position: 'absolute',
          [isEven ? 'right' : 'left']: '-1%',
          bottom: '-10%',
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(12rem, 28vw, 26rem)',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.022)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {chapter.num}
      </motion.div>

      {/* Vertical gold accent line */}
      <motion.div
        aria-hidden="true"
        style={{
          y: numY,
          position: 'absolute',
          [isEven ? 'left' : 'right']: '4%',
          top: 0,
          bottom: 0,
          width: 1,
          background:
            'linear-gradient(to bottom, transparent, rgba(177,164,144,0.22) 30%, rgba(177,164,144,0.22) 70%, transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-[1020px] mx-auto">

        {/* Text layer — mid speed */}
        <motion.div style={{ y: textY }}>

          {/* Chapter label */}
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: dur * 0.7, ease: EASE }}
            className="flex items-center gap-3 mb-4"
          >
            <div style={{ width: 28, height: 1, background: '#B1A490', opacity: 0.7 }} />
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
          </motion.div>

          {/* Act title */}
          <motion.h3
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: dur * 0.9, delay: dur * 0.1, ease: EASE }}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '0.75rem',
            }}
          >
            {chapter.act}
          </motion.h3>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: dur * 0.9, delay: dur * 0.2, ease: EASE }}
            style={{
              fontFamily: 'var(--font-merriweather)',
              fontSize: 'clamp(0.83rem, 1.4vw, 0.97rem)',
              color: 'rgba(255,255,255,0.48)',
              lineHeight: 1.95,
              maxWidth: 520,
              marginBottom: '2rem',
            }}
          >
            {chapter.subtitle}
          </motion.p>

        </motion.div>

        {/* Card layer — slowest parallax */}
        <motion.div style={{ y: cardY }}>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: dur * 1.1, delay: dur * 0.25, ease: EASE }}
          >
            <motion.div
              style={{
                scale: cardScale,
                borderRadius: 18,
                overflow: 'hidden',
                position: 'relative',
                boxShadow:
                  '0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(177,164,144,0.1)',
              }}
            >
              {/* Gold top border */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background:
                    'linear-gradient(to right, transparent, #B1A490 20%, #B1A490 80%, transparent)',
                  zIndex: 10,
                }}
              />

              {/* White diagram area */}
              <div style={{ background: '#ffffff', padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
                <Image
                  src={chapter.image}
                  alt={chapter.act}
                  width={1100}
                  height={750}
                  className="w-full h-auto block"
                  style={{ objectFit: 'contain' }}
                  unoptimized
                />
              </div>

              {/* Dark caption bar */}
              <div
                style={{
                  background: '#0D1018',
                  padding: '0.7rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 1,
                    background: 'rgba(177,164,144,0.55)',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-libre-franklin)',
                    fontSize: 9,
                    color: 'rgba(177,164,144,0.65)',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                  }}
                >
                  Criteria Designs · Philosophy · {chapter.act}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────
export default function PhilosophyScrollStory() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(sectionRef, { once: true, amount: 0.08 })
  const reduce = useReducedMotion()
  const dur = reduce ? 0 : 1

  return (
    <section
      ref={sectionRef}
      className="bg-[#181C23] relative overflow-hidden"
      style={{ borderTop: '1px solid rgba(177,164,144,0.07)' }}
    >

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: dur * 0.8, ease: EASE }}
        className="text-center pt-24 pb-4 px-8"
      >
        <div className="flex items-center justify-center gap-4 mb-5">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: dur * 0.7, delay: dur * 0.2 }}
            className="w-10 h-px origin-right"
            style={{ background: '#B1A490' }}
          />
          <span
            style={{
              fontFamily: 'var(--font-libre-franklin)',
              fontSize: 11,
              color: '#B1A490',
              textTransform: 'uppercase',
              letterSpacing: '6px',
            }}
          >
            The Evidence
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: dur * 0.7, delay: dur * 0.2 }}
            className="w-10 h-px origin-left"
            style={{ background: '#B1A490' }}
          />
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
            fontStyle: 'italic',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.05,
          }}
        >
          Why Architecture Matters
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-merriweather)',
            fontSize: 'clamp(0.85rem, 1.4vw, 0.97rem)',
            color: 'rgba(255,255,255,0.38)',
            marginTop: '1rem',
            maxWidth: 460,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.95,
          }}
        >
          Five chapters. The evidence behind our philosophy.
        </p>
      </motion.div>

      {/* Chapter scenes */}
      {chapters.map((chapter, i) => (
        <SceneBlock key={chapter.num} chapter={chapter} index={i} />
      ))}

      {/* Closing separator */}
      <div className="pb-20 flex justify-center">
        <div
          style={{
            width: 100,
            height: 1,
            background:
              'linear-gradient(to right, transparent, rgba(177,164,144,0.3), transparent)',
          }}
        />
      </div>

    </section>
  )
}
