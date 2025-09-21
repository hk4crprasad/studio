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
import { CheckCircle, XCircle, Award, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

const WORDS = [
  'RECYCLE',
  'COMPOST',
  'SUSTAIN',
  'RENEWABLE',
  'CONSERVE',
  'PLANET',
  'FOREST',
  'ENERGY',
  'WATER',
  'ECOSYSTEM',
];

const shuffleWord = (word: string) => {
  let shuffled = word.split('').sort(() => 0.5 - Math.random()).join('');
  // Ensure the shuffled word is not the same as the original
  while (shuffled === word) {
    shuffled = word.split('').sort(() => 0.5 - Math.random()).join('');
  }
  return shuffled;
};

export default function WordPuzzlePage() {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const { toast } = useToast();

  const loadNewWord = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(newWord);
    setScrambledWord(shuffleWord(newWord));
    setIsSolved(false);
    setFeedback(null);
    setGuess('');
    setShowCongrats(false);
  };

  useEffect(() => {
    loadNewWord();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.toUpperCase() === currentWord) {
      setFeedback('correct');
      setIsSolved(true);
      setShowCongrats(true);
      toast({
        title: 'Correct!',
        description: 'You earned 50 points!',
      });
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNextWord = () => {
    loadNewWord();
  };

  return (
    <AppLayout>
       <AlertDialog open={showCongrats} onOpenChange={setShowCongrats}>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center text-center">
            <Award className="w-16 h-16 text-primary" />
            <AlertDialogTitle className="font-headline text-3xl">Congratulations!</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              You solved the puzzle and earned <span className="font-bold text-primary">50 points!</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleNextWord} className="w-full">
              <RotateCw className="mr-2" />
              Play Next Word
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            Eco Word Scramble
          </h2>
          <p className="text-muted-foreground mt-1">
            Unscramble the letters to find the sustainability-related word.
          </p>
        </header>

        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-center">
              Unscramble the Word
            </CardTitle>
            <CardDescription className="text-center">
                Can you figure out this eco-term?
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="flex items-center justify-center p-4 bg-muted rounded-lg w-full">
                <p className="text-4xl font-bold tracking-widest text-primary font-mono">
                    {scrambledWord}
                </p>
            </div>
            
            {!isSolved && (
                 <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <Input 
                        value={guess}
                        onChange={(e) => {
                            setGuess(e.target.value);
                            setFeedback(null);
                        }}
                        placeholder="Your answer"
                        className="text-center text-lg h-12"
                        aria-label="Your guess"
                        disabled={isSolved}
                    />
                    <Button type="submit" className="w-full" disabled={!guess}>
                        Check Answer
                    </Button>
                </form>
            )}

            {feedback && !isSolved && (
                 <div className={cn(
                    "w-full p-3 rounded-md border flex items-center gap-3",
                    feedback === 'correct' ? 'border-green-500 bg-green-500/10 text-green-700' : 'border-red-500 bg-red-500/10 text-red-700'
                 )}>
                    {feedback === 'correct' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    <p className="font-medium">
                        {feedback === 'correct' ? 'That\'s right!' : 'Not quite, try again!'}
                    </p>
                 </div>
            )}
          </CardContent>
          {isSolved && (
            <CardFooter className="flex flex-col gap-4 items-center text-center">
                 <Button onClick={handleNextWord} className="w-full">
                    <RotateCw />
                    <span>Next Word</span>
                </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
