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
import { generateCarbonQuiz, CarbonQuizQuestion } from '@/ai/flows/generate-carbon-quiz';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

type Question = CarbonQuizQuestion;

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

export default function CarbonQuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const { toast } = useToast();

  const loadNewQuestions = async () => {
    setIsLoading(true);
    setSelectedOption(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsGameComplete(false);
    try {
      const result = await generateCarbonQuiz({ count: 10 });
      const shuffledQuestions = result.questions.map(question => ({
        ...question,
        options: shuffleArray(question.options)
      }));
      setQuestions(shuffledQuestions);
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      toast({
        variant: "destructive",
        title: "Could not load new quiz",
        description: "There was an issue generating new questions from the AI. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNewQuestions();
  }, []);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    if (questions.length === 0) return;

    const choice = questions[currentQuestionIndex].options[index];
    if (choice.isCorrect) {
      const points = 10;
      setScore(prev => prev + points);
      toast({
        title: 'Correct!',
        description: choice.feedback,
      });
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsGameComplete(true);
    }
  };

  const handlePlayAgain = () => {
    loadNewQuestions();
  }

  const currentQuestion = questions[currentQuestionIndex];
  const choice = selectedOption !== null && currentQuestion ? currentQuestion.options[selectedOption] : null;

  const totalPossiblePoints = questions.length * 10;

  return (
    <AppLayout>
      <AlertDialog open={isGameComplete} onOpenChange={setIsGameComplete}>
          <AlertDialogContent>
              <AlertDialogHeader className="items-center text-center">
                  <PartyPopper className="w-16 h-16 text-primary" />
                  <AlertDialogTitle className="font-headline text-3xl">Quiz Complete!</AlertDialogTitle>
                  <AlertDialogDescription className="text-lg">
                      You've answered all the questions!
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
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            AI Carbon IQ Challenge
          </h2>
          <p className="text-muted-foreground mt-1">
           {questions.length > 0 ? `Test your knowledge. (${currentQuestionIndex + 1} of ${questions.length})` : 'Loading questions...'}
          </p>
        </header>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            {isLoading && questions.length === 0 ? (
                <div className="space-y-2">
                    <div className="font-headline text-center flex items-center justify-center gap-2 text-2xl">
                        <WandSparkles className="text-primary"/>
                        AI is creating your quiz...
                    </div>
                    <CardDescription className="text-center">Please wait a moment.</CardDescription>
                </div>
            ) : (
                currentQuestion && (
                <>
                    <CardTitle className="font-headline text-xl text-center">{currentQuestion.question}</CardTitle>
                </>
            ))}
          </CardHeader>
          <CardContent className="space-y-4 min-h-[250px] flex flex-col justify-center">
            {isLoading && questions.length === 0 ? (
                 <div className="flex flex-col items-center justify-center p-4 text-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                 </div>
            ) : currentQuestion && selectedOption === null ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-4 whitespace-normal justify-center text-center text-base"
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
          {(selectedOption !== null || (!isLoading && !currentQuestion)) && (
             <CardFooter>
                <Button onClick={handleNext} className="w-full" disabled={isLoading && questions.length > 0}>
                    {isLoading && questions.length > 0 ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish & See Score'}
                </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
