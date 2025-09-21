import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Welcome, Administrator.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p>All systems are currently operational.</p>
            <p className="text-sm text-muted-foreground mt-4">
              This is a placeholder for future admin functionalities, such as user management, content upload for the blog, and challenge creation.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
