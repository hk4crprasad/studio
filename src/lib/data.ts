import { Car, Droplets, Landmark, Recycle, Trash2, Trees, Zap, Sun, Award } from 'lucide-react';
import { PlaceHolderImages } from './placeholder-images';

export const challenges = [
  {
    title: 'Waste Segregation Master',
    description: 'Properly segregate your waste into dry and wet for a week.',
    points: 100,
    icon: Recycle,
  },
  {
    title: 'Energy Saver',
    description: 'Reduce your electricity consumption by 10% this month.',
    points: 250,
    icon: Zap,
  },
  {
    title: 'Carpool Champion',
    description: 'Carpool to work or for errands at least 3 times this week.',
    points: 150,
    icon: Car,
  },
  {
    title: 'Water Wise',
    description: 'Reduce your daily water usage. Try taking shorter showers.',
    points: 80,
    icon: Droplets,
  },
  {
    title: 'No Plastic Week',
    description: 'Avoid using single-use plastic for an entire week.',
    points: 200,
    icon: Trash2,
  },
    {
    title: 'Plant a Tree',
    description: 'Plant a sapling in your community or donate to a tree plantation drive.',
    points: 300,
    icon: Trees,
  },
];

export const schemes = [
  {
    id: 'scheme-1',
    name: 'National Afforestation Programme (NAP)',
    description:
      'The National Afforestation Programme (NAP) is a flagship scheme for afforestation of degraded forest lands. It is implemented through State Forest Development Agencies, Forest Development Agencies, and Joint Forest Management Committees at the village level to promote reforestation and ecological restoration.',
  },
  {
    id: 'scheme-2',
    name: 'Solar Rooftop Subsidy Programme',
    description: 
      'Under this scheme, the government provides financial assistance for installing rooftop solar panels on residential houses. Homeowners can receive a subsidy for systems up to 10 kW, significantly reducing the initial setup cost and leading to lower electricity bills. The subsidy amount varies based on the system capacity.'
  },
  {
    id: 'scheme-3',
    name: 'PM-KUSUM Scheme',
    description:
      'The Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan (PM-KUSUM) scheme aims to increase income for farmers by providing a reliable source for irrigation. It promotes the installation of solar-powered agriculture pumps and the setup of grid-connected solar power plants in rural areas, encouraging the use of renewable energy in agriculture.',
  },
  {
    id: 'scheme-4',
    name: 'FAME India Scheme',
    description:
      'The Faster Adoption and Manufacturing of (Hybrid &) Electric Vehicles in India (FAME) scheme encourages the adoption of electric and hybrid vehicles. It provides upfront incentives on the purchase of electric vehicles, making them more affordable for consumers and helping to reduce air pollution and dependency on fossil fuels.'
  },
  {
    id: 'scheme-5',
    name: 'Swachh Bharat Mission',
    description:
      'A country-wide campaign to eliminate open defecation and improve solid waste management. It is a major step towards creating a cleaner India by promoting hygiene, waste segregation, and community participation in cleanliness drives.',
  },
  {
    id: 'scheme-6',
    name: 'National Clean Air Programme (NCAP)',
    description:
      'NCAP is a national-level strategy to tackle air pollution. It aims for a 20% to 30% reduction in Particulate Matter (PM) concentrations by 2024, with 2017 as the base year. The programme focuses on creating action plans for cities to improve air quality through monitoring and control measures.',
  },
   {
    id: 'scheme-7',
    name: 'Jal Jeevan Mission',
    description:
      'This mission aims to provide safe and adequate drinking water through individual household tap connections to all households in rural India by 2024. It promotes water conservation efforts and sustainable water source management, which is crucial for environmental balance and public health.',
  }
];

export const articles = [
  {
    slug: 'understanding-climate-change',
    title: 'Understanding the Basics of Climate Change',
    excerpt: 'Explore the fundamental science behind climate change, its causes, and its far-reaching consequences for our planet.',
    image: PlaceHolderImages.find(img => img.id === 'blog-climate-change'),
    author: 'Dr. Evelyn Reed',
    date: '2024-05-15',
  },
  {
    slug: 'the-cost-of-deforestation',
    title: 'The Hidden Costs of Deforestation',
    excerpt: 'Deforestation is more than just losing trees. It impacts biodiversity, climate patterns, and human livelihoods.',
    image: PlaceHolderImages.find(img => img.id === 'blog-deforestation'),
    author: 'Marcus Vance',
    date: '2024-05-10',
  },
  {
    slug: 'sustainable-urbanization',
    title: 'Building the Green Cities of Tomorrow',
    excerpt: 'As urban populations grow, how can we design cities that are both liveable and sustainable for future generations?',
    image: PlaceHolderImages.find(img => img.id === 'blog-urbanization'),
    author: 'Lena Petrova',
    date: '2024-05-05',
  },
  {
    slug: 'powering-the-future-with-renewables',
    title: 'Powering the Future: The Rise of Renewable Energy',
    excerpt: 'Solar, wind, and hydro are paving the way for a new energy era. Discover the latest innovations and challenges.',
    image: PlaceHolderImages.find(img => img.id === 'blog-renewable-energy'),
    author: 'Carlos Gomez',
    date: '2024-04-28',
  },
];
