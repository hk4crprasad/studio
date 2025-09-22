// Carbon tracking data types and AI analysis
export interface CarbonActivity {
  id: string;
  activity: string;
  category: 'transport' | 'energy' | 'food' | 'waste' | 'consumption';
  carbonImpact: number; // in kg CO2
  timestamp: Date;
  description?: string;
}

export interface CarbonTrackerInput {
  activities: string;
  date?: string;
  language?: string;
}

export interface CarbonAnalysis {
  totalEmissions: number;
  totalReductions: number;
  netImpact: number;
  activities: AnalyzedActivity[];
  recommendations: string[];
  score: 'excellent' | 'good' | 'average' | 'poor';
  summary: string;
}

export interface AnalyzedActivity {
  activity: string;
  category: 'transport' | 'energy' | 'food' | 'waste' | 'consumption';
  carbonImpact: number;
  type: 'emission' | 'reduction';
  explanation: string;
}

// Common carbon emission factors (kg CO2)
export const carbonFactors = {
  transport: {
    'car_petrol_1km': 0.21,
    'car_diesel_1km': 0.17,
    'bus_1km': 0.089,
    'train_1km': 0.041,
    'metro_1km': 0.028,
    'bike_1km': 0,
    'walk_1km': 0,
    'flight_domestic_1km': 0.255,
    'flight_international_1km': 0.298,
    'auto_rickshaw_1km': 0.15
  },
  energy: {
    'electricity_1kwh': 0.82,
    'lpg_1kg': 2.98,
    'natural_gas_1m3': 2.0,
    'coal_1kg': 2.86,
    'solar_panel_1kwh': 0.041,
    'led_bulb_1hour': 0.008,
    'ac_1hour': 1.2,
    'fan_1hour': 0.075
  },
  food: {
    'beef_1kg': 60,
    'chicken_1kg': 6.9,
    'fish_1kg': 5.4,
    'rice_1kg': 2.7,
    'wheat_1kg': 1.4,
    'vegetables_1kg': 2.0,
    'dairy_milk_1l': 3.2,
    'local_food_1meal': -0.5, // negative for local sourcing
    'organic_food_1meal': -0.3
  },
  waste: {
    'plastic_bottle_recycled': -0.25,
    'paper_recycled_1kg': -0.7,
    'composting_1kg': -0.5,
    'landfill_waste_1kg': 0.5,
    'e_waste_recycled_1kg': -2.0
  },
  consumption: {
    'new_clothing_1item': 10,
    'secondhand_clothing_1item': 0.5,
    'tree_planted': -22,
    'reusable_bag_use': -0.006,
    'water_bottle_reuse': -0.15
  }
};

// Sample carbon tracker entries for demo
export const sampleCarbonEntries: CarbonActivity[] = [
  {
    id: '1',
    activity: 'Walked 5km to work',
    category: 'transport',
    carbonImpact: 0,
    timestamp: new Date('2024-09-20'),
    description: 'Used walking instead of car'
  },
  {
    id: '2',
    activity: 'Used LED bulbs for 8 hours',
    category: 'energy',
    carbonImpact: 0.064,
    timestamp: new Date('2024-09-20')
  },
  {
    id: '3',
    activity: 'Ate locally sourced vegetarian meal',
    category: 'food',
    carbonImpact: -0.5,
    timestamp: new Date('2024-09-20')
  },
  {
    id: '4',
    activity: 'Recycled 5 plastic bottles',
    category: 'waste',
    carbonImpact: -1.25,
    timestamp: new Date('2024-09-20')
  },
  {
    id: '5',
    activity: 'Planted a tree',
    category: 'consumption',
    carbonImpact: -22,
    timestamp: new Date('2024-09-19')
  }
];

export const getCarbonScore = (netImpact: number): 'excellent' | 'good' | 'average' | 'poor' => {
  if (netImpact <= -10) return 'excellent';
  if (netImpact <= -2) return 'good';
  if (netImpact <= 5) return 'average';
  return 'poor';
};

export const getCarbonScoreColor = (score: string): string => {
  switch (score) {
    case 'excellent': return 'text-green-600';
    case 'good': return 'text-blue-600';
    case 'average': return 'text-yellow-600';
    case 'poor': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const getWeeklyCarbonData = (entries: CarbonActivity[]) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  return last7Days.map(date => {
    const dayEntries = entries.filter(entry => 
      entry.timestamp.toISOString().split('T')[0] === date
    );
    const totalImpact = dayEntries.reduce((sum, entry) => sum + entry.carbonImpact, 0);
    return {
      date,
      impact: totalImpact,
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    };
  });
};