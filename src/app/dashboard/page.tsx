'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { FileText, Home } from 'lucide-react';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header id="header-panel" className="bg-card border-b sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                 <Link href="/" className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <h1 className="text-2xl font-bold font-headline text-foreground">
                    VitaeForge
                  </h1>
                </Link>
              </div>
              <div className='flex gap-4'>
                 <Link href="/" passHref>
                   <Button variant="outline" className="font-headline">
                    <Home className="mr-2 h-4 w-4" />
                    Inicio
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" className="font-headline">
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </div>
        </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Bienvenido a tu panel</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Hola, {user.displayName || user.email}
          </p>
           <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
           Desde aquí podrás gestionar tus currículums guardados y la configuración de tu perfil.
           Nuevas funcionalidades estarán disponibles próximamente.
          </p>
        </div>
      </main>
    </div>
  );
}
