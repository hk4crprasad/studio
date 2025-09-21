import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { challenges } from '@/lib/data';

export default function ChallengesPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            Sustainability Challenges
          </h2>
          <p className="text-muted-foreground mt-1">
            Join a challenge, earn points, and make a real-world impact.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="flex-shrink-0">
                    <challenge.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-grow">
                  <CardTitle className="font-headline text-lg">{challenge.title}</CardTitle>
                  <CardDescription className="text-sm">{challenge.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow"></CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="font-bold text-primary">{challenge.points} Points</div>
                <Button>Accept Challenge</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
