'use client';

import { Button } from '@/components/ui/button';
import { FileText, ChevronRight, Wand2, Eye, ScanLine, GraduationCap, Briefcase, Code, CheckCircle, Star } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-card border-b sticky top-0 z-30">
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

      <main className="flex-grow">
        {/* HERO Section */}
        <section className="text-center py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
              Crea un CV profesional en minutos.
            </h1>
            <h2 className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              VitaeForge te ayuda a crear, personalizar y descargar un currículum claro, moderno y optimizado para reclutadores y ATS.
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href={getEditorLink()} passHref>
                <Button size="lg" className="font-headline" disabled={isUserLoading}>
                  {isUserLoading ? 'Cargando...' : 'Empezar a crear'}
                  {!isUserLoading && <ChevronRight className="ml-2 h-5 w-5" />}
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="font-headline">
                Ver cómo funciona
              </Button>
            </div>
          </div>
        </section>

        {/* Valor inmediato Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Wand2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Rápido y simple</h3>
                <p className="text-muted-foreground">Edita tu CV directamente en el navegador. Sin formularios eternos, sin pasos innecesarios.</p>
              </div>
              <div className="flex flex-col items-center">
                <Eye className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Vista previa en tiempo real</h3>
                <p className="text-muted-foreground">Ve cómo se verá tu currículum final mientras escribes. Lo que ves es lo que descargas.</p>
              </div>
              <div className="flex flex-col items-center">
                <ScanLine className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Preparado para ATS</h3>
                <p className="text-muted-foreground">Estructura clara y profesional para que tu CV pase los filtros automáticos y llegue a humanos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo funciona Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-12">Cómo funciona</h2>
            <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Dashed lines for larger screens */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-8">
                    <svg width="100%" height="2">
                        <line x1="0" y1="1" x2="100%" y2="1" strokeWidth="2" stroke="hsl(var(--border))" strokeDasharray="8, 8"/>
                    </svg>
                </div>
                <div className="relative flex flex-col items-center">
                    <div className="bg-primary text-primary-foreground h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 z-10">1</div>
                    <h3 className="text-xl font-bold mb-2">Inicia sesión</h3>
                    <p className="text-muted-foreground">Crea tu cuenta con email o Google en segundos.</p>
                </div>
                <div className="relative flex flex-col items-center">
                    <div className="bg-primary text-primary-foreground h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 z-10">2</div>
                    <h3 className="text-xl font-bold mb-2">Completa tu información</h3>
                    <p className="text-muted-foreground">Rellena tus datos y experiencia desde un panel simple y ordenado.</p>
                </div>
                <div className="relative flex flex-col items-center">
                    <div className="bg-primary text-primary-foreground h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 z-10">3</div>
                    <h3 className="text-xl font-bold mb-2">Descarga tu CV</h3>
                    <p className="text-muted-foreground">Exporta tu currículum en PDF listo para enviar.</p>
                </div>
            </div>
             <div className="mt-12">
               <Link href={getEditorLink()} passHref>
                <Button size="lg" className="font-headline">
                  👉 Crear mi CV ahora
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Para quién es Section */}
        <section className="py-16 bg-muted">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">Perfecto para todos los perfiles</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                        <GraduationCap className="h-10 w-10 text-primary mb-4 mx-auto" />
                        <h3 className="text-xl font-bold mb-2">Estudiantes y primer empleo</h3>
                        <p className="text-muted-foreground">Crea un CV profesional incluso si tienes poca experiencia.</p>
                    </div>
                    <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                        <Briefcase className="h-10 w-10 text-primary mb-4 mx-auto" />
                        <h3 className="text-xl font-bold mb-2">Profesionales</h3>
                        <p className="text-muted-foreground">Destaca tu trayectoria con un formato limpio y serio.</p>
                    </div>
                    <div className="bg-card p-6 rounded-lg shadow-sm text-center">
                        <Code className="h-10 w-10 text-primary mb-4 mx-auto" />
                        <h3 className="text-xl font-bold mb-2">Tech & IT</h3>
                        <p className="text-muted-foreground">Ideal para perfiles técnicos, proyectos y experiencia estructurada.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Planes Section */}
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                 <h2 className="text-3xl font-bold text-center mb-12">Planes simples y honestos</h2>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="border rounded-lg p-8 flex flex-col">
                        <h3 className="text-2xl font-bold mb-4">Free</h3>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /> Crear y editar CV</li>
                            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /> Vista previa en tiempo real</li>
                            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /> Descarga con marca de agua</li>
                        </ul>
                         <Link href={getEditorLink()} passHref className='mt-auto'>
                            <Button size="lg" variant="outline" className="w-full font-headline">
                                👉 Empezar gratis
                            </Button>
                        </Link>
                    </div>
                     <div className="border-2 border-primary rounded-lg p-8 flex flex-col relative">
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                            RECOMENDADO
                        </div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">Pro <Star className="h-5 w-5 text-yellow-400 fill-current" /></h3>
                         <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /> Descarga PDF sin marca de agua</li>
                            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /> Optimización ATS avanzada</li>
                            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /> Exportación profesional</li>
                        </ul>
                         <Button size="lg" className="w-full font-headline mt-auto" disabled>
                            Próximamente
                        </Button>
                    </div>
                 </div>
            </div>
        </section>

        {/* Cierre Section */}
        <section className="py-20 text-center bg-muted">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold font-headline mb-4">
                    No necesitas un CV perfecto. <br/> Necesitas uno claro, profesional y listo para enviar.
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                    VitaeForge te ayuda a llegar ahí más rápido.
                </p>
                <Link href={getEditorLink()} passHref>
                  <Button size="lg" className="font-headline h-12 text-lg px-10">
                    Empieza a crear tu CV
                  </Button>
                </Link>
            </div>
        </section>

      </main>

      <footer className="bg-card border-t py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 MeaCore-Enterprise. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
