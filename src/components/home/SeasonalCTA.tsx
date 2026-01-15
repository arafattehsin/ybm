import Link from 'next/link';
import { Button } from '@/components/ui';

export function SeasonalCTA() {
  return (
    <section className="py-16 bg-[#F8F5F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Perfect time to send gifts
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          This winter, make your loved ones feel special and book with us now!
        </p>
        <Link href="/menu">
          <Button size="lg">ORDER NOW</Button>
        </Link>
      </div>
    </section>
  );
}
