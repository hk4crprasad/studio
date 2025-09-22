'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Leaf, TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';
import { analyzeCarbonFootprint } from '@/ai/flows/analyze-carbon-footprint';
import { 
  CarbonAnalysis, 
  sampleCarbonEntries, 
  getCarbonScore, 
  getCarbonScoreColor, 
  getWeeklyCarbonData,
  CarbonActivity 
} from '@/lib/carbon-tracker-data';

export default function CarbonTracker() {
  const [activities, setActivities] = useState('');
  const [language, setLanguage] = useState('English');
  const [analysis, setAnalysis] = useState<CarbonAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [carbonEntries, setCarbonEntries] = useState<CarbonActivity[]>(sampleCarbonEntries);

  const weeklyData = getWeeklyCarbonData(carbonEntries);
  const totalWeeklyImpact = weeklyData.reduce((sum, day) => sum + day.impact, 0);

  const handleAnalyze = async () => {
    if (!activities.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeCarbonFootprint({
        activities,
        language,
        date: new Date().toISOString().split('T')[0]
      });
      setAnalysis(result);

      // Add new entries to the tracker
      const newEntries: CarbonActivity[] = result.activities.map((activity, index) => ({
        id: `${Date.now()}-${index}`,
        activity: activity.activity,
        category: activity.category,
        carbonImpact: activity.carbonImpact,
        timestamp: new Date(),
        description: activity.explanation
      }));

      setCarbonEntries(prev => [...newEntries, ...prev].slice(0, 50)); // Keep last 50 entries
    } catch (error) {
      console.error('Error analyzing carbon footprint:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const languages = [
    'English', 'Hindi', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Dutch',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Bengali', 'Tamil', 'Telugu',
    'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia'
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-green-800">Carbon Tracker</h1>
        <p className="text-xl text-gray-600">
          Track your daily activities and get AI-powered carbon footprint analysis
        </p>
      </div>

      {/* Activity Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            What did you do today?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe your activities today... For example: 
- Drove 20km to work in petrol car
- Used LED lights for 6 hours
- Ate a vegetarian lunch from local restaurant
- Recycled 3 plastic bottles
- Walked 2km in the evening
- Used air conditioning for 4 hours"
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            rows={6}
          />
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Response Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAnalyze} 
              disabled={!activities.trim() || isAnalyzing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Carbon Impact'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
                <TrendingUp className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  +{analysis.totalEmissions.toFixed(2)} kg
                </div>
                <p className="text-xs text-muted-foreground">CO₂ equivalent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reductions</CardTitle>
                <TrendingDown className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {analysis.totalReductions.toFixed(2)} kg
                </div>
                <p className="text-xs text-muted-foreground">CO₂ equivalent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Impact</CardTitle>
                <Leaf className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${analysis.netImpact <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.netImpact > 0 ? '+' : ''}{analysis.netImpact.toFixed(2)} kg
                </div>
                <p className="text-xs text-muted-foreground">CO₂ equivalent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Score</CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold capitalize ${getCarbonScoreColor(analysis.score)}`}>
                  {analysis.score}
                </div>
                <p className="text-xs text-muted-foreground">Environmental impact</p>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
            </CardContent>
          </Card>

          {/* Activity Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Badge 
                      variant={activity.type === 'reduction' ? 'default' : 'destructive'}
                      className={activity.type === 'reduction' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {activity.category}
                    </Badge>
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.activity}</h4>
                      <p className="text-sm text-gray-600 mt-1">{activity.explanation}</p>
                    </div>
                    <div className={`font-semibold ${activity.carbonImpact <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {activity.carbonImpact > 0 ? '+' : ''}{activity.carbonImpact.toFixed(2)} kg CO₂
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Weekly Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Carbon Impact Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Weekly Total</p>
              <p className={`text-2xl font-bold ${totalWeeklyImpact <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalWeeklyImpact > 0 ? '+' : ''}{totalWeeklyImpact.toFixed(2)} kg
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Daily Average</p>
              <p className="text-xl font-semibold text-blue-600">
                {(totalWeeklyImpact / 7).toFixed(2)} kg
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Day</p>
              <p className="text-lg font-medium text-green-600">
                {weeklyData.reduce((best, day) => day.impact < best.impact ? day : best).day}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Entries</p>
              <p className="text-xl font-semibold text-purple-600">
                {carbonEntries.length}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold mb-3">Daily Breakdown</h4>
            {weeklyData.map((day) => (
              <div key={day.date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">{day.day}</span>
                <span className="text-sm text-gray-600">{day.date}</span>
                <span className={`font-semibold ${day.impact <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {day.impact > 0 ? '+' : ''}{day.impact.toFixed(2)} kg CO₂
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {carbonEntries.slice(0, 10).map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <Badge variant="outline">{entry.category}</Badge>
                <div className="flex-1">
                  <h4 className="font-medium">{entry.activity}</h4>
                  {entry.description && (
                    <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div className={`font-semibold ${entry.carbonImpact <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {entry.carbonImpact > 0 ? '+' : ''}{entry.carbonImpact.toFixed(2)} kg CO₂
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}