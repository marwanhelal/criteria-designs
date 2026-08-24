import Image from "next/image";

export default function MaintenancePage() {
  return (
    <main className="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#0a0a0c] via-[#151517] to-[#0a0a0c]">
      {/* Moving spotlights */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#d4af37]/30 blur-[120px] mix-blend-screen animate-[maintenance-spot-a_16s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-[#1f7a4d]/30 blur-[110px] mix-blend-screen animate-[maintenance-spot-b_20s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-[-15%] left-1/4 h-[560px] w-[560px] rounded-full bg-[#f2c94c]/20 blur-[130px] mix-blend-screen animate-[maintenance-spot-c_24s_ease-in-out_infinite]" />

      {/* Sweeping light beam */}
      <div className="pointer-events-none absolute inset-y-[-20%] left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl animate-[maintenance-sweep_9s_ease-in-out_infinite]" />

      {/* Vignette to focus attention on center */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)" }}
      />

      {/* Spotlit artwork */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-6 md:p-12">
        <div className="animate-[maintenance-fade-in_1.1s_ease-out_forwards]">
          <div className="relative animate-[maintenance-float_5s_ease-in-out_infinite]">
            <div className="pointer-events-none absolute inset-[-8%] rounded-3xl bg-[#f2c94c]/25 blur-3xl animate-[maintenance-glow_4s_ease-in-out_infinite]" />
            <Image
              src="/images/under-construction.jpg"
              alt="Criteria Design Group — Under Construction"
              width={1280}
              height={720}
              className="relative w-full max-w-4xl h-auto rounded-lg shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}
