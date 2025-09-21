import { AppLayout } from '@/components/app-layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { schemes } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

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

        <Accordion type="single" collapsible className="w-full">
          {schemes.map((scheme) => (
            <AccordionItem value={scheme.id} key={scheme.id}>
              <AccordionTrigger className="font-headline text-left text-lg hover:no-underline">
                {scheme.name}
              </AccordionTrigger>
              <AccordionContent className="text-base space-y-4">
                <p>{scheme.description}</p>
                <Button asChild>
                  <Link href={scheme.link} target="_blank">
                    <ExternalLink className="mr-2" />
                    Apply Now
                  </Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AppLayout>
  );
}
