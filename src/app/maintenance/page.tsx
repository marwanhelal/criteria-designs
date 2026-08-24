import Image from "next/image";

export default function MaintenancePage() {
  return (
    <main className="fixed inset-0 bg-[#f7f3ec]">
      <Image
        src="/images/under-construction.jpg"
        alt="Criteria Design Group — Under Construction"
        fill
        className="object-contain"
        priority
      />
    </main>
  );
}
