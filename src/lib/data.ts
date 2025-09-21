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
    id: 'scheme-2',
    name: 'Solar Rooftop Subsidy Programme',
    description: 
      'Install rooftop solar panels on residential houses and reduce electricity bills. This programme promotes renewable energy adoption at the household level.',
    subsidy: 'Subsidy for residential systems up to 10 kW. The amount varies based on the system capacity and location.',
    link: 'https://solarrooftop.gov.in/',
  },
  {
    id: 'scheme-4',
    name: 'FAME India Scheme',
    description:
      'The Faster Adoption and Manufacturing of (Hybrid &) Electric Vehicles (FAME) scheme encourages the adoption of electric and hybrid vehicles.',
    subsidy: 'Provides upfront incentives on the purchase of electric vehicles, making them more affordable and helping to reduce air pollution.',
    link: 'https://fame2.heavyindustries.gov.in/',
  },
  {
    id: 'scheme-3',
    name: 'PM-KUSUM Scheme',
    description:
      'This scheme helps farmers install solar-powered agriculture pumps and set up grid-connected solar power plants in rural areas.',
    subsidy: 'Provides financial assistance and subsidies to farmers for installing solar pumps, promoting renewable energy in agriculture.',
    link: 'https://pmkusum.mnre.gov.in/',
  },
  {
    id: 'scheme-1',
    name: 'National Afforestation Programme (NAP)',
    description:
      'A flagship scheme for afforestation of degraded forest lands. It promotes reforestation and ecological restoration through community participation.',
    subsidy: 'Funding is provided to state forest development agencies for implementation. Benefits are ecological rather than direct financial aid to individuals.',
    link: 'https://moef.gov.in/en/division/forest-protection-and-restoration-division-fp-division/national-afforestation-programme-nap/',
  },
  {
    id: 'scheme-5',
    name: 'Swachh Bharat Mission',
    description:
      'A country-wide campaign to eliminate open defecation and improve solid waste management, aiming to create a cleaner India.',
    subsidy: 'Focuses on building community and public toilets and promoting civic sense. Direct financial subsidies are available for toilet construction.',
    link: 'https://swachhbharatmission.gov.in/',
  },
  {
    id: 'scheme-6',
    name: 'National Clean Air Programme (NCAP)',
    description:
      'NCAP is a national-level strategy to tackle air pollution across the country, with a goal to reduce particulate matter concentrations.',
    subsidy: 'Funds are allocated to cities to implement action plans for air quality improvement. This is an indirect benefit to citizens through a healthier environment.',
    link: 'https://prana.cpcb.gov.in/#/login',
  },
   {
    id: 'scheme-7',
    name: 'Jal Jeevan Mission',
    description:
      'This mission aims to provide safe and adequate drinking water through individual household tap connections to all households in rural India.',
    subsidy: 'Focuses on infrastructure development to provide tap water, a fundamental necessity. The benefit is access to clean water rather than a direct subsidy.',
    link: 'https://jaljeevanmission.gov.in/',
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

export const greenProducts = [
  {
    id: 'prod-1',
    name: 'Bamboo Toothbrush Set',
    description: 'A set of 4 biodegradable bamboo toothbrushes. A great alternative to plastic.',
    price: 12.99,
    image: PlaceHolderImages.find(img => img.id === 'product-bamboo-toothbrush'),
  },
  {
    id: 'prod-2',
    name: 'Reusable Shopping Bag',
    description: 'A stylish and durable shopping bag made from recycled cotton. Folds up for easy storage.',
    price: 15.50,
    image: PlaceHolderImages.find(img => img.id === 'product-reusable-bag'),
  },
  {
    id: 'prod-3',
    name: 'Portable Solar Charger',
    description: 'Charge your devices on the go with this compact and efficient solar-powered charger.',
    price: 45.00,
    image: PlaceHolderImages.find(img => img.id === 'product-solar-charger'),
  },
  {
    id: 'prod-4',
    name: 'Kitchen Compost Bin',
    description: 'A sleek and odorless compost bin for your kitchen scraps. Perfect for starting to compost.',
    price: 29.99,
    image: PlaceHolderImages.find(img => img.id === 'product-compost-bin'),
  },
  {
    id: 'prod-5',
    name: 'LED Light Bulbs (4-Pack)',
    description: 'Energy-efficient LED bulbs that use up to 80% less energy than traditional incandescent bulbs.',
    price: 19.99,
    image: PlaceHolderImages.find(img => img.id === 'product-led-bulbs'),
  },
  {
    id: 'prod-6',
    name: 'Water-Saving Shower Head',
    description: 'Reduce water consumption in your daily showers without sacrificing pressure.',
    price: 35.00,
    image: PlaceHolderImages.find(img => img.id === 'product-shower-head'),
  },
];
