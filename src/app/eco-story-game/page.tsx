'use client';
import { useState, useEffect, useMemo } from 'react';
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
import { Loader2, WandSparkles, Check, PartyPopper, RotateCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateEcoStory, evaluateEcoStory } from '@/ai/flows/generate-eco-story';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function EcoStoryGamePage() {
  const [story, setStory] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [wordBank, setWordBank] = useState<string[]>([]);
  const { toast } = useToast();

  const loadNewStory = async () => {
    setIsLoading(true);
    setStory(null);
    setEvaluation(null);
    setAnswers([]);
    setWordBank([]);
    try {
      const result = await generateEcoStory({ theme: 'forestation and carbon emission reduction' });
      setStory(result);
      setAnswers(Array(result.correctWords.length).fill(''));
      setWordBank(shuffleArray([...result.correctWords, ...result.incorrectWords]));
    } catch (error) {
      console.error("Failed to generate story:", error);
      toast({
        variant: "destructive",
        title: "Could not load a new story",
        description: "There was an issue generating a new story from the AI. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNewStory();
  }, []);

  const handleWordDrop = (index: number, word: string) => {
    if (answers[index] === word) return;

    setAnswers(prev => {
      const newAnswers = [...prev];
      // If word is already used, remove it from its previous position
      const previousIndex = newAnswers.indexOf(word);
      if (previousIndex > -1) {
        newAnswers[previousIndex] = '';
      }
      newAnswers[index] = word;
      return newAnswers;
    });

    setWordBank(prev => prev.filter(w => w !== word));
    
    // Add dragged out word back to word bank
    if (answers[index]) {
        setWordBank(prev => [...prev, answers[index]]);
    }
  };

  const handleWordBankDrop = (word: string) => {
    setAnswers(prev => prev.map(a => a === word ? '' : a));
    setWordBank(prev => prev.includes(word) ? prev : [...prev, word]);
  };

  const handleSubmit = async () => {
    setIsEvaluating(true);
    try {
      const completedStory = story.storyTemplate.replace(/\[\d+\]/g, (match: string) => {
        const index = parseInt(match.replace(/[\[\]]/g, ''), 10) - 1;
        return answers[index] || '______';
      });
      const result = await evaluateEcoStory({ story: completedStory });
      setEvaluation(result.evaluation);
    } catch (error) {
      console.error("Failed to evaluate story:", error);
      toast({
        variant: "destructive",
        title: "Evaluation Error",
        description: "There was an issue evaluating your story. Please try again."
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const isStoryComplete = useMemo(() => {
    return answers.every(answer => answer.trim() !== '');
  }, [answers]);

  const storyParts = useMemo(() => {
    if (!story) return [];
    return story.storyTemplate.split(/(\[\d+\])/g).map((part: string, i: number) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const index = parseInt(match[1], 10) - 1;
        return { type: 'blank', index };
      }
      return { type: 'text', content: part };
    });
  }, [story]);

  return (
    <AppLayout>
      <AlertDialog open={!!evaluation} onOpenChange={() => !evaluation && loadNewStory()}>
          <AlertDialogContent>
              <AlertDialogHeader className="items-center text-center">
                  <PartyPopper className="w-16 h-16 text-primary" />
                  <AlertDialogTitle className="font-headline text-3xl">Story Complete!</AlertDialogTitle>
                  <AlertDialogDescription className="prose text-left text-base p-4">
                    <h4 className="font-headline text-lg">AI Evaluation:</h4>
                    <p>{evaluation}</p>
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <Button onClick={loadNewStory} className="w-full">
                      <RotateCw className="mr-2" />
                      Play Another Story
                  </Button>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            AI Eco-Story Generator
          </h2>
          <p className="text-muted-foreground mt-1">
           Complete the story by dragging the correct words into the blanks.
          </p>
        </header>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            {isLoading ? (
                <div className="space-y-2">
                    <div className="font-headline text-center flex items-center justify-center gap-2 text-2xl">
                        <WandSparkles className="text-primary"/>
                        AI is writing a story for you...
                    </div>
                    <CardDescription className="text-center">Please wait a moment.</CardDescription>
                </div>
            ) : (
              story && <CardTitle className="font-headline text-center">{story.title}</CardTitle>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
                 <div className="flex flex-col items-center justify-center p-4 text-center min-h-[300px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                 </div>
            ) : story && (
              <div className="space-y-6">
                <div 
                  className="prose prose-lg max-w-none bg-muted/50 p-6 rounded-lg leading-loose"
                  onDragOver={e => e.preventDefault()}
                >
                  {storyParts.map((part, i) => {
                    if (part.type === 'text') {
                      return <span key={i}>{part.content}</span>;
                    }
                    const answer = answers[part.index];
                    return (
                        <div
                            key={i}
                            onDrop={(e) => {
                                e.preventDefault();
                                const word = e.dataTransfer.getData('text/plain');
                                handleWordDrop(part.index, word);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            className={cn(
                                'inline-block mx-2 p-2 rounded-md min-w-32 text-center align-middle',
                                answer ? 'bg-primary/20 border-primary' : 'bg-background/80 border-dashed',
                                'border-2 transition-colors'
                            )}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', answer);
                            }}
                            >
                            {answer || '...'}
                        </div>
                    );
                  })}
                </div>
                
                <div 
                  onDrop={(e) => {
                    e.preventDefault();
                    const word = e.dataTransfer.getData('text/plain');
                    handleWordBankDrop(word);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex flex-wrap gap-4 p-4 border rounded-lg min-h-24 bg-background justify-center items-center"
                >
                  {wordBank.map((word, i) => (
                    <div
                      key={i}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', word);
                      }}
                      className="cursor-grab bg-secondary text-secondary-foreground font-semibold px-4 py-2 rounded-md shadow-sm active:cursor-grabbing"
                    >
                      {word}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          {story && !evaluation && (
            <CardFooter>
              <Button onClick={handleSubmit} disabled={!isStoryComplete || isEvaluating} className="w-full">
                {isEvaluating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Finish Story & Get Evaluation
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
