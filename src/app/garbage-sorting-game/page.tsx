'use client';
import { useState, useEffect, useRef } from 'react';
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Apple,
  Bone,
  Newspaper,
  GlassWater,
  Syringe,
  Pill,
  Trash2,
  Recycle,
  Biohazard,
  Timer,
  PartyPopper,
  RotateCw,
  Droplets,
  Flower,
  Leaf,
  Battery,
  Lamp,
  Thermometer,
  SprayCan,
  Laptop
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type BinType = 'wet' | 'dry' | 'medical';

type WasteItem = {
  id: number;
  name: string;
  Icon: React.ElementType;
  type: BinType;
};

const allWasteItems: WasteItem[] = [
  { id: 1, name: 'Apple Core', Icon: Apple, type: 'wet' },
  { id: 2, name: 'Leftover Bone', Icon: Bone, type: 'wet' },
  { id: 3, name: 'Newspaper', Icon: Newspaper, type: 'dry' },
  { id: 4, name: 'Glass Bottle', Icon: GlassWater, type: 'dry' },
  { id: 5, name: 'Used Syringe', Icon: Syringe, type: 'medical' },
  { id: 6, name: 'Expired Pills', Icon: Pill, type: 'medical' },
  { id: 7, name: 'Plastic Bag', Icon: Recycle, type: 'dry' },
  { id: 8, name: 'Egg Shells', Icon: Bone, type: 'wet' },
  { id: 9, name: 'Cardboard Box', Icon: Newspaper, type: 'dry' },
  { id: 10, name: 'Used Bandage', Icon: Biohazard, type: 'medical' },
  { id: 11, 'name': 'Vegetable Peels', 'Icon': Leaf, 'type': 'wet' },
  { id: 12, 'name': 'Fallen Leaves', 'Icon': Flower, 'type': 'wet' },
  { id: 13, 'name': 'Water Bottle', 'Icon': Droplets, 'type': 'dry' },
  { id: 14, 'name': 'Aerosol Can', 'Icon': SprayCan, 'type': 'dry' },
  { id: 15, 'name': 'Old Thermometer', 'Icon': Thermometer, 'type': 'medical' },
  { id: 16, 'name': 'Used Batteries', 'Icon': Battery, 'type': 'medical' },
  { id: 17, 'name': 'Old Laptop', 'Icon': Laptop, 'type': 'dry' },
  { id: 18, 'name': 'Tea Bags', 'Icon': Leaf, 'type': 'wet' },
  { id: 19, 'name': 'Light Bulb', 'Icon': Lamp, 'type': 'dry' },
  { id: 20, 'name': 'Painkiller Strips', 'Icon': Pill, 'type': 'medical' }
];

const bins: { type: BinType; name: string; Icon: React.ElementType; color: string; textColor: string }[] = [
  { type: 'wet', name: 'Wet Waste', Icon: Trash2, color: 'border-green-500 bg-green-500/10', textColor: 'text-green-600' },
  { type: 'dry', name: 'Dry Waste', Icon: Recycle, color: 'border-blue-500 bg-blue-500/10', textColor: 'text-blue-600' },
  { type: 'medical', name: 'Medical Waste', Icon: Biohazard, color: 'border-red-500 bg-red-500/10', textColor: 'text-red-600' },
];

const shuffleArray = <T,>(array: T[]) => [...array].sort(() => Math.random() - 0.5);

const GAME_DURATION = 60; // seconds

export default function GarbageSortingGamePage() {
  const [wastePile, setWastePile] = useState<WasteItem[]>([]);
  const [currentItem, setCurrentItem] = useState<WasteItem | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'over'>('ready');
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    const shuffledItems = shuffleArray(allWasteItems);
    setWastePile(shuffledItems);
    setCurrentItem(shuffledItems[0]);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      if (timeLeft > 0) {
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else {
        setGameState('over');
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, timeLeft]);
  
  const handleDrop = (binType: BinType) => {
    if (!currentItem) return;
    setIsDragging(false);

    if (currentItem.type === binType) {
      setScore((prev) => prev + 10);
      toast({ title: 'Correct!', description: `+10 points for sorting ${currentItem.name}.` });
    } else {
      setScore((prev) => Math.max(0, prev - 5));
      toast({ variant: 'destructive', title: 'Incorrect!', description: `${currentItem.name} does not go in the ${binType} bin.` });
    }
    
    const newWastePile = wastePile.slice(1);
    setWastePile(newWastePile);

    if (newWastePile.length > 0) {
      setCurrentItem(newWastePile[0]);
    } else {
      setCurrentItem(null);
      setGameState('over');
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    if (currentItem) {
      e.dataTransfer.setData('text/plain', currentItem.id.toString());
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const resetGame = () => {
    setGameState('ready');
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setWastePile([]);
    setCurrentItem(null);
  }

  return (
    <AppLayout>
      <AlertDialog open={gameState === 'over'} onOpenChange={(open) => !open && resetGame()}>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center text-center">
            <PartyPopper className="w-16 h-16 text-primary" />
            <AlertDialogTitle className="font-headline text-3xl">Game Over!</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              {wastePile.length === 0 ? "You've sorted all the items!" : "Time's up!"}
            </AlertDialogDescription>
            <div className="pt-4 text-2xl">
              Your final score is: <span className="font-bold text-primary">{score}</span>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={startGame} className="w-full">
              <RotateCw className="mr-2" />
              Play Again
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Garbage Sorting Challenge</h2>
          <p className="text-muted-foreground mt-1">Drag the waste item to the correct bin before time runs out!</p>
        </header>

        <Card className="max-w-4xl mx-auto overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">Score: <span className="text-primary">{score}</span></div>
              <div className="flex items-center text-2xl font-bold">
                <Timer className="mr-2 text-primary" />
                Time: <span className="text-primary">{timeLeft}s</span>
              </div>
            </div>
            <Progress value={(timeLeft / GAME_DURATION) * 100} className="mt-2 h-2" />
          </CardHeader>
          <CardContent className="min-h-[450px] flex flex-col items-center justify-between p-6 relative">
            {gameState === 'ready' && (
              <div className="flex flex-col items-center justify-center h-full">
                <Button size="lg" onClick={startGame}>Start Game</Button>
              </div>
            )}
            {gameState === 'playing' && (
              <>
                <div className={cn("transition-opacity", isDragging ? "opacity-30" : "opacity-100")}>
                  {currentItem ? (
                     <div
                        draggable
                        onDragStart={handleDragStart}
                        onDragEnd={() => setIsDragging(false)}
                        className="flex flex-col items-center gap-4 cursor-grab active:cursor-grabbing p-4 rounded-lg bg-card"
                     >
                       <currentItem.Icon className="w-28 h-28 text-foreground" />
                       <p className="text-xl font-semibold">{currentItem.name}</p>
                     </div>
                  ) : (
                    <p>Loading next item...</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  {bins.map((bin) => (
                    <div
                      key={bin.type}
                      onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                      }}
                      onDrop={() => handleDrop(bin.type)}
                      className={cn(
                        'flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed transition-all h-40',
                        bin.color, bin.textColor,
                         isDragging ? 'border-primary scale-105 bg-primary/10' : ''
                      )}
                    >
                      <bin.Icon className="w-16 h-16 mb-2" />
                      <span className="font-bold text-lg">{bin.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
          {gameState === 'playing' && (
              <CardFooter className="text-center justify-center bg-muted/30 py-3">
                  <p className="text-muted-foreground text-sm">Drag the item from the top and drop it into one of the bins below.</p>
              </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
