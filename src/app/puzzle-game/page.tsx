'use client';
import { useState, useMemo } from 'react';
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

const puzzles = [
  { word: 'RECYCLE', hint: 'Process of converting waste into reusable material.' },
  { word: 'SUSTAIN', hint: 'To maintain at a certain rate or level.' },
  { word: 'COMPOST', hint: 'Decayed organic material used as a plant fertilizer.' },
  { word: 'FOREST', hint: 'A large area covered chiefly with trees and undergrowth.' },
];

function shuffleWord(word: string) {
  const a = word.split('');
  const n = a.length;

  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join('');
}

export default function PuzzleGamePage() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const { toast } = useToast();

  const currentPuzzle = puzzles[puzzleIndex];
  const scrambledWord = useMemo(
    () => shuffleWord(currentPuzzle.word),
    [currentPuzzle.word]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userGuess.toUpperCase() === currentPuzzle.word) {
      toast({
        title: 'Correct!',
        description: 'You solved the puzzle. Here is the next one!',
      });
      setUserGuess('');
      setPuzzleIndex((prevIndex) => (prevIndex + 1) % puzzles.length);
    } else {
      toast({
        variant: 'destructive',
        title: 'Incorrect',
        description: 'That is not the right word. Please try again.',
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            Eco Puzzle Challenge
          </h2>
          <p className="text-muted-foreground mt-1">
            Unscramble the letters to find the eco-friendly word!
          </p>
        </header>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-center text-4xl tracking-widest">
              {scrambledWord}
            </CardTitle>
            <CardDescription className="text-center pt-2">
              Hint: {currentPuzzle.hint}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="Your answer"
                className="text-center text-lg h-12"
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Submit Guess
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
