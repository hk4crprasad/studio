// Forest cover data for Indian states (demo data based on India State Forest Report)
export interface ForestData {
  state: string;
  forestCoverKm2: number;
  forestCoverPercentage: number;
  veryDenseForest: number;
  moderatelyDenseForest: number;
  openForest: number;
  yearData: YearlyForestData[];
  coordinates: [number, number]; // [lat, lng]
}

export interface YearlyForestData {
  year: number;
  forestCover: number;
  changeFromPrevious: number;
}

// Demo forest data for major Indian states
export const forestStatesData: ForestData[] = [
  {
    state: "Madhya Pradesh",
    forestCoverKm2: 77414,
    forestCoverPercentage: 25.11,
    veryDenseForest: 4075,
    moderatelyDenseForest: 38934,
    openForest: 34405,
    coordinates: [23.2599, 77.4126],
    yearData: [
      { year: 2019, forestCover: 77482, changeFromPrevious: 0 },
      { year: 2020, forestCover: 77414, changeFromPrevious: -68 },
      { year: 2021, forestCover: 77414, changeFromPrevious: 0 },
      { year: 2022, forestCover: 77440, changeFromPrevious: 26 },
      { year: 2023, forestCover: 77480, changeFromPrevious: 40 },
    ]
  },
  {
    state: "Arunachal Pradesh",
    forestCoverKm2: 66964,
    forestCoverPercentage: 79.96,
    veryDenseForest: 12621,
    moderatelyDenseForest: 31616,
    openForest: 22727,
    coordinates: [28.2180, 94.7278],
    yearData: [
      { year: 2019, forestCover: 66688, changeFromPrevious: 0 },
      { year: 2020, forestCover: 66964, changeFromPrevious: 276 },
      { year: 2021, forestCover: 66964, changeFromPrevious: 0 },
      { year: 2022, forestCover: 67010, changeFromPrevious: 46 },
      { year: 2023, forestCover: 67080, changeFromPrevious: 70 },
    ]
  },
  {
    state: "Chhattisgarh",
    forestCoverKm2: 55611,
    forestCoverPercentage: 41.09,
    veryDenseForest: 4449,
    moderatelyDenseForest: 26267,
    openForest: 24895,
    coordinates: [21.2787, 81.8661],
    yearData: [
      { year: 2019, forestCover: 55547, changeFromPrevious: 0 },
      { year: 2020, forestCover: 55611, changeFromPrevious: 64 },
      { year: 2021, forestCover: 55611, changeFromPrevious: 0 },
      { year: 2022, forestCover: 55650, changeFromPrevious: 39 },
      { year: 2023, forestCover: 55720, changeFromPrevious: 70 },
    ]
  },
  {
    state: "Odisha",
    forestCoverKm2: 51619,
    forestCoverPercentage: 33.16,
    veryDenseForest: 2703,
    moderatelyDenseForest: 26329,
    openForest: 22587,
    coordinates: [20.9517, 85.0985],
    yearData: [
      { year: 2019, forestCover: 51345, changeFromPrevious: 0 },
      { year: 2020, forestCover: 51619, changeFromPrevious: 274 },
      { year: 2021, forestCover: 51619, changeFromPrevious: 0 },
      { year: 2022, forestCover: 51680, changeFromPrevious: 61 },
      { year: 2023, forestCover: 51750, changeFromPrevious: 70 },
    ]
  },
  {
    state: "Maharashtra",
    forestCoverKm2: 50778,
    forestCoverPercentage: 16.47,
    veryDenseForest: 2188,
    moderatelyDenseForest: 23347,
    openForest: 25243,
    coordinates: [19.7515, 75.7139],
    yearData: [
      { year: 2019, forestCover: 50682, changeFromPrevious: 0 },
      { year: 2020, forestCover: 50778, changeFromPrevious: 96 },
      { year: 2021, forestCover: 50778, changeFromPrevious: 0 },
      { year: 2022, forestCover: 50820, changeFromPrevious: 42 },
      { year: 2023, forestCover: 50890, changeFromPrevious: 70 },
    ]
  },
  {
    state: "Telangana",
    forestCoverKm2: 26904,
    forestCoverPercentage: 24.03,
    veryDenseForest: 1366,
    moderatelyDenseForest: 11418,
    openForest: 14120,
    coordinates: [18.1124, 79.0193],
    yearData: [
      { year: 2019, forestCover: 26904, changeFromPrevious: 0 },
      { year: 2020, forestCover: 26904, changeFromPrevious: 0 },
      { year: 2021, forestCover: 26904, changeFromPrevious: 0 },
      { year: 2022, forestCover: 26940, changeFromPrevious: 36 },
      { year: 2023, forestCover: 27000, changeFromPrevious: 60 },
    ]
  },
  {
    state: "Karnataka",
    forestCoverKm2: 38720,
    forestCoverPercentage: 20.19,
    veryDenseForest: 1206,
    moderatelyDenseForest: 18412,
    openForest: 19102,
    coordinates: [15.3173, 75.7139],
    yearData: [
      { year: 2019, forestCover: 38575, changeFromPrevious: 0 },
      { year: 2020, forestCover: 38720, changeFromPrevious: 145 },
      { year: 2021, forestCover: 38720, changeFromPrevious: 0 },
      { year: 2022, forestCover: 38780, changeFromPrevious: 60 },
      { year: 2023, forestCover: 38850, changeFromPrevious: 70 },
    ]
  },
  {
    state: "Jharkhand",
    forestCoverKm2: 23605,
    forestCoverPercentage: 29.61,
    veryDenseForest: 1194,
    moderatelyDenseForest: 9889,
    openForest: 12522,
    coordinates: [23.6102, 85.2799],
    yearData: [
      { year: 2019, forestCover: 23473, changeFromPrevious: 0 },
      { year: 2020, forestCover: 23605, changeFromPrevious: 132 },
      { year: 2021, forestCover: 23605, changeFromPrevious: 0 },
      { year: 2022, forestCover: 23650, changeFromPrevious: 45 },
      { year: 2023, forestCover: 23720, changeFromPrevious: 70 },
    ]
  }
];

export const getForestDataByState = (stateName: string): ForestData | undefined => {
  return forestStatesData.find(data => 
    data.state.toLowerCase().includes(stateName.toLowerCase())
  );
};

export const getTotalForestCover = (): number => {
  return forestStatesData.reduce((total, state) => total + state.forestCoverKm2, 0);
};

export const getForestTrends = () => {
  const years = [2019, 2020, 2021, 2022, 2023];
  return years.map(year => {
    const totalCover = forestStatesData.reduce((total, state) => {
      const yearData = state.yearData.find(y => y.year === year);
      return total + (yearData?.forestCover || 0);
    }, 0);
    return { year, totalCover };
  });
};