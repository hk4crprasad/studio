import { Car, Droplets, Landmark, Recycle, Trash2, Trees, Zap } from 'lucide-react';
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
      'The National Afforestation Programme (NAP) is a flagship scheme of the Ministry of Environment, Forest and Climate Change for afforestation of degraded forest lands. It is being implemented through a decentralized mechanism of State Forest Development Agency (SFDA) at the state level, Forest Development Agency (FDA) at the forest division level, and Joint Forest Management Committees (JFMCs) at the village level.',
  },
  {
    id: 'scheme-2',
    name: 'Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan (PM-KUSUM)',
    description:
      'The PM-KUSUM scheme aims to enhance income for farmers and provide a reliable source for irrigation. It promotes the installation of solar-powered agriculture pumps and setting up of grid-connected solar power plants in rural areas.',
  },
  {
    id: 'scheme-3',
    name: 'Swachh Bharat Mission',
    description:
      'A country-wide campaign initiated by the Government of India in 2014 to eliminate open defecation and improve solid waste management. It is a major step towards creating a cleaner and more sustainable India.',
  },
  {
    id: 'scheme-4',
    name: 'National Clean Air Programme (NCAP)',
    description:
      'NCAP is a long-term, time-bound, national level strategy to tackle the air pollution problem across the country in a comprehensive manner. It targets to achieve a 20% to 30% reduction in Particulate Matter concentrations by 2024 keeping 2017 as the base year for the comparison of concentration.',
  },
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
