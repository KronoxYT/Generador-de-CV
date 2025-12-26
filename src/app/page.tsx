'use client';

import { Button } from '@/components/ui/button';
import { FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { UserButton } from '@/components/auth/user-button';
import { useUser } from '@/firebase';

export default function Home() {
  const { user, isUserLoading } = useUser();

  const getEditorLink = () => {
    if (isUserLoading) {
      return '#'; // Or a disabled state while loading
    }
    return user ? '/editor' : '/login';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-card border-b">
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
               <UserButton />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center">
        <div className="w-full text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-foreground mb-4">
            Crea un CV profesional en minutos
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            VitaeForge te ayuda a crear, personalizar y descargar un currículum vitae pulido y profesional. Comienza con nuestra plantilla y personalízala a tu gusto.
          </p>
          <Link href={getEditorLink()} passHref>
            <Button size="lg" className="font-headline" disabled={isUserLoading}>
              {isUserLoading ? 'Cargando...' : 'Empezar a crear'}
              {!isUserLoading && <ChevronRight className="ml-2 h-5 w-5" />}
            </Button>
          </Link>
        </div>
      </main>

      <footer className="bg-card border-t py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 MeaCore-Enterprise. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
