
'use client';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { greenProducts } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export default function StorePage() {
  const { toast } = useToast();

  const handleAddToCart = (productName: string) => {
    toast({
      title: "Added to Cart!",
      description: `${productName} has been added to your cart.`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            The Green Store
          </h2>
          <p className="text-muted-foreground mt-1">
            Shop our curated collection of sustainable and eco-friendly products.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {greenProducts.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden group">
              {product.image && (
                 <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.image.imageUrl}
                      alt={product.image.description}
                      fill
                      className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      data-ai-hint={product.image.imageHint}
                    />
                 </div>
              )}
              <CardHeader>
                <CardTitle className="font-headline text-lg group-hover:text-primary transition-colors">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm">{product.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
                <div className="font-bold text-lg text-primary">${product.price.toFixed(2)}</div>
                <Button onClick={() => handleAddToCart(product.name)}>
                  <ShoppingCart className="mr-2"/>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
