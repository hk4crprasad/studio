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
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MainNav() {
  const pathname = usePathname();
  const menuItems = [
    { href: '/', label: 'Dashboard', icon: BarChart },
    { href: '/carbon-suggestions', label: 'AI Suggestions', icon: Bot },
    { href: '/challenges', label: 'Challenges', icon: Gamepad2 },
    { href: '/schemes', label: 'Govt. Schemes', icon: Landmark },
    { href: '/blog', label: 'Blog', icon: Newspaper },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
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
