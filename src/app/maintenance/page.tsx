import Image from "next/image";

export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f3ec] p-6">
      <Image
        src="/images/under-construction.jpg"
        alt="Criteria Design Group — Under Construction"
        width={1280}
        height={720}
        className="w-full max-w-3xl h-auto rounded-md shadow-2xl animate-[maintenance-fade-in_1s_ease-out_forwards]"
        priority
      />
    </main>
  );
}
