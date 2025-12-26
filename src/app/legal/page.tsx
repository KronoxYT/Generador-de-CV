import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Home } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
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
              </div>
            </div>
          </div>
        </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-sm md:prose-base max-w-4xl mx-auto">
          <h1>Términos, Políticas y Preguntas Frecuentes</h1>

          <section>
            <h2>TÉRMINOS Y CONDICIONES</h2>
            
            <h3>1. Aceptación de los términos</h3>
            <p>Al acceder y utilizar VitaeForge (en adelante, “la Plataforma”), aceptas cumplir estos Términos y Condiciones. Si no estás de acuerdo, no debes utilizar el servicio.</p>
            
            <h3>2. Descripción del servicio</h3>
            <p>VitaeForge es una plataforma digital que permite a los usuarios crear, editar y exportar currículums profesionales mediante herramientas en línea.</p>
            
            <h3>3. Cuentas de usuario</h3>
            <p>El usuario es responsable de mantener la confidencialidad de su cuenta. Debes proporcionar información veraz y actualizada. Nos reservamos el derecho de suspender cuentas que incumplan estos términos.</p>
            
            <h3>4. Planes y pagos</h3>
            <p>La Plataforma ofrece planes gratuitos y de pago. Las funcionalidades disponibles dependen del plan contratado. Los pagos no son reembolsables salvo obligación legal.</p>
            
            <h3>5. Uso aceptable</h3>
            <p>El usuario se comete a no:</p>
            <ul>
              <li>Usar la plataforma con fines ilegales.</li>
              <li>Intentar acceder a sistemas internos o datos de otros usuarios.</li>
              <li>Copiar, revender o explotar el servicio sin autorización.</li>
            </ul>
            
            <h3>6. Propiedad intelectual</h3>
            <p>Todo el software, diseño y contenido de la Plataforma pertenece a MeaCore-Enterprise. El contenido del CV creado pertenece exclusivamente al usuario.</p>
            
            <h3>7. Limitación de responsabilidad</h3>
            <p>La Plataforma se ofrece “tal cual”. No garantizamos resultados laborales ni aceptación de currículums por terceros.</p>
            
            <h3>8. Modificaciones</h3>
            <p>Podemos actualizar estos términos en cualquier momento. El uso continuado implica aceptación.</p>
          </section>

          <section className="mt-12">
            <h2>🔐 POLÍTICA DE PRIVACIDAD</h2>

            <h3>1. Información que recopilamos</h3>
            <p>Datos de cuenta (email, nombre, proveedor de autenticación). Información introducida en el CV. Datos técnicos básicos (navegador, sesión).</p>

            <h3>2. Uso de la información</h3>
            <p>Utilizamos los datos para:</p>
            <ul>
                <li>Proporcionar el servicio.</li>
                <li>Autenticación y seguridad.</li>
                <li>Mejorar la experiencia del usuario.</li>
            </ul>

            <h3>3. Almacenamiento y seguridad</h3>
            <p>Los datos se almacenan utilizando servicios seguros de terceros (como Firebase). Aplicamos medidas razonables para proteger la información.</p>

            <h3>4. Compartición de datos</h3>
            <p>No vendemos ni compartimos datos personales con terceros, salvo obligación legal.</p>
            
            <h3>5. Derechos del usuario</h3>
            <p>Puedes: Acceder, modificar o eliminar tus datos. Solicitar la eliminación de tu cuenta.</p>
            
            <h3>6. Cambios en la política</h3>
            <p>Esta política puede actualizarse. La fecha de modificación será visible.</p>
          </section>

          <section className="mt-12">
            <h2>⚖️ AVISO LEGAL</h2>
            <p>VitaeForge es un producto desarrollado por MeaCore-Enterprise. El uso de esta plataforma es bajo responsabilidad del usuario. No ofrecemos asesoría legal, laboral ni de recursos humanos. VitaeForge no se responsabiliza por decisiones tomadas por terceros basadas en los CV generados.</p>
          </section>

          <section className="mt-12">
            <h2>❓ PREGUNTAS FRECUENTES (FAQ)</h2>
            
            <h3>¿Necesito pagar para usar VitaeForge?</h3>
            <p>No. Puedes crear y editar tu CV gratuitamente. Algunas funciones avanzadas requieren el plan Pro.</p>

            <h3>¿Puedo descargar mi CV?</h3>
            <p>Sí. En el plan gratuito se incluye marca de agua. El plan Pro permite descarga limpia en PDF.</p>

            <h3>¿Mis datos están seguros?</h3>
            <p>Sí. Utilizamos servicios de autenticación y almacenamiento seguros.</p>
            
            <h3>¿Puedo editar mi CV después?</h3>
            <p>Sí. Tu CV puede modificarse en cualquier momento desde el editor.</p>

            <h3>¿VitaeForge garantiza que conseguiré trabajo?</h3>
            <p>No. La herramienta mejora la presentación de tu CV, pero el resultado depende del proceso de selección externo.</p>
            
            <h3>¿Puedo eliminar mi cuenta?</h3>
            <p>Sí. Puedes solicitar la eliminación completa de tu cuenta y datos.</p>
          </section>
        </div>
      </main>
      <footer className="bg-card border-t py-6 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 MeaCore-Enterprise. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
