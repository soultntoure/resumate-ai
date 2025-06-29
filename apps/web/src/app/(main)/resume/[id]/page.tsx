import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface ResumeDetailPageProps {
  params: { id: string };
}

// Dummy data for a resume (in a real app, this would be fetched from API)
const dummyResume = {
  id: 'abc-123',
  templateName: 'Modern Professional',
  data: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    summary: 'Highly motivated and results-oriented professional with a proven track record...', 
    experience: [
      { title: 'Software Engineer', company: 'Tech Corp', years: '2020-Present' },
    ],
    education: [
      { degree: 'M.Sc. Computer Science', university: 'State University', year: '2020' },
    ],
  },
  pdfUrl: '/dummy-resume.pdf', // Example PDF URL
};

export default function ResumeDetailPage({ params }: ResumeDetailPageProps) {
  const { id } = params;

  // In a real app, fetch resume data based on 'id'
  const resume = id === 'new' ? null : dummyResume; // Simulate fetching or creating new

  if (id !== 'new' && !resume) {
    notFound();
  }

  const isNew = id === 'new';

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{isNew ? 'Create New Resume' : `Edit Resume: ${resume?.templateName}`}</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{isNew ? 'Resume Details' : 'Resume Data'}</CardTitle>
          <CardDescription>Fill in your personal information, experience, and education.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Basic form fields - use React Hook Form for full implementation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={resume?.data.name || ''} placeholder="John Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={resume?.data.email || ''} placeholder="john.doe@example.com" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue={resume?.data.phone || ''} placeholder="(123) 456-7890" />
            </div>
          </div>
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" rows={5} defaultValue={resume?.data.summary || ''} placeholder="A brief summary of your professional background..." />
          </div>
          {/* More sections like Experience, Education, Skills would go here, possibly as dynamic lists */}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" asChild><Link href="/dashboard">Cancel</Link></Button>
        <Button>{isNew ? 'Save & Generate PDF' : 'Update & Generate PDF'}</Button>
      </div>

      {!isNew && resume?.pdfUrl && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generated PDF</CardTitle>
            <CardDescription>View or download your latest resume PDF.</CardDescription>
          </CardHeader>
          <CardContent>
            <a href={resume.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              View PDF
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
