import Image from "next/image";

export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f3ec] p-6">
      <Image
        src="/images/under-construction.jpg"
        alt="Criteria Design Group — Under Construction"
        width={1280}
        height={720}
        className="w-full max-w-3xl rounded-md shadow-2xl h-auto"
        priority
      />
    </main>
  );
}
