import { AppLayout } from '@/components/app-layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { schemes } from '@/lib/data';

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
              <AccordionContent className="text-base">
                {scheme.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AppLayout>
  );
}
