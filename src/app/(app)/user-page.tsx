'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Settings,
  Shield,
  Activity,
  Menu,
  LogOut,
  Layers3Icon,
  AlbumIcon,
  Calendar,
  Building,
  HardDrive,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOutAction } from '@/app/(auth)/actions';
import { ExtendedUser } from '@/lib/auth/next-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateAdminUserAction } from './action';

export function UserPage({
  children,
  user,
}: {
  children: React.ReactNode;
  user: ExtendedUser;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    {
      group: 'Reservas',
      links: [
        { href: '/dashboard', icon: Users, label: 'Minhas Reservas' },
        { href: '/reservation', icon: AlbumIcon, label: 'Fazer Reserva' },
      ],
    },
    {
      group: 'Minha Conta',
      links: [
        { href: '/account', icon: Settings, label: 'Perfil' },
        { href: '/account/activity', icon: Activity, label: 'Atividade' },
        { href: '/account/security', icon: Shield, label: 'Segurança' },
      ],
    },
    ...(user.role === 'ADMIN'
      ? [
          {
            group: 'Admin',
            links: [
              {
                href: '/admin/resource',
                icon: HardDrive,
                label: 'Gerenciar Recursos',
                subHref: '/admin/resource/create',
                subLabel: 'Criar Recurso',
              },
              {
                href: '/admin/space',
                icon: Building,
                label: 'Gerenciar Espaços',
                subHref: '/admin/space/create',
                subLabel: 'Criar Espaço',
              },
              {
                href: '/admin/reservation',
                icon: Calendar,
                label: 'Gerenciar Reservas',
              },
              {
                href: '/admin/calendar',
                icon: Calendar,
                label: 'Calendário',
                subLabel: 'Ver Calendário',
              },
            ],
          },
        ]
      : []),
  ];

  const handleSignOut = () => {
    signOutAction(user);
  };

  const handleUpdateAdmin = async () => {
    updateAdminUserAction(user.id!);
  };

  return (
    <div>
      <header className="border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Layers3Icon className="h-6 w-6 text-rose-400" />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              Reserva de espaços
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              className="lg:hidden p-0"
              variant="ghost"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            {user.role === 'USER' && (
              <Link href="/dashboard">
                <Button onClick={handleUpdateAdmin}>Virar ADMIN</Button>
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage
                      src={user?.image || undefined}
                      alt={user?.name || 'Foto de perfil'}
                    />
                    <AvatarFallback className="text-xl font-semibold text-gray-900">
                      {user?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-full mt-2">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuLabel>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4 text-rose-500" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="flex flex-col min-h-[calc(100dvh-68px)] mx-auto w-full">
        <div className="flex flex-1 overflow-hidden h-full">
          {/* Sidebar */}
          <aside
            className={`w-64 bg-white lg:bg-gray-50 border-r border-gray-200 lg:block ${
              isSidebarOpen ? 'block' : 'hidden'
            } lg:relative absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <nav className="h-full overflow-y-auto p-4">
              {navItems.map((group) => (
                <div key={group.group}>
                  <h3 className="text-sm font-medium text-gray-500 px-2 py-1">
                    {group.group}
                  </h3>
                  {group.links.map((item) => (
                    <div key={item.href}>
                      <Link href={item.href} passHref>
                        <Button
                          variant={
                            pathname === item.href ? 'secondary' : 'ghost'
                          }
                          className={`shadow-none my-1 w-full justify-start ${
                            pathname === item.href
                              ? 'bg-gray-100 text-rose-400'
                              : ''
                          }`}
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </Button>
                      </Link>
                      {item.subHref && (
                        <Link key={item.subHref} href={item.subHref} passHref>
                          <Button
                            variant={
                              pathname === item.subHref ? 'secondary' : 'ghost'
                            }
                            className={`shadow-none my-1 justify-start text-sm ${
                              pathname === item.subHref
                                ? 'bg-gray-100 text-rose-400'
                                : ''
                            }`}
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.subLabel}
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-0 lg:p-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
