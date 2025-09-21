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
import { CheckCircle, XCircle, Loader2, WandSparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateEcoSituation, EcoSituationOutput } from '@/ai/flows/generate-eco-situation';

type Scenario = EcoSituationOutput;

export default function SituationGamePage() {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadNewScenario = async () => {
    setIsLoading(true);
    setSelectedOption(null);
    setCurrentScenario(null);
    try {
      const scenario = await generateEcoSituation({ theme: 'everyday sustainability' });
      setCurrentScenario(scenario);
    } catch (error) {
      console.error("Failed to generate scenario:", error);
      toast({
        variant: "destructive",
        title: "Could not load new scenario",
        description: "There was an issue generating a new situation from the AI. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNewScenario();
  }, []);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    if (!currentScenario) return;

    const choice = currentScenario.options[index];
    if (choice.isCorrect) {
      toast({
        title: 'Good Choice!',
        description: choice.feedback,
      });
    }
  };

  const handleNext = () => {
    loadNewScenario();
  };

  const choice = selectedOption !== null && currentScenario ? currentScenario.options[selectedOption] : null;

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            AI Eco Situation Simulator
          </h2>
          <p className="text-muted-foreground mt-1">
            Make the most sustainable choice in these AI-generated situations.
          </p>
        </header>

        <Card className="max-w-xl mx-auto">
          <CardHeader>
            {isLoading ? (
                <div className="space-y-2">
                    <div className="font-headline text-center flex items-center justify-center gap-2 text-2xl">
                        <WandSparkles className="text-primary"/>
                        AI is creating a scenario...
                    </div>
                    <CardDescription className="text-center">Please wait a moment.</CardDescription>
                </div>
            ) : (
                currentScenario && (
                <>
                    <CardTitle className="font-headline">{currentScenario.title}</CardTitle>
                    <CardDescription className="pt-2 text-base">
                    {currentScenario.description}
                    </CardDescription>
                </>
            ))}
          </CardHeader>
          <CardContent className="space-y-4 min-h-[200px]">
            {isLoading ? (
                 <div className="flex flex-col items-center justify-center p-4 text-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                 </div>
            ) : currentScenario && selectedOption === null ? (
              <div className="grid grid-cols-1 gap-4">
                {currentScenario.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-3 whitespace-normal justify-start text-left"
                    onClick={() => handleOptionSelect(index)}
                  >
                    {option.text}
                  </Button>
                ))}
              </div>
            ) : (
                choice && (
                    <div className={`p-4 rounded-md border ${choice.isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                        <div className="flex items-start gap-3">
                            {choice.isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 mt-1" /> : <XCircle className="h-5 w-5 text-red-600 mt-1" />}
                            <div>
                               <h4 className="font-bold">{choice.isCorrect ? "Correct!" : "Not Quite..."}</h4>
                               <p className="text-sm">{choice.feedback}</p>
                            </div>
                        </div>
                    </div>
                )
            )}
          </CardContent>
          {(selectedOption !== null || !isLoading && !currentScenario) && (
             <CardFooter>
                <Button onClick={handleNext} className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Next Scenario
                </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
