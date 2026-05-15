'use client';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CvEditor from '@/components/cv-editor';
import CvPreview from '@/components/cv-preview';
import { Button } from '@/components/ui/button';
import { Download, FileText, Home, Loader2, Save } from 'lucide-react';
import { type CvData, cvDataSchema } from '@/lib/types';
import Link from 'next/link';
import { UserButton } from '@/components/auth/user-button';
import { useAuth } from '@/components/providers/supabase-provider';
import { supabase } from '@/lib/supabase/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from 'use-debounce';

function AutoSaver() {
  const { control, getValues, formState: { isDirty } } = useFormContext<CvData>();
  const { cvId } = useParams() as { cvId: string };
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(true);

  const values = getValues();
  const [debouncedValues] = useDebounce(values, 1500);

  useEffect(() => {
    const saveData = async () => {
      if (isDirty && user && cvId) {
        setIsSaving(true);
        setHasSaved(false);
        try {
          if (!supabase) {
            // Save to localStorage
            const localData = localStorage.getItem('meavitae_cvs');
            if (localData) {
              const cvs = JSON.parse(localData);
              const index = cvs.findIndex((cv: any) => cv.id === cvId);
              if (index !== -1) {
                cvs[index].content = debouncedValues;
                localStorage.setItem('meavitae_cvs', JSON.stringify(cvs));
              }
            }
          } else {
            const { error } = await supabase
              .from('cvs')
              .update({ content: debouncedValues })
              .eq('id', cvId);
            if (error) throw error;
          }
        } catch (error) {
          console.error("Error saving document: ", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudieron guardar los cambios.",
          });
        } finally {
          setIsSaving(false);
          setHasSaved(true);
        }
      }
    };

    saveData();
  }, [debouncedValues, isDirty, user, cvId, toast]);

  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Guardando...
      </div>
    );
  }

  if(!isDirty && hasSaved){
     return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Save className="h-4 w-4" />
        <span>Todos los cambios guardados</span>
      </div>
    );
  }

  return null;
}


function EditorPageContent() {
  const { cvId } = useParams() as { cvId: string };
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [templateColor, setTemplateColor] = useState('#64B5F6');
  const [font, setFont] = useState<'poppins' | 'pt-sans' | 'inter'>('poppins');
  const [cvData, setCvData] = useState<CvData | null>(null);
  const [isLoadingCv, setIsLoadingCv] = useState(true);

  useEffect(() => {
    const loadCv = async () => {
      if (!cvId) return;
      setIsLoadingCv(true);

      if (!supabase) {
        // Load from localStorage
        const localData = localStorage.getItem('meavitae_cvs');
        if (localData) {
          const cvs = JSON.parse(localData);
          const cv = cvs.find((c: any) => c.id === cvId);
          if (cv) {
            setCvData((cv.content as CvData) || null);
          }
        }
        setIsLoadingCv(false);
        return;
      }

      const { data, error } = await supabase.from('cvs').select('id,title,content,created_at,user_id').eq('id', cvId).single();
      if (error) {
        console.error('Error loading CV:', error);
        setCvData(null);
      } else {
        setCvData((data?.content as CvData) || null);
      }
      setIsLoadingCv(false);
    };
    loadCv();
  }, [cvId]);

  const methods = useForm<CvData>({
    resolver: zodResolver(cvDataSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (cvData) {
      methods.reset(cvData);
      if(cvData.font) {
         setFont(cvData.font as any);
      }
    }
  }, [cvData, methods]);
  
  useEffect(() => {
    if (!auth.isUserLoading && !auth.user) {
      router.replace('/login');
    }
  }, [auth.isUserLoading, auth.user, router]);
  
  const handlePrint = () => {
    // We need to trigger the print after ensuring the state has been updated
    setTimeout(() => window.print(), 100);
  };

  useEffect(() => {
    if(searchParams.get('print') === 'true' && !isLoadingCv) {
        handlePrint();
    }
  }, [searchParams, isLoadingCv]);

  if (isLoadingCv || auth.isUserLoading || !cvData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className='ml-4 text-lg'>Cargando editor...</p>
      </div>
    );
  }
  
  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-background">
        <header id="header-panel" className="bg-card border-b sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                 <Link href="/dashboard" className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <h1 className="text-2xl font-bold font-headline text-foreground">
                    MeaVitae
                  </h1>
                </Link>
              </div>
              <div className="hidden md:block">
                <AutoSaver />
              </div>
              <div className='flex gap-4'>
                 <Link href="/dashboard" passHref>
                   <Button variant="outline" className="font-headline">
                    <Home className="mr-2 h-4 w-4" />
                    Panel
                  </Button>
                </Link>
                <Button onClick={handlePrint} className="font-headline">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
                 <UserButton />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div id="editor-panel" className="w-full">
              <CvEditor setTemplateColor={setTemplateColor} setFont={font => setFont(font as any)} />
            </div>
            <div id="preview-panel" className="w-full lg:sticky lg:top-24">
               <CvPreview templateColor={templateColor} font={font}/>
            </div>
          </div>
        </main>
      </div>
    </FormProvider>
  );
}

export default function EditorPageWrapper() {
  return <EditorPageContent />;
}
