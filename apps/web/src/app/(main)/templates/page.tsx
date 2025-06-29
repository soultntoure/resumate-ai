import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

// Dummy data for templates
const templates = [
  { id: '1', name: 'Modern Professional', imageUrl: '/template-modern.png' },
  { id: '2', name: 'Minimalist Clean', imageUrl: '/template-minimal.png' },
  { id: '3', name: 'Creative Portfolio', imageUrl: '/template-creative.png' },
];

export default function TemplatesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Templates</h1>
      <p className="text-lg mb-6">Choose from our collection of professionally designed resume templates.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {template.imageUrl && (
                <div className="relative w-full h-48 mb-4 border rounded-md overflow-hidden">
                  <Image src={template.imageUrl} alt={template.name} layout="fill" objectFit="cover" />
                </div>
              )}
              <p className="text-gray-600 dark:text-gray-400">A clean and modern template suitable for all professions.</p>
            </CardContent>
            <CardFooter className="justify-end">
              <Button asChild>
                <Link href={`/dashboard/resume/new?templateId=${template.id}`}>Use Template</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
