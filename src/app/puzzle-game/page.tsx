'use client';
import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Info, Award, RotateCw, Loader2, WandSparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { generateWordPuzzles } from '@/ai/flows/generate-word-puzzle';

type Puzzle = {
  word: string;
  hint: string;
  scrambled: string;
  explanation: string;
};

const shuffleWord = (word: string) => {
  if (!word) return '';
  let shuffled = word.split('').sort(() => 0.5 - Math.random()).join('');
  while (shuffled === word && word.length > 1) {
    shuffled = word.split('').sort(() => 0.5 - Math.random()).join('');
  }
  return shuffled;
};

export default function WordPuzzlePage() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadNewPuzzles = async () => {
    setIsLoading(true);
    setGuess('');
    setFeedback(null);
    setIsSolved(false);
    setShowCongrats(false);
    setPuzzles([]);
    setCurrentPuzzleIndex(0);
    try {
      const result = await generateWordPuzzles({ theme: 'sustainability', count: 10 });
      const newPuzzles = result.puzzles.map(p => ({
        ...p,
        scrambled: shuffleWord(p.word),
      }));
      setPuzzles(newPuzzles);
    } catch (error) {
        console.error("Failed to generate word puzzle:", error);
        toast({
            variant: "destructive",
            title: "Could not load puzzles",
            description: "There was an issue generating new word puzzles. Please try again."
        });
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNewPuzzles();
  }, []);

  const currentPuzzle = puzzles[currentPuzzleIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSolved || !currentPuzzle) return;
    if (guess.toUpperCase() === currentPuzzle.word) {
      setFeedback('correct');
      setIsSolved(true);
      if (currentPuzzleIndex === puzzles.length - 1) {
        setShowCongrats(true);
      }
      toast({
        title: 'Correct!',
        description: 'You earned 50 points!',
      });
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNextWord = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1);
      setIsSolved(false);
      setGuess('');
      setFeedback(null);
    } else {
      loadNewPuzzles(); // All puzzles solved, load a new batch
    }
  };

  return (
    <AppLayout>
       <AlertDialog open={showCongrats} onOpenChange={setShowCongrats}>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center text-center">
            <Award className="w-16 h-16 text-primary" />
            <AlertDialogTitle className="font-headline text-3xl">Congratulations!</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              You've solved all the puzzles and earned a total of <span className="font-bold text-primary">{puzzles.length * 50} points!</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={loadNewPuzzles} className="w-full">
              <RotateCw className="mr-2" />
              Play Again
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            AI Eco Word Scramble
          </h2>
          <p className="text-muted-foreground mt-1">
            {puzzles.length > 0 ? `Unscramble the sustainability word. (${currentPuzzleIndex + 1} of ${puzzles.length})` : 'Loading puzzles...'}
          </p>
        </header>

        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-center flex items-center justify-center gap-2">
              <WandSparkles className="text-primary"/>
              Unscramble the Word
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            {isLoading ? (
                 <div className="flex flex-col items-center justify-center p-4 text-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                    <p className="mt-4 text-muted-foreground">Our AI is generating new puzzles...</p>
                 </div>
            ) : currentPuzzle ? (
                <>
                    <div className="flex items-center justify-center p-4 bg-muted rounded-lg w-full min-h-[80px]">
                        <p className="text-4xl font-bold tracking-widest text-primary font-mono">
                            {isSolved ? currentPuzzle.word : currentPuzzle.scrambled}
                        </p>
                    </div>
                    <CardDescription className="text-center italic">
                        Hint: {currentPuzzle.hint}
                    </CardDescription>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center h-40">
                    <p className="text-muted-foreground">Could not load puzzle. Try refreshing.</p>
                </div>
            )}
            
            {!isSolved && !isLoading && currentPuzzle && (
                 <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="relative">
                      <Input 
                          value={guess}
                          onChange={(e) => {
                              setGuess(e.target.value);
                              setFeedback(null);
                          }}
                          placeholder="Your answer"
                          className={cn("text-center text-lg h-12", 
                            feedback === 'incorrect' ? 'border-destructive focus-visible:ring-destructive' : ''
                          )}
                          aria-label="Your guess"
                          disabled={isSolved}
                      />
                      {feedback === 'correct' && <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                    </div>
                    <Button type="submit" className="w-full" disabled={!guess || isSolved}>
                        Check Answer
                    </Button>
                </form>
            )}

            {isSolved && currentPuzzle && (
                <div className="w-full p-4 rounded-md border-green-500 bg-green-500/10 text-green-800 flex items-start gap-3">
                   <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                   <p className="font-medium">
                       <span className="font-bold">Did you know?</span> {currentPuzzle.explanation}
                   </p>
                </div>
            )}
          </CardContent>
          {isSolved && (
            <CardFooter>
                 <Button onClick={handleNextWord} className="w-full" disabled={isLoading}>
                    <RotateCw className="mr-2 h-4 w-4" />
                    <span>{currentPuzzleIndex < puzzles.length - 1 ? 'Next Word' : 'Play Again'}</span>
                </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
