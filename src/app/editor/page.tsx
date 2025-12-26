'use client';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CvEditor from '@/components/cv-editor';
import CvPreview from '@/components/cv-preview';
import { Button } from '@/components/ui/button';
import { Download, FileText, Home } from 'lucide-react';
import { type CvData, cvDataSchema } from '@/lib/types';
import { initialData } from '@/lib/initial-data';
import Link from 'next/link';
import { UserButton } from '@/components/auth/user-button';

export default function EditorPage() {
  const [templateColor, setTemplateColor] = useState('#64B5F6');
  const [font, setFont] = useState<'poppins' | 'pt-sans' | 'inter'>('poppins');

  const methods = useForm<CvData>({
    resolver: zodResolver(cvDataSchema),
    defaultValues: initialData,
    mode: 'onBlur',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-background">
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
                <Button onClick={handlePrint} className="font-headline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
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
