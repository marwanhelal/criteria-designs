'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CeoData {
  ceoNameEn: string | null
  ceoTitleEn: string | null
  ceoImage: string | null
  ceoBgImage: string | null
  ceoStat1Number: string | null
  ceoStat1LabelEn: string | null
  ceoStat1DescEn: string | null
  ceoStat2Number: string | null
  ceoStat2LabelEn: string | null
  ceoStat3Number: string | null
  ceoStat3LabelEn: string | null
  ceoStat4Number: string | null
  ceoStat4LabelEn: string | null
  ceoLogo1: string | null
  ceoLogo2: string | null
  ceoLogo3: string | null
  ceoLogo4: string | null
  ceoLogo5: string | null
  ceoBtnTextEn: string | null
  ceoBtnLink: string | null
}

export default function CeoBanner() {
  const [data, setData] = useState<CeoData | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d?.ceoNameEn) setData(d)
      })
      .catch(() => {})
  }, [])

  if (!data) return null

  const stats = [
    { number: data.ceoStat1Number, label: data.ceoStat1LabelEn, desc: data.ceoStat1DescEn },
    { number: data.ceoStat2Number, label: data.ceoStat2LabelEn },
    { number: data.ceoStat3Number, label: data.ceoStat3LabelEn },
    { number: data.ceoStat4Number, label: data.ceoStat4LabelEn },
  ].filter((s) => s.number)

  const logos = [data.ceoLogo1, data.ceoLogo2, data.ceoLogo3, data.ceoLogo4, data.ceoLogo5].filter(
    Boolean
  ) as string[]

  return (
    <section className="relative w-full overflow-hidden bg-[#181C23]">
      {/* Background image */}
      {data.ceoBgImage && (
        <div className="absolute inset-0">
          <Image
            src={data.ceoBgImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-15"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#181C23]/80 via-[#181C23]/40 to-[#181C23]/80" />
        </div>
      )}

      {/* Subtle blueprint grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(177,164,144,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(177,164,144,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-[1290px] mx-auto px-8 py-[80px] lg:py-[120px]">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Portrait */}
          {data.ceoImage && (
            <div className="shrink-0">
              <div className="relative w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] rounded-full overflow-hidden ring-2 ring-[#B1A490]/40 ring-offset-4 ring-offset-[#181C23]">
                <Image
                  src={data.ceoImage}
                  alt={data.ceoNameEn || 'CEO'}
                  fill
                  sizes="280px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Name & title */}
            <h2 className="font-[var(--font-merriweather)] text-[28px] lg:text-[40px] text-white leading-[1.2] font-bold uppercase tracking-[1px]">
              {data.ceoNameEn}
            </h2>
            {data.ceoTitleEn && (
              <p className="font-[var(--font-libre-franklin)] text-[13px] lg:text-[15px] text-[#B1A490] uppercase tracking-[3px] mt-2">
                {data.ceoTitleEn}
              </p>
            )}

            {/* Stats */}
            {stats.length > 0 && (
              <div className="flex flex-wrap justify-center lg:justify-start gap-0 mt-10">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className={`flex flex-col px-5 lg:px-8 py-2 ${
                      i > 0 ? 'border-l border-white/15' : ''
                    }`}
                  >
                    <span className="font-[var(--font-merriweather)] text-[32px] lg:text-[48px] text-white leading-none font-bold">
                      {stat.number}
                    </span>
                    <span className="font-[var(--font-libre-franklin)] text-[11px] lg:text-[13px] text-white/60 uppercase tracking-[2px] mt-2">
                      {stat.label}
                    </span>
                    {'desc' in stat && stat.desc && (
                      <span className="font-[var(--font-open-sans)] text-[11px] text-white/40 mt-1 max-w-[140px]">
                        {stat.desc}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Button + Logos row */}
            <div className="flex flex-col lg:flex-row items-center gap-8 mt-10">
              {data.ceoBtnTextEn && data.ceoBtnLink && (
                <Link
                  href={data.ceoBtnLink}
                  className="inline-flex items-center font-[var(--font-libre-franklin)] text-[13px] text-white uppercase tracking-[2px] border border-[#B1A490]/50 px-[32px] py-[14px] rounded-[30px] hover:bg-[#B1A490]/10 hover:border-[#B1A490] transition-all"
                >
                  {data.ceoBtnTextEn}
                </Link>
              )}

              {logos.length > 0 && (
                <div className="flex items-center gap-6">
                  {logos.map((logo, i) => (
                    <div key={i} className="relative w-[60px] h-[40px] lg:w-[80px] lg:h-[50px] opacity-60 hover:opacity-100 transition-opacity">
                      <Image
                        src={logo}
                        alt={`Logo ${i + 1}`}
                        fill
                        sizes="80px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
