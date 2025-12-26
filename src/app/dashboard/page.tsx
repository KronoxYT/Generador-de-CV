'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Home, Plus, MoreVertical, Pencil, Copy, Trash2, Download, Star } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initialData } from '@/lib/initial-data';
import { UserButton } from '@/components/auth/user-button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const cvsCollectionRef = useMemoFirebase(() => {
    if (!user?.uid || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'cvs');
  }, [user?.uid, firestore]);

  const { data: cvs, isLoading: isLoadingCvs } = useCollection(cvsCollectionRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  const handleCreateNewCv = async () => {
    if (!cvsCollectionRef) return;
    const newCvName = `CV sin título ${cvs ? cvs.length + 1 : 1}`;
    try {
      const docRef = await addDoc(cvsCollectionRef, {
        name: newCvName,
        ...initialData,
        lastEdited: serverTimestamp(),
      });
      router.push(`/editor/${docRef.id}`);
    } catch (error) {
      console.error("Error creating new CV: ", error);
    }
  };

  const handleDuplicateCv = async (cvId: string) => {
    if (!firestore || !user?.uid) return;

    const originalCvRef = doc(firestore, 'users', user.uid, 'cvs', cvId);
    const originalCvDoc = cvs?.find(cv => cv.id === cvId);

    if (!originalCvDoc) return;

    try {
      const newCvData = {
        ...originalCvDoc,
        name: `${originalCvDoc.name} (copia)`,
        lastEdited: serverTimestamp(),
      };
      delete (newCvData as any).id; 

      await addDoc(collection(firestore, 'users', user.uid, 'cvs'), newCvData);
    } catch (error) {
      console.error("Error duplicating CV: ", error);
    }
  };

  const handleDeleteCv = async (cvId: string) => {
    if (!cvsCollectionRef) return;
    if (window.confirm("¿Estás seguro de que quieres eliminar este CV?")) {
      try {
        await deleteDoc(doc(cvsCollectionRef, cvId));
      } catch (error) {
        console.error("Error deleting CV: ", error);
      }
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  const lastEditedCv = cvs
    ?.filter(cv => cv.lastEdited)
    .sort((a, b) => b.lastEdited.toMillis() - a.lastEdited.toMillis())[0];

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
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
              <div className='flex items-center gap-4'>
                 <Link href="/" passHref>
                   <Button variant="outline" className="font-headline hidden sm:flex">
                    <Home className="mr-2 h-4 w-4" />
                    Inicio
                  </Button>
                </Link>
                <UserButton />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className='flex justify-between items-center mb-8'>
                <div>
                    <h2 className="text-3xl font-bold">Panel de control</h2>
                    <p className="text-muted-foreground">Hola {user.displayName || user.email}, ¡qué bueno verte!</p>
                </div>
                <Button onClick={handleCreateNewCv} className="font-headline">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear nuevo CV
                </Button>
            </div>

            {/* Dashboard Cards */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CVs Creados</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{cvs?.length || 0}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Última edición</CardTitle>
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {lastEditedCv?.lastEdited ? formatDistanceToNow(lastEditedCv.lastEdited.toDate(), { addSuffix: true, locale: es }) : 'N/A'}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Plan Actual</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Free</div>
                         <p className="text-xs text-muted-foreground">Actualiza a Pro próximamente</p>
                    </CardContent>
                </Card>
            </div>
            
            {/* CV List */}
            <div>
                <h3 className="text-2xl font-bold mb-4">Mis CVs</h3>
                {isLoadingCvs && <p>Cargando CVs...</p>}
                {!isLoadingCvs && cvs && cvs.length > 0 ? (
                    <div className="bg-card border rounded-lg">
                        <div className="divide-y divide-border">
                        {cvs.map(cv => (
                            <div key={cv.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                                <div className='flex-1'>
                                    <Link href={`/editor/${cv.id}`} className='font-semibold hover:underline'>{cv.name}</Link>
                                    <p className="text-sm text-muted-foreground">
                                        Editado por última vez: {cv.lastEdited ? formatDistanceToNow(cv.lastEdited.toDate(), { addSuffix: true, locale: es }) : 'nunca'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                     <Button variant="outline" size="sm" onClick={() => router.push(`/editor/${cv.id}`)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Editar
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleDuplicateCv(cv.id)}>
                                                <Copy className="mr-2 h-4 w-4" />
                                                Duplicar
                                            </DropdownMenuItem>
                                             <DropdownMenuItem onClick={() => router.push(`/editor/${cv.id}?print=true`)}>
                                                <Download className="mr-2 h-4 w-4" />
                                                Descargar PDF
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteCv(cv.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                ) : (
                    !isLoadingCvs && (
                         <div className="text-center border-2 border-dashed rounded-lg p-12">
                            <h4 className="text-lg font-semibold">Aún no has creado ningún CV</h4>
                            <p className="text-muted-foreground mt-1 mb-4">¡Es hora de empezar a crear tu futuro!</p>
                            <Button onClick={handleCreateNewCv}>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear mi primer CV
                            </Button>
                        </div>
                    )
                )}
            </div>
        </main>
    </div>
  );
}