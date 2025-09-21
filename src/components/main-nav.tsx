'use client';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  BarChart,
  Bot,
  Gamepad2,
  Landmark,
  Newspaper,
  Puzzle,
  ClipboardCheck,
  BrainCircuit,
  ShoppingCart,
  Recycle,
  BookMarked,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MainNav() {
  const pathname = usePathname();
  const menuItems = [
    { href: '/', label: 'Dashboard', icon: BarChart },
    { href: '/challenges', label: 'Challenges', icon: Gamepad2 },
    { href: '/store', label: 'Green Store', icon: ShoppingCart },
    { href: '/schemes', label: 'Govt. Schemes', icon: Landmark },
    { href: '/blog', label: 'Blog', icon: Newspaper },
    { href: '/carbon-suggestions', label: 'AI Suggestions', icon: Bot },
    { href: '/puzzle-game', label: 'Eco Word Scramble', icon: Puzzle },
    { href: '/situation-game', label: 'Eco Situation', icon: ClipboardCheck },
    { href: '/carbon-quiz', label: 'Carbon IQ Challenge', icon: BrainCircuit },
    { href: '/garbage-sorting-game', label: 'Garbage Sorting', icon: Recycle },
    { href: '/eco-story-game', label: 'Eco-Story Game', icon: BookMarked },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href) && (item.href === '/' ? pathname === '/' : true)}
            tooltip={{
              children: item.label,
              side: 'right',
              align: 'center',
            }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
