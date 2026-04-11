'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion, useInView } from 'framer-motion'

interface PhilosophyData {
  heroTitle: string
  heroSubtitle: string
  introText: string
  humanTitle: string
  humanDescription: string
  humanImage: string | null
  envTitle: string
  envDescription: string
  envImage: string | null
  cultureTitle: string
  cultureDescription: string
  cultureImage: string | null
  diagramNature: string
  diagramHumanValues: string
  diagramArts: string
  diagramDesign: string
  diagramInnovative: string
  solution1: string
  solution2: string
  solution3: string
  outcome1: string
  outcome2: string
}

const DEFAULTS: PhilosophyData = {
  heroTitle: 'Our Philosophy',
  heroSubtitle: 'what we believe in',
  introText: 'Constructional and architectural products constitute the periphery to all human activities as well as being one of the main effective optical components to the surrounding environment leading to being the most effective element to human efficiency.',
  humanTitle: 'HUMAN',
  humanDescription: 'human basic spiritual and materialistic needs such as artistic and practical ones.',
  humanImage: null,
  envTitle: 'ENVIRONMENTAL',
  envDescription: 'as well as environmental measures such as weather, geography and energy.',
  envImage: null,
  cultureTitle: 'CULTURE',
  cultureDescription: 'and finally cultural values such as social and economic ones.',
  cultureImage: null,
  diagramNature: 'Nature',
  diagramHumanValues: 'Human Values',
  diagramArts: 'Arts',
  diagramDesign: 'Design',
  diagramInnovative: 'Innovative Solutions',
  solution1: 'Sustainability',
  solution2: 'Creativity',
  solution3: 'Uniqueness',
  outcome1: 'Happiness',
  outcome2: 'Resilience',
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease } }),
}

// ── Triangle diagram (Section 1 right side) ───────────────────────────────────
function TriangleDiagram({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 220 200" className="w-full max-w-[240px]" fill="none">
      {/* Dashed connecting lines */}
      <motion.line x1="110" y1="50" x2="50" y2="155"
        stroke="#6B9E6B" strokeWidth="1.2" strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease }} />
      <motion.line x1="110" y1="50" x2="170" y2="155"
        stroke="#6B9E6B" strokeWidth="1.2" strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.35, ease }} />
      <motion.line x1="50" y1="155" x2="170" y2="155"
        stroke="#6B9E6B" strokeWidth="1.2" strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5, ease }} />

      {/* Top node — Human (gold) */}
      <motion.circle cx="110" cy="42" r="28"
        fill="#F5F0E8" stroke="#D4A843" strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease }} />
      {/* Head */}
      <circle cx="110" cy="34" r="8" stroke="#D4A843" strokeWidth="1.5" fill="none" />
      {/* Body arc */}
      <path d="M96 58 Q110 50 124 58" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Bottom-left node — Building/Architecture (green) */}
      <motion.circle cx="50" cy="160" r="26"
        fill="#EBF3EB" stroke="#6B9E6B" strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3, ease }} />
      {/* Building */}
      <rect x="38" y="150" width="24" height="18" stroke="#6B9E6B" strokeWidth="1.2" fill="none" rx="0.5" />
      <line x1="38" y1="155" x2="62" y2="155" stroke="#6B9E6B" strokeWidth="0.8" />
      <line x1="38" y1="160" x2="62" y2="160" stroke="#6B9E6B" strokeWidth="0.8" />
      <line x1="38" y1="165" x2="62" y2="165" stroke="#6B9E6B" strokeWidth="0.8" />
      <path d="M32 150 L50 138 L68 150" stroke="#6B9E6B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Bottom-right node — Tree/Nature (green) */}
      <motion.circle cx="170" cy="160" r="26"
        fill="#EBF3EB" stroke="#6B9E6B" strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5, ease }} />
      {/* Tree trunk */}
      <line x1="170" y1="175" x2="170" y2="160" stroke="#6B9E6B" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tree leaves */}
      <path d="M170 160 C170 160 160 152 162 144 C164 136 178 136 178 144 C180 152 170 160 170 160Z" stroke="#6B9E6B" strokeWidth="1.2" fill="none" />
      <line x1="158" y1="172" x2="182" y2="172" stroke="#6B9E6B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ── Human icon (large, gold/amber) ────────────────────────────────────────────
function HumanIcon({ inView, customImage }: { inView: boolean; customImage: string | null }) {
  if (customImage) return <img src={customImage} alt="Human" className="w-24 h-24 object-contain" />
  return (
    <svg viewBox="0 0 100 110" className="w-24 h-auto" fill="none">
      {/* Speech bubble body */}
      <motion.path
        d="M15 10 Q10 10 10 20 L10 75 Q10 85 20 85 L42 85 L50 98 L58 85 L80 85 Q90 85 90 75 L90 20 Q90 10 85 10 Z"
        fill="#F5CC5A" stroke="#D4A843" strokeWidth="1"
        initial={{ opacity: 0, scale: 0.7 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease }}
      />
      {/* Head */}
      <motion.circle cx="50" cy="38" r="14"
        fill="#D4A843"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.3, ease }}
      />
      {/* Shoulders */}
      <motion.path d="M26 78 Q50 60 74 78"
        stroke="#D4A843" strokeWidth="3" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4, ease }}
      />
    </svg>
  )
}

// ── Environmental icon (trees, green) ────────────────────────────────────────
function EnvIcon({ inView, customImage }: { inView: boolean; customImage: string | null }) {
  if (customImage) return <img src={customImage} alt="Environmental" className="w-24 h-24 object-contain" />
  const trees = [
    { x: 25, h: 45, w: 8 },
    { x: 38, h: 60, w: 10 },
    { x: 52, h: 72, w: 12 },
    { x: 67, h: 58, w: 10 },
    { x: 80, h: 42, w: 8 },
  ]
  return (
    <svg viewBox="0 0 105 100" className="w-24 h-auto" fill="none">
      {trees.map((t, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, scaleY: 0 }} animate={inView ? { opacity: 1, scaleY: 1 } : {}}
          style={{ originY: '100%' }}
          transition={{ duration: 0.5, delay: 0.1 * i, ease }}>
          {/* Trunk */}
          <line x1={t.x + t.w / 2} y1="90" x2={t.x + t.w / 2} y2={90 - t.h * 0.3}
            stroke="#5B8A5B" strokeWidth="2" strokeLinecap="round" />
          {/* Leaves - multiple layers */}
          <path d={`M${t.x} ${90 - t.h * 0.35} L${t.x + t.w / 2} ${90 - t.h} L${t.x + t.w} ${90 - t.h * 0.35} Z`}
            fill="#6BAA6B" stroke="#4A7A4A" strokeWidth="0.5" />
          <path d={`M${t.x + 1} ${90 - t.h * 0.55} L${t.x + t.w / 2} ${90 - t.h * 1.25} L${t.x + t.w - 1} ${90 - t.h * 0.55} Z`}
            fill="#7CBB7C" stroke="#4A7A4A" strokeWidth="0.5" />
          <path d={`M${t.x + 2} ${90 - t.h * 0.75} L${t.x + t.w / 2} ${90 - t.h * 1.5} L${t.x + t.w - 2} ${90 - t.h * 0.75} Z`}
            fill="#8EC88E" stroke="#4A7A4A" strokeWidth="0.5" />
          {/* Ground line */}
          <line x1={t.x - 2} y1="90" x2={t.x + t.w + 2} y2="90"
            stroke="#5B8A5B" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
      ))}
    </svg>
  )
}

// ── Culture icon (building, gold-green) ───────────────────────────────────────
function CultureIcon({ inView, customImage }: { inView: boolean; customImage: string | null }) {
  if (customImage) return <img src={customImage} alt="Culture" className="w-24 h-24 object-contain" />
  return (
    <svg viewBox="0 0 80 100" className="w-20 h-auto" fill="none">
      {/* Main tower */}
      <motion.rect x="20" y="20" width="40" height="75" rx="1"
        fill="#A8C89A" stroke="#6B9E6B" strokeWidth="1.2"
        initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease }}
      />
      {/* Roof triangle */}
      <motion.path d="M12 22 L40 4 L68 22"
        stroke="#6B9E6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3, ease }}
      />
      {/* Window rows */}
      {[30, 42, 54, 66].map((y, i) => (
        <motion.g key={y}
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.4 + i * 0.08, ease }}>
          <rect x="25" y={y} width="7" height="7" rx="0.5" fill="#D4A843" opacity="0.8" />
          <rect x="37" y={y} width="7" height="7" rx="0.5" fill="#D4A843" opacity="0.8" />
          <rect x="49" y={y} width="7" height="7" rx="0.5" fill="#D4A843" opacity="0.8" />
        </motion.g>
      ))}
      {/* Door */}
      <rect x="33" y="78" width="14" height="17" rx="1" fill="#5B7A5B" />
    </svg>
  )
}

// ── Section 3 — Node Diagram ──────────────────────────────────────────────────
function NodeDiagram({ d, inView }: { d: PhilosophyData; inView: boolean }) {
  // Layout constants (viewBox 0 0 700 280)
  const NODE_COLOR = '#4A8C7A'
  const LINE_COLOR = '#4A8C7A'
  const TEXT_COLOR = '#333'

  return (
    <svg viewBox="0 0 700 280" className="w-full" fill="none">
      {/* ── Lines first (drawn with animation) ── */}

      {/* Nature → Design */}
      <motion.line x1="95" y1="148" x2="178" y2="148"
        stroke={LINE_COLOR} strokeWidth="1.5" markerEnd="url(#arrow)"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1, ease }} />

      {/* Human Values → Design */}
      <motion.line x1="223" y1="80" x2="223" y2="122"
        stroke={LINE_COLOR} strokeWidth="1.2"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.3, ease }} />

      {/* Arts → Design */}
      <motion.line x1="223" y1="218" x2="223" y2="175"
        stroke={LINE_COLOR} strokeWidth="1.2"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.35, ease }} />

      {/* Design → Innovative Solutions (dashed) */}
      <motion.line x1="268" y1="148" x2="340" y2="148"
        stroke={LINE_COLOR} strokeWidth="1.2" strokeDasharray="5 3"
        markerEnd="url(#arrow)"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5, ease }} />

      {/* Innovative Solutions → Lightbulb */}
      <motion.line x1="397" y1="148" x2="432" y2="148"
        stroke={LINE_COLOR} strokeWidth="1.5" markerEnd="url(#arrow)"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.65, ease }} />

      {/* Lightbulb → Sustainability */}
      <motion.line x1="468" y1="138" x2="510" y2="108"
        stroke={LINE_COLOR} strokeWidth="1.2" markerEnd="url(#arrow)"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.75, ease }} />

      {/* Lightbulb → Creativity */}
      <motion.line x1="470" y1="148" x2="510" y2="148"
        stroke={LINE_COLOR} strokeWidth="1.2" markerEnd="url(#arrow)"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.8, ease }} />

      {/* Lightbulb → Uniqueness */}
      <motion.line x1="468" y1="158" x2="510" y2="188"
        stroke={LINE_COLOR} strokeWidth="1.2" markerEnd="url(#arrow)"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.85, ease }} />

      {/* Sustainability → Happiness */}
      <motion.line x1="580" y1="100" x2="618" y2="88"
        stroke={LINE_COLOR} strokeWidth="1.2"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.95, ease }} />

      {/* Uniqueness → Resilience */}
      <motion.line x1="580" y1="196" x2="618" y2="208"
        stroke={LINE_COLOR} strokeWidth="1.2"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.4, delay: 1, ease }} />

      {/* Arrowhead marker */}
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill={LINE_COLOR} />
        </marker>
      </defs>

      {/* ── Nodes ── */}

      {/* Nature */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
        style={{ transformOrigin: '50px 148px' }} transition={{ duration: 0.4, ease }}>
        <circle cx="50" cy="148" r="28" stroke={NODE_COLOR} strokeWidth="1.5" fill="#EBF5F0" />
        {/* Tree icon */}
        <line x1="50" y1="168" x2="50" y2="154" stroke={NODE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50 154 C50 154 41 147 43 139 C45 131 57 131 57 139 C59 147 50 154 50 154Z" stroke={NODE_COLOR} strokeWidth="1.2" fill="none" />
        <line x1="42" y1="166" x2="58" y2="166" stroke={NODE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <text x="50" y="188" textAnchor="middle" fontSize="10" fill={TEXT_COLOR} fontFamily="sans-serif">{d.diagramNature}</text>
      </motion.g>

      {/* Human Values */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
        style={{ transformOrigin: '223px 60px' }} transition={{ duration: 0.4, delay: 0.2, ease }}>
        <circle cx="223" cy="60" r="22" stroke={NODE_COLOR} strokeWidth="1.5" fill="#EBF5F0" />
        {/* Clock/compass icon */}
        <circle cx="223" cy="60" r="10" stroke={NODE_COLOR} strokeWidth="1.2" fill="none" />
        <line x1="223" y1="54" x2="223" y2="60" stroke={NODE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="223" y1="60" x2="228" y2="63" stroke={NODE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
        <text x="223" y="95" textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontFamily="sans-serif">{d.diagramHumanValues.split(' ').map((w, i) =>
          `${w}${i === 0 && d.diagramHumanValues.includes(' ') ? '\n' : ''}`
        ).join('')}</text>
        <text x="223" y="95" textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontFamily="sans-serif">
          <tspan x="223" dy="0">{d.diagramHumanValues.split(' ')[0]}</tspan>
          {d.diagramHumanValues.split(' ').length > 1 && (
            <tspan x="223" dy="12">{d.diagramHumanValues.split(' ').slice(1).join(' ')}</tspan>
          )}
        </text>
      </motion.g>

      {/* Design (larger central node) */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
        style={{ transformOrigin: '223px 148px' }} transition={{ duration: 0.5, delay: 0.25, ease }}>
        <circle cx="223" cy="148" r="30" stroke={NODE_COLOR} strokeWidth="2" fill="#D8EDE6" />
        {/* Building icon */}
        <rect x="213" y="136" width="20" height="22" stroke={NODE_COLOR} strokeWidth="1.2" fill="none" rx="0.5" />
        <path d="M209 138 L223 128 L237 138" stroke={NODE_COLOR} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="218" y1="140" x2="222" y2="140" stroke={NODE_COLOR} strokeWidth="0.8" />
        <line x1="218" y1="145" x2="222" y2="145" stroke={NODE_COLOR} strokeWidth="0.8" />
        <line x1="224" y1="140" x2="228" y2="140" stroke={NODE_COLOR} strokeWidth="0.8" />
        <line x1="224" y1="145" x2="228" y2="145" stroke={NODE_COLOR} strokeWidth="0.8" />
        <text x="223" y="192" textAnchor="middle" fontSize="11" fontWeight="600" fill={TEXT_COLOR} fontFamily="sans-serif">{d.diagramDesign}</text>
      </motion.g>

      {/* Arts */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
        style={{ transformOrigin: '223px 228px' }} transition={{ duration: 0.4, delay: 0.3, ease }}>
        <circle cx="223" cy="228" r="22" stroke={NODE_COLOR} strokeWidth="1.5" fill="#EBF5F0" />
        {/* Decorative arts icon (star/flower) */}
        <circle cx="223" cy="228" r="8" stroke={NODE_COLOR} strokeWidth="1.2" fill="none" />
        <path d="M223 218 L225 225 L223 228 L221 225 Z" fill={NODE_COLOR} opacity="0.5" />
        <path d="M233 228 L226 226 L223 228 L226 230 Z" fill={NODE_COLOR} opacity="0.5" />
        <path d="M223 238 L221 231 L223 228 L225 231 Z" fill={NODE_COLOR} opacity="0.5" />
        <path d="M213 228 L220 230 L223 228 L220 226 Z" fill={NODE_COLOR} opacity="0.5" />
        <text x="223" y="262" textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontFamily="sans-serif">{d.diagramArts}</text>
      </motion.g>

      {/* Innovative Solutions label */}
      <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.55, ease }}>
        <text x="368" y="142" textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontFamily="sans-serif">{d.diagramInnovative.split(' ')[0]}</text>
        <text x="368" y="154" textAnchor="middle" fontSize="9" fill={TEXT_COLOR} fontFamily="sans-serif">{d.diagramInnovative.split(' ').slice(1).join(' ')}</text>
      </motion.g>

      {/* Lightbulb node */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
        style={{ transformOrigin: '450px 148px' }} transition={{ duration: 0.4, delay: 0.7, ease }}>
        <circle cx="450" cy="148" r="22" stroke={NODE_COLOR} strokeWidth="1.5" fill="#EBF5F0" />
        {/* Lightbulb icon */}
        <path d="M450 138 C445 138 441 142 441 147 C441 151 443 154 446 156 L446 160 L454 160 L454 156 C457 154 459 151 459 147 C459 142 455 138 450 138Z"
          stroke={NODE_COLOR} strokeWidth="1.2" fill="none" />
        <line x1="446" y1="162" x2="454" y2="162" stroke={NODE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="447" y1="165" x2="453" y2="165" stroke={NODE_COLOR} strokeWidth="1.2" strokeLinecap="round" />
      </motion.g>

      {/* Sustainability */}
      <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.8, ease }}>
        <text x="545" y="105" textAnchor="start" fontSize="10" fill={TEXT_COLOR} fontFamily="sans-serif" fontWeight="500">{d.solution1}</text>
      </motion.g>

      {/* Creativity */}
      <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.85, ease }}>
        <text x="545" y="152" textAnchor="start" fontSize="10" fill={TEXT_COLOR} fontFamily="sans-serif" fontWeight="500">{d.solution2}</text>
      </motion.g>

      {/* Uniqueness */}
      <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.9, ease }}>
        <text x="545" y="198" textAnchor="start" fontSize="10" fill={TEXT_COLOR} fontFamily="sans-serif" fontWeight="500">{d.solution3}</text>
      </motion.g>

      {/* Happiness node */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
        style={{ transformOrigin: '638px 80px' }} transition={{ duration: 0.4, delay: 1, ease }}>
        <circle cx="638" cy="80" r="22" stroke={NODE_COLOR} strokeWidth="1.5" fill="#EBF5F0" />
        {/* Person icon */}
        <circle cx="638" cy="72" r="6" stroke={NODE_COLOR} strokeWidth="1.2" fill="none" />
        <path d="M628 92 Q638 84 648 92" stroke={NODE_COLOR} strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <text x="638" y="114" textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontFamily="sans-serif">{d.outcome1}</text>
      </motion.g>

      {/* Resilience node */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
        style={{ transformOrigin: '638px 215px' }} transition={{ duration: 0.4, delay: 1.05, ease }}>
        <circle cx="638" cy="215" r="22" stroke={NODE_COLOR} strokeWidth="1.5" fill="#EBF5F0" />
        {/* Tree icon */}
        <line x1="638" y1="230" x2="638" y2="218" stroke={NODE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M638 218 C638 218 630 211 632 204 C634 197 644 197 644 204 C646 211 638 218 638 218Z" stroke={NODE_COLOR} strokeWidth="1.2" fill="none" />
        <line x1="631" y1="227" x2="645" y2="227" stroke={NODE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
        <text x="638" y="250" textAnchor="middle" fontSize="9.5" fill={TEXT_COLOR} fontFamily="sans-serif">{d.outcome2}</text>
      </motion.g>
    </svg>
  )
}

export default function PhilosophyPage() {
  const [data, setData] = useState<PhilosophyData>(DEFAULTS)

  useEffect(() => {
    fetch('/api/philosophy')
      .then(r => r.ok ? r.json() : DEFAULTS)
      .then((d: Partial<PhilosophyData>) => setData({ ...DEFAULTS, ...d }))
      .catch(() => {})
  }, [])

  const sec1Ref = useRef(null)
  const sec2Ref = useRef(null)
  const sec3Ref = useRef(null)
  const sec1In  = useInView(sec1Ref,  { once: true, margin: '-60px' })
  const sec2In  = useInView(sec2Ref,  { once: true, margin: '-60px' })
  const sec3In  = useInView(sec3Ref,  { once: true, margin: '-60px' })

  return (
    <div className="bg-white">
      <Navbar />

      {/* ═══════════════════════════════════════════════════
          SECTION 1 — Our Philosophy / Intro + Triangle diagram
      ═══════════════════════════════════════════════════ */}
      <section ref={sec1Ref} className="pt-[var(--nav-h)] border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-14 grid md:grid-cols-[1fr_auto] gap-10 items-start">

          {/* Left: text */}
          <div>
            <motion.h1
              variants={fadeUp} initial="hidden" animate={sec1In ? 'show' : 'hidden'} custom={0}
              className="font-[var(--font-franklin-gothic)] text-5xl md:text-6xl font-bold text-[#181C23] leading-tight mb-1"
            >
              {data.heroTitle}
            </motion.h1>
            <motion.p
              variants={fadeUp} initial="hidden" animate={sec1In ? 'show' : 'hidden'} custom={1}
              className="text-[#4A7A4A] font-[var(--font-open-sans)] text-lg font-semibold italic mb-6"
            >
              {data.heroSubtitle}
            </motion.p>
            <motion.p
              variants={fadeUp} initial="hidden" animate={sec1In ? 'show' : 'hidden'} custom={2}
              className="text-[#333] font-[var(--font-open-sans)] text-sm leading-relaxed text-justify max-w-lg"
            >
              {data.introText}
            </motion.p>
          </div>

          {/* Right: triangle diagram */}
          <motion.div
            variants={fadeUp} initial="hidden" animate={sec1In ? 'show' : 'hidden'} custom={3}
            className="w-52 flex-shrink-0 pt-2"
          >
            <TriangleDiagram inView={sec1In} />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — Three Foundations: Human & Environmental & Culture
      ═══════════════════════════════════════════════════ */}
      <section ref={sec2Ref} className="bg-[#F2F0EB] border-t-4 border-b-4 border-[#5B8A5B]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-3 divide-x divide-[#D5D0C8]">

            {/* Column 1 — Human */}
            <motion.div
              variants={fadeUp} initial="hidden" animate={sec2In ? 'show' : 'hidden'} custom={0}
              className="flex flex-col items-center text-center px-8"
            >
              <div className="mb-6 flex items-end justify-center h-28">
                <HumanIcon inView={sec2In} customImage={data.humanImage} />
              </div>
              <h3 className="font-[var(--font-franklin-gothic)] text-xl font-bold text-[#181C23] tracking-wider mb-3">
                {data.humanTitle}
              </h3>
              <p className="text-[#555] text-sm leading-relaxed font-[var(--font-open-sans)]">
                {data.humanDescription}
              </p>
            </motion.div>

            {/* Ampersand + Column 2 — Environmental */}
            <div className="relative">
              {/* Left & */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={sec2In ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3, ease }}
                className="absolute -left-6 top-8 z-10 text-4xl font-light text-[#5B8A5B] select-none leading-none"
              >
                &amp;
              </motion.div>

              <motion.div
                variants={fadeUp} initial="hidden" animate={sec2In ? 'show' : 'hidden'} custom={1}
                className="flex flex-col items-center text-center px-8"
              >
                <div className="mb-6 flex items-end justify-center h-28">
                  <EnvIcon inView={sec2In} customImage={data.envImage} />
                </div>
                <h3 className="font-[var(--font-franklin-gothic)] text-xl font-bold text-[#181C23] tracking-wider mb-3">
                  {data.envTitle}
                </h3>
                <p className="text-[#555] text-sm leading-relaxed font-[var(--font-open-sans)]">
                  {data.envDescription}
                </p>
              </motion.div>
            </div>

            {/* Right & + Column 3 — Culture */}
            <div className="relative">
              {/* Right & */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={sec2In ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5, ease }}
                className="absolute -left-6 top-8 z-10 text-4xl font-light text-[#5B8A5B] select-none leading-none"
              >
                &amp;
              </motion.div>

              <motion.div
                variants={fadeUp} initial="hidden" animate={sec2In ? 'show' : 'hidden'} custom={2}
                className="flex flex-col items-center text-center px-8"
              >
                <div className="mb-6 flex items-end justify-center h-28">
                  <CultureIcon inView={sec2In} customImage={data.cultureImage} />
                </div>
                <h3 className="font-[var(--font-franklin-gothic)] text-xl font-bold text-[#181C23] tracking-wider mb-3">
                  {data.cultureTitle}
                </h3>
                <p className="text-[#555] text-sm leading-relaxed font-[var(--font-open-sans)]">
                  {data.cultureDescription}
                </p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — Node Diagram
      ═══════════════════════════════════════════════════ */}
      <section ref={sec3Ref} className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <NodeDiagram d={data} inView={sec3In} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
