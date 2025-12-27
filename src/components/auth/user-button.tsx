'use client';

import Link from 'next/link';
import { useUser, useSupabase } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserButton() {
  const { user, isUserLoading } = useUser();
  const supabase = useSupabase();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (isUserLoading) {
    return <Button variant="outline" size="icon" disabled className="h-9 w-9 rounded-full" />;
  }

  if (!user) {
    return (
      <Link href="/login" passHref>
        <Button variant="outline" className="font-headline">
          <LogIn className="mr-2 h-4 w-4" />
          Iniciar sesión
        </Button>
      </Link>
    );
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return <UserIcon className="h-5 w-5" />;
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('');
    return initials.slice(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={(user as any).photoURL || ''} alt={(user as any).displayName || 'User'} />
            <AvatarFallback>{getInitials((user as any).displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{(user as any).displayName || user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
