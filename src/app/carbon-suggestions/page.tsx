'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { getCarbonEmissionSuggestions, CarbonEmissionSuggestionsOutput } from '@/ai/flows/carbon-emission-suggestions';
import { Loader2, WandSparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  lifestyle: z
    .string()
    .min(50, 'Please provide more detail about your lifestyle (at least 50 characters).'),
  habits: z
    .string()
    .min(50, 'Please provide more detail about your habits (at least 50 characters).'),
});

export default function CarbonSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<CarbonEmissionSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lifestyle: '',
      habits: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await getCarbonEmissionSuggestions(values);
      setSuggestions(result);
    } catch (error) {
      console.error("Error getting suggestions:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not retrieve AI suggestions. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            AI Carbon Reduction Suggestions
          </h2>
          <p className="text-muted-foreground mt-1">
            Get personalized tips from our AI to reduce your environmental impact.
          </p>
        </header>

        <Card className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="font-headline">Tell us about yourself</CardTitle>
                <CardDescription>
                  The more detail you provide, the better the suggestions will be.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="lifestyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Lifestyle</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I live in a city apartment, commute by car daily, eat meat a few times a week, and try to recycle."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="habits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Habits</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I usually leave lights on, take long showers, and buy a lot of packaged food. I travel by plane once a year for vacation."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <WandSparkles className="mr-2 h-4 w-4" />
                  )}
                  Get Suggestions
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {isLoading && (
            <Card className="max-w-2xl mx-auto">
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4 text-center min-h-[200px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                    <h3 className="font-headline text-lg">Our AI is thinking...</h3>
                    <p className="text-muted-foreground">Generating personalized suggestions just for you.</p>
                </CardContent>
            </Card>
        )}

        {suggestions && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <WandSparkles className="text-primary" />
                Here are your personalized suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose">
                <p>{suggestions.suggestions}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
