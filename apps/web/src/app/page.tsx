import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
        Resumate AI
      </h1>
      <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
        Craft your perfect resume effortlessly. Choose from professional templates, input your data, and generate high-quality PDFs in minutes.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg" className="px-8 py-3 text-lg">
          <Link href="/login">Get Started</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="px-8 py-3 text-lg">
          <Link href="/templates">Browse Templates</Link>
        </Button>
      </div>
    </main>
  );
}
