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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, WandSparkles, Leaf, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Type definitions for the API response
interface CarbonSuggestion {
  category: string;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
}

interface CarbonEmissionSuggestionsOutput {
  suggestions: CarbonSuggestion[];
  summary: string;
  totalEstimatedReduction: string;
}

const formSchema = z.object({
  lifestyle: z
    .string()
    .min(50, 'Please provide more detail about your lifestyle (at least 50 characters).'),
  habits: z
    .string()
    .min(50, 'Please provide more detail about your habits (at least 50 characters).'),
  language: z.string().min(1, 'Please select a language.'),
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
      language: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const response = await fetch('/api/carbon-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to get carbon suggestions');
      }

      const result = await response.json();
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
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language for suggestions" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Odia">Odia (ଓଡ଼ିଆ)</SelectItem>
                          <SelectItem value="Hindi">Hindi (हिन्दी)</SelectItem>
                          <SelectItem value="Bengali">Bengali (বাংলা)</SelectItem>
                          <SelectItem value="Telugu">Telugu (తెలుగు)</SelectItem>
                          <SelectItem value="Tamil">Tamil (தமிழ்)</SelectItem>
                          <SelectItem value="Marathi">Marathi (मराठी)</SelectItem>
                          <SelectItem value="Gujarati">Gujarati (ગુજરાતી)</SelectItem>
                          <SelectItem value="Kannada">Kannada (ಕನ್ನಡ)</SelectItem>
                          <SelectItem value="Malayalam">Malayalam (മലയാളം)</SelectItem>
                          <SelectItem value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                        </SelectContent>
                      </Select>
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
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <WandSparkles className="text-primary" />
                  Your Personalized Carbon Reduction Plan
                </CardTitle>
                <CardDescription>
                  Here are {suggestions.suggestions.length} actionable suggestions tailored to your lifestyle
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {suggestions.suggestions.map((suggestion, index) => (
                <Card key={index} className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {suggestion.category}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        suggestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        suggestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {suggestion.difficulty}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-headline flex items-start gap-2">
                      <Leaf className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      {suggestion.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                      {suggestion.description}
                    </p>
                    <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <Lightbulb className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-green-800 mb-1">Environmental Impact</p>
                        <p className="text-xs text-green-700">{suggestion.impact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
