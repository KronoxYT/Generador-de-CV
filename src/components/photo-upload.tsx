'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Loader2, X } from 'lucide-react';
import { uploadPhoto } from '@/lib/supabase/storage';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/supabase-provider';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function PhotoUpload() {
  const { setValue, watch } = useFormContext();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const photoUrl = watch('personal.photoUrl');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor, selecciona una imagen válida.',
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'La imagen debe ser menor a 2MB.',
      });
      return;
    }

    setIsUploading(true);
    try {
      if (!supabase) {
        // Offline mode: convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setValue('personal.photoUrl', reader.result, { shouldDirty: true });
          setIsUploading(false);
          toast({
            title: 'Foto actualizada (Modo local)',
            description: 'La imagen se ha guardado localmente en tu navegador.',
          });
        };
        reader.readAsDataURL(file);
        return;
      }

      const url = await uploadPhoto(file, user.uid);
      setValue('personal.photoUrl', url, { shouldDirty: true });
      toast({
        title: 'Foto actualizada',
        description: 'Tu foto de perfil se ha subido correctamente.',
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo subir la foto.',
      });
    } finally {
      if (supabase) setIsUploading(false);
    }
  };

  const removePhoto = () => {
    setValue('personal.photoUrl', '', { shouldDirty: true });
  };

  return (
    <div className="space-y-2">
      <Label>Foto de perfil</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 border">
          <AvatarImage src={photoUrl} />
          <AvatarFallback>
            <Camera className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="relative overflow-hidden"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Cambiar foto
                </>
              )}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </Button>
            {photoUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removePhoto}
                className="text-destructive hover:text-destructive"
              >
                <X className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, PNG o WebP. Máximo 2MB.
          </p>
        </div>
      </div>
    </div>
  );
}
