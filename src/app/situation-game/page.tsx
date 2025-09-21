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
import { CheckCircle, XCircle, Loader2, WandSparkles, PartyPopper, RotateCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateEcoSituations, EcoSituation } from '@/ai/flows/generate-eco-situation';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

type Scenario = EcoSituation;

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array];

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }

    return newArray;
}

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिंदी' },
  { value: 'Bengali', label: 'বাংলা' },
  { value: 'Odia', label: 'ଓଡ଼ିଆ' },
];


export default function SituationGamePage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [language, setLanguage] = useState('English');
  const { toast } = useToast();

  const loadNewScenarios = async (lang: string) => {
    setIsLoading(true);
    setSelectedOption(null);
    setScenarios([]);
    setCurrentScenarioIndex(0);
    setScore(0);
    setIsGameComplete(false);
    try {
      const result = await generateEcoSituations({ theme: 'everyday sustainability', count: 10, language: lang });
      const shuffledScenarios = result.scenarios.map(scenario => ({
        ...scenario,
        options: shuffleArray(scenario.options)
      }));
      setScenarios(shuffledScenarios);
    } catch (error) {
      console.error("Failed to generate scenarios:", error);
      toast({
        variant: "destructive",
        title: "Could not load new scenarios",
        description: "There was an issue generating new situations from the AI. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNewScenarios(language);
  }, [language]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    if (scenarios.length === 0) return;

    const choice = scenarios[currentScenarioIndex].options[index];
    if (choice.isCorrect) {
      const points = 10;
      setScore(prev => prev + points);
      toast({
        title: 'Good Choice!',
        description: choice.feedback,
      });
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
    } else {
      // All scenarios completed
      setIsGameComplete(true);
    }
  };

  const handlePlayAgain = () => {
    loadNewScenarios(language);
  }

  const currentScenario = scenarios[currentScenarioIndex];
  const choice = selectedOption !== null && currentScenario ? currentScenario.options[selectedOption] : null;

  const totalPossiblePoints = scenarios.length * 10;

  return (
    <AppLayout>
      <AlertDialog open={isGameComplete} onOpenChange={setIsGameComplete}>
          <AlertDialogContent>
              <AlertDialogHeader className="items-center text-center">
                  <PartyPopper className="w-16 h-16 text-primary" />
                  <AlertDialogTitle className="font-headline text-3xl">Congratulations!</AlertDialogTitle>
                  <AlertDialogDescription className="text-lg">
                      You've completed all the scenarios!
                  </AlertDialogDescription>
                  <div className="pt-4 text-2xl">
                    Your final score is: <span className="font-bold text-primary">{score} / {totalPossiblePoints}</span>
                  </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <Button onClick={handlePlayAgain} className="w-full">
                      <RotateCw className="mr-2" />
                      Play Again
                  </Button>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">
              AI Eco Situation Simulator
            </h2>
            <p className="text-muted-foreground mt-1">
            {scenarios.length > 0 ? `Make the most sustainable choice. (${currentScenarioIndex + 1} of ${scenarios.length})` : 'Loading scenarios...'}
            </p>
          </div>
           <div className="w-48">
            <Select onValueChange={handleLanguageChange} defaultValue={language}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            {isLoading && scenarios.length === 0 ? (
                <div className="space-y-2">
                    <div className="font-headline text-center flex items-center justify-center gap-2 text-2xl">
                        <WandSparkles className="text-primary"/>
                        AI is creating scenarios...
                    </div>
                    <CardDescription className="text-center">Please wait a moment.</CardDescription>
                </div>
            ) : (
                currentScenario && (
                <>
                    <CardTitle className="font-headline text-center">{currentScenario.title}</CardTitle>
                    <CardDescription className="pt-2 text-base text-center">
                    {currentScenario.description}
                    </CardDescription>
                </>
            ))}
          </CardHeader>
          <CardContent className="space-y-4 min-h-[250px] flex flex-col justify-center">
            {isLoading && scenarios.length === 0 ? (
                 <div className="flex flex-col items-center justify-center p-4 text-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                 </div>
            ) : currentScenario && selectedOption === null ? (
              <div className="grid grid-cols-1 gap-4">
                {currentScenario.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-4 whitespace-normal justify-start text-left text-base"
                    onClick={() => handleOptionSelect(index)}
                  >
                    {option.text}
                  </Button>
                ))}
              </div>
            ) : (
                choice && (
                    <div className={cn(
                      'p-4 rounded-md border text-center',
                      choice.isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'
                    )}>
                        <div className="flex flex-col items-center gap-3">
                            {choice.isCorrect ? <CheckCircle className="h-8 w-8 text-green-600" /> : <XCircle className="h-8 w-8 text-red-600" />}
                            <div>
                               <h4 className="font-bold text-lg">{choice.isCorrect ? "Correct!" : "Not Quite..."}</h4>
                               <p className="text-sm">{choice.feedback}</p>
                            </div>
                        </div>
                    </div>
                )
            )}
          </CardContent>
          {(selectedOption !== null || (!isLoading && !currentScenario)) && (
             <CardFooter>
                <Button onClick={handleNext} className="w-full" disabled={isLoading && scenarios.length > 0}>
                    {isLoading && scenarios.length > 0 ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    {currentScenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Finish & See Score'}
                </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
