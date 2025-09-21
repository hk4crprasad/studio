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
import { generateEcoSituations, EcoSituation } from '@/ai/flows/generate-eco-situation';

type Scenario = EcoSituation;

export default function SituationGamePage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadNewScenarios = async () => {
    setIsLoading(true);
    setSelectedOption(null);
    setScenarios([]);
    setCurrentScenarioIndex(0);
    try {
      const result = await generateEcoSituations({ theme: 'everyday sustainability', count: 10 });
      setScenarios(result.scenarios);
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
    loadNewScenarios();
  }, []);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    if (scenarios.length === 0) return;

    const choice = scenarios[currentScenarioIndex].options[index];
    if (choice.isCorrect) {
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
      // All scenarios completed, load a new batch
      loadNewScenarios();
    }
  };

  const currentScenario = scenarios[currentScenarioIndex];
  const choice = selectedOption !== null && currentScenario ? currentScenario.options[selectedOption] : null;

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            AI Eco Situation Simulator
          </h2>
          <p className="text-muted-foreground mt-1">
            Make the most sustainable choice in these AI-generated situations. ({currentScenarioIndex + 1} of {scenarios.length})
          </p>
        </header>

        <Card className="max-w-xl mx-auto">
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
                    <CardTitle className="font-headline">{currentScenario.title}</CardTitle>
                    <CardDescription className="pt-2 text-base">
                    {currentScenario.description}
                    </CardDescription>
                </>
            ))}
          </CardHeader>
          <CardContent className="space-y-4 min-h-[200px]">
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
          {(selectedOption !== null || (!isLoading && !currentScenario)) && (
             <CardFooter>
                <Button onClick={handleNext} className="w-full" disabled={isLoading && scenarios.length > 0}>
                    {isLoading && scenarios.length > 0 ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    {currentScenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Play Again'}
                </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
