import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-lg mb-4">Welcome to your Resumate AI dashboard! Manage your resumes and explore templates.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">My Resumes</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">View and manage all your created resumes.</p>
          <Button asChild><Link href="/dashboard/resumes">Go to Resumes</Link></Button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Explore Templates</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Browse a wide variety of professional resume templates.</p>
          <Button asChild><Link href="/dashboard/templates">Browse Templates</Link></Button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Account Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Update your profile information and preferences.</p>
          <Button asChild><Link href="/dashboard/settings">Manage Settings</Link></Button>
        </div>
      </div>
    </div>
  );
}
