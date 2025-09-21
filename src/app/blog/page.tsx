import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { articles } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            Latest Articles & Resources
          </h2>
          <p className="text-muted-foreground mt-1">
            Stay informed about climate change, sustainability, and more.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.slug} className="flex flex-col overflow-hidden">
              {article.image && (
                 <div className="aspect-video relative">
                    <Image
                      src={article.image.imageUrl}
                      alt={article.image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={article.image.imageHint}
                    />
                 </div>
              )}
              <CardHeader>
                <CardTitle className="font-headline text-lg">{article.title}</CardTitle>
                <CardDescription className="text-xs">
                  By {article.author} on {article.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm">{article.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" asChild>
                  <Link href="#">Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
