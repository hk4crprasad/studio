'use client';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart as BarChartIcon, Bot, Gamepad2, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

const chartData = [
  { day: 'Mon', points: 50 },
  { day: 'Tue', points: 75 },
  { day: 'Wed', points: 60 },
  { day: 'Thu', points: 110 },
  { day: 'Fri', points: 90 },
  { day: 'Sat', points: 150 },
  { day: 'Sun', points: 120 },
];

const chartConfig = {
  points: {
    label: 'Points',
    color: 'hsl(var(--primary))',
  },
};

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            Welcome to EcoAction
          </h2>
          <p className="text-muted-foreground mt-1">
            Your journey to a more sustainable life starts here.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Eco Score
              </CardTitle>
              <CardDescription>
                Based on your recent activities and challenges.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">780</span>
                <span className="text-sm text-muted-foreground">points</span>
              </div>
              <div>
                <Progress value={78} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  You're doing great! Keep it up to reach the next level.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <BarChartIcon className="w-5 h-5" />
                Weekly Activity
              </CardTitle>
              <CardDescription>
                Points earned over the last 7 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-48 w-full">
                <BarChart data={chartData} accessibilityLayer>
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="points" fill="var(--color-points)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">Start a New Challenge</CardTitle>
              <CardDescription>
                Complete tasks to earn points and make a difference.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center text-center">
              <Gamepad2 className="w-20 h-20 text-muted-foreground/30" />
            </CardContent>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/challenges">Browse Challenges</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">Get AI-Powered Tips</CardTitle>
              <CardDescription>
                Personalized suggestions to reduce your carbon footprint.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center text-center">
              <Bot className="w-20 h-20 text-muted-foreground/30" />
            </CardContent>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/carbon-suggestions">Get Suggestions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
