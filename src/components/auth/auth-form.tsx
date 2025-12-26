'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        toast({
          title: '¡Cuenta creada!',
          description: 'Has sido registrado exitosamente.',
        });
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({
          title: '¡Inicio de sesión exitoso!',
        });
      }
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      let description = 'Ocurrió un error. Por favor, inténtalo de nuevo.';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            description = 'Este correo electrónico ya está en uso.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            description = 'Correo electrónico o contraseña incorrectos.';
            break;
          case 'auth/invalid-credential':
             description = 'Credenciales invalidas.';
            break;
        }
      }
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: '¡Inicio de sesión exitoso!',
      });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description: 'No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} disabled={isLoading} />
          {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" {...register('password')} disabled={isLoading} />
          {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full font-headline" disabled={isLoading}>
          {isLoading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">O continuar con</span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 174 58.9l-65.7 64.9C337 97.2 295.1 84.5 248 84.5c-84.3 0-152.3 68.8-152.3 153.3s68 153.3 152.3 153.3c92.8 0 135.2-61.9 140.8-94.8H248v-73.8h236.1c2.3 12.7 3.9 26.4 3.9 41.4z"></path></svg>
        Google
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
        <button
          type="button"
          className="underline font-medium text-primary"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Inicia sesión' : 'Regístrate'}
        </button>
      </p>
    </div>
  );
}
