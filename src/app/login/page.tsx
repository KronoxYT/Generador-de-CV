'use client';

import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h2>
          <AuthForm />
        </div>
      </main>
    </div>
  );
}
