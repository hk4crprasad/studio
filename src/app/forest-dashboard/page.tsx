'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TreePine, TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import { forestStatesData, getForestDataByState, getTotalForestCover, getForestTrends, ForestData } from '@/lib/forest-data';

export default function ForestDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<ForestData | null>(null);

  const totalForestCover = getTotalForestCover();
  const forestTrends = getForestTrends();
  const latestTrend = forestTrends[forestTrends.length - 1];
  const previousTrend = forestTrends[forestTrends.length - 2];
  const trendChange = latestTrend.totalCover - previousTrend.totalCover;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const foundState = getForestDataByState(searchQuery);
      setSelectedState(foundState || null);
    }
  };

  const handleStateClick = (state: ForestData) => {
    setSelectedState(state);
    setSearchQuery(state.state);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-green-800">Forest Area Dashboard</h1>
        <p className="text-xl text-gray-600">
          Track India's forest cover data and conservation progress
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Forest Data by State
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter state name (e.g., Madhya Pradesh, Odisha)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forest Cover</CardTitle>
            <TreePine className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalForestCover.toLocaleString()} km²
            </div>
            <p className="text-xs text-muted-foreground">
              Across major states
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Change</CardTitle>
            {trendChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${trendChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trendChange >= 0 ? '+' : ''}{trendChange.toLocaleString()} km²
            </div>
            <p className="text-xs text-muted-foreground">
              From 2022 to 2023
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">States Tracked</CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {forestStatesData.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Major forest states
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Selected State Details */}
      {selectedState && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="h-5 w-5 text-green-600" />
              {selectedState.state} Forest Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Forest Cover</p>
                <p className="text-2xl font-bold text-green-600">
                  {selectedState.forestCoverKm2.toLocaleString()} km²
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Forest Percentage</p>
                <p className="text-2xl font-bold text-blue-600">
                  {selectedState.forestCoverPercentage}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Very Dense Forest</p>
                <p className="text-xl font-semibold text-green-800">
                  {selectedState.veryDenseForest.toLocaleString()} km²
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Open Forest</p>
                <p className="text-xl font-semibold text-green-400">
                  {selectedState.openForest.toLocaleString()} km²
                </p>
              </div>
            </div>

            {/* Historical Trend */}
            <div>
              <h4 className="text-lg font-semibold mb-3">5-Year Forest Cover Trend</h4>
              <div className="space-y-2">
                {selectedState.yearData.map((year) => (
                  <div key={year.year} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{year.year}</span>
                    <span className="text-green-600">{year.forestCover.toLocaleString()} km²</span>
                    <Badge 
                      variant={year.changeFromPrevious >= 0 ? "default" : "destructive"}
                      className={year.changeFromPrevious >= 0 ? "bg-green-100 text-green-800" : ""}
                    >
                      {year.changeFromPrevious >= 0 ? '+' : ''}{year.changeFromPrevious} km²
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All States Overview */}
      <Card>
        <CardHeader>
          <CardTitle>All States Forest Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forestStatesData.map((state) => (
              <div
                key={state.state}
                onClick={() => handleStateClick(state)}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <h4 className="font-semibold text-lg">{state.state}</h4>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Forest Cover:</span> {state.forestCoverKm2.toLocaleString()} km²
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Forest %:</span> {state.forestCoverPercentage}%
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Dense: {state.veryDenseForest.toLocaleString()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Open: {state.openForest.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forest Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Forest Cover Trends (2019-2023)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forestTrends.map((trend, index) => {
              const isLatest = index === forestTrends.length - 1;
              const change = index > 0 ? trend.totalCover - forestTrends[index - 1].totalCover : 0;
              
              return (
                <div key={trend.year} className={`flex items-center justify-between p-3 rounded ${isLatest ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                  <span className="font-medium">{trend.year}</span>
                  <span className="text-green-600 font-semibold">
                    {trend.totalCover.toLocaleString()} km²
                  </span>
                  {index > 0 && (
                    <Badge 
                      variant={change >= 0 ? "default" : "destructive"}
                      className={change >= 0 ? "bg-green-100 text-green-800" : ""}
                    >
                      {change >= 0 ? '+' : ''}{change.toLocaleString()} km²
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}