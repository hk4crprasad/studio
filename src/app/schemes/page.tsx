import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { schemes } from '@/lib/data';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function SchemesPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            Government Environmental Schemes
          </h2>
          <p className="text-muted-foreground mt-1">
            Learn about initiatives you can benefit from and contribute to.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schemes.map((scheme) => (
            <Card key={scheme.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-lg">{scheme.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <p className="text-sm text-muted-foreground">{scheme.description}</p>
                {scheme.subsidy && (
                    <div>
                        <h4 className="font-semibold text-sm mb-1">Benefit/Subsidy</h4>
                        <p className="text-sm">{scheme.subsidy}</p>
                    </div>
                )}
              </CardContent>
              <CardFooter>
                 <Button asChild className="w-full">
                  <Link href={scheme.link} target="_blank">
                    <ExternalLink className="mr-2" />
                    Apply Now
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
