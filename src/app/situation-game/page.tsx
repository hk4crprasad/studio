'use client';
import { useState } from 'react';
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
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const scenarios = [
  {
    title: 'The Coffee Cup Dilemma',
    description: 'You just finished your morning coffee from a local cafe. The cup is paper, but the lid is plastic. There is a recycling bin and a regular trash can nearby. What do you do?',
    options: [
      { text: 'Throw the whole thing in the trash.', isCorrect: false, feedback: "Convenient, but the paper cup could have been recycled. Let's try to separate next time." },
      { text: 'Throw the whole thing in the recycling.', isCorrect: false, feedback: "Close! But the plastic lid often can't be recycled with paper. This is called 'wish-cycling' and can contaminate the recycling stream." },
      { text: 'Separate the plastic lid (trash) and the paper cup (recycle).', isCorrect: true, feedback: 'Excellent choice! Separating items correctly is key to effective recycling. You earned 10 eco-points!' },
    ],
  },
   {
    title: 'Grocery Shopping',
    description: 'You are at the supermarket and forgot your reusable bags at home. What is your course of action?',
    options: [
      { text: 'Buy new reusable bags at the store.', isCorrect: true, feedback: "Great thinking! It's a small investment to avoid plastic waste. You've earned 15 eco-points!" },
      { text: 'Use the plastic bags provided by the store.', isCorrect: false, feedback: 'While convenient, this adds to plastic pollution. Try to remember your bags next time!' },
      { text: 'Try to carry as many items as you can without any bag.', isCorrect: false, feedback: "A for effort! But this might not be practical and could lead to damaged goods. Keeping a foldable bag in your car or backpack is a great habit." },
    ],
  },
   {
    title: 'The Leaky Faucet',
    description: 'You notice the faucet in your kitchen has been dripping slowly for a few days. What should you do?',
    options: [
      { text: 'Ignore it, it\'s just a small drip.', isCorrect: false, feedback: 'Even a small drip can waste thousands of gallons of water per year! It\'s best to address it.' },
      { text: 'Try to fix it yourself by watching an online tutorial.', isCorrect: true, feedback: 'Good initiative! Many minor leaks can be fixed with simple tools. You saved water and money. You earned 20 eco-points!' },
      { text: 'Call a plumber immediately.', isCorrect: true, feedback: "A great choice if you're not comfortable with DIY. The important thing is getting it fixed. You earned 15 eco-points!" },
    ],
  },
];

export default function SituationGamePage() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { toast } = useToast();

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    const choice = scenarios[scenarioIndex].options[index];
    if (choice.isCorrect) {
        toast({
            title: 'Good Choice!',
            description: choice.feedback,
        })
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setScenarioIndex((prev) => (prev + 1) % scenarios.length);
  }

  const currentScenario = scenarios[scenarioIndex];
  const choice = selectedOption !== null ? currentScenario.options[selectedOption] : null;

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            Eco Situation Simulator
          </h2>
          <p className="text-muted-foreground mt-1">
            Make the most sustainable choice in these everyday situations.
          </p>
        </header>

        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline">{currentScenario.title}</CardTitle>
            <CardDescription className="pt-2 text-base">
              {currentScenario.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedOption === null ? (
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
          {selectedOption !== null && (
             <CardFooter>
                <Button onClick={handleNext} className="w-full">
                    Next Scenario
                </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
