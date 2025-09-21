'use client';
import { useState, useEffect, useMemo, DragEvent } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Award } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const PUZZLE_IMAGE_URL = 'https://picsum.photos/seed/puzzle-nature/400/400';
const PUZZLE_SIZE = 400;
const GRID_SIZE = 4;
const PIECE_SIZE = PUZZLE_SIZE / GRID_SIZE;

type Piece = {
  id: number;
  bgX: number;
  bgY: number;
};

const createPieces = (): Piece[] => {
  const pieces: Piece[] = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    pieces.push({
      id: i,
      bgX: (i % GRID_SIZE) * PIECE_SIZE,
      bgY: Math.floor(i / GRID_SIZE) * PIECE_SIZE,
    });
  }
  return pieces;
};

const shufflePieces = (pieces: Piece[]): Piece[] => {
    // A simple shuffle that is guaranteed to not be the original order
    const shuffled = [...pieces].reverse(); 
    if (JSON.stringify(shuffled) === JSON.stringify(pieces)) {
        // In case of a very small grid (2x2), reverse might be the same
        const a = shuffled[0];
        shuffled[0] = shuffled[1];
        shuffled[1] = a;
    }
    return shuffled;
};

export default function PuzzleGamePage() {
  const originalPieces = useMemo(() => createPieces(), []);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<Piece | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setPieces(shufflePieces(originalPieces));
    setIsSolved(false);
  }, [originalPieces]);

  useEffect(() => {
    const checkSolved = () => {
      if (pieces.length === 0) return false;
      for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].id !== originalPieces[i].id) {
          return false;
        }
      }
      return true;
    };

    if (checkSolved()) {
      setIsSolved(true);
      toast({
        title: 'Congratulations!',
        description: 'You solved the puzzle and earned 150 points!',
      });
    }
  }, [pieces, originalPieces, toast]);

  const handleDragStart = (piece: Piece) => {
    setDraggedPiece(piece);
  };

  const handleDrop = (targetPiece: Piece) => {
    if (!draggedPiece) return;

    const newPieces = [...pieces];
    const draggedIndex = pieces.findIndex(p => p.id === draggedPiece.id);
    const targetIndex = pieces.findIndex(p => p.id === targetPiece.id);

    // Swap the pieces
    newPieces[draggedIndex] = targetPiece;
    newPieces[targetIndex] = draggedPiece;

    setPieces(newPieces);
    setDraggedPiece(null);
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const resetPuzzle = () => {
    setPieces(shufflePieces(originalPieces));
    setIsSolved(false);
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            Eco Jigsaw Puzzle
          </h2>
          <p className="text-muted-foreground mt-1">
            Drag and drop the pieces to solve the puzzle and reveal a beautiful nature scene.
          </p>
        </header>

        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-center">
              Complete the Image
            </CardTitle>
            <CardDescription className="text-center">
                {isSolved ? "You did it! A beautiful landscape restored." : "Unscramble the pieces to see the full picture."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
             <div 
                className="grid gap-1 bg-muted p-2 rounded-lg shadow-inner"
                style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, ${PIECE_SIZE}px)`,
                    width: PUZZLE_SIZE + 8,
                }}
             >
                {pieces.map((piece) => (
                    <div
                        key={piece.id}
                        draggable={!isSolved}
                        onDragStart={() => handleDragStart(piece)}
                        onDrop={() => handleDrop(piece)}
                        onDragOver={handleDragOver}
                        className={cn(
                          'bg-cover bg-no-repeat rounded-sm transition-all duration-300',
                          !isSolved && 'cursor-grab active:cursor-grabbing hover:opacity-80'
                        )}
                        style={{
                            width: PIECE_SIZE,
                            height: PIECE_SIZE,
                            backgroundImage: `url(${PUZZLE_IMAGE_URL})`,
                            backgroundPosition: `-${piece.bgX}px -${piece.bgY}px`,
                        }}
                    />
                ))}
            </div>
          </CardContent>
          {isSolved && (
            <CardFooter className="flex flex-col gap-4 items-center text-center">
                 <div className="flex items-center gap-2 text-primary font-bold text-lg">
                    <Award />
                    <span>150 Points Rewarded!</span>
                </div>
                <Button onClick={resetPuzzle}>Play Again</Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
