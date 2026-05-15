'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { CvData } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import ClassicTemplate from './templates/classic-template';
import ModernTemplate from './templates/modern-template';

interface CvPreviewProps {
  templateColor: string;
  font: 'poppins' | 'pt-sans' | 'inter';
}

const fontClasses = {
  poppins: 'font-headline',
  'pt-sans': 'font-body',
  inter: 'font-sans',
};

const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
};

export default function CvPreview({ templateColor, font }: CvPreviewProps) {
  const { control } = useFormContext<CvData>();
  const data = useWatch({ control });
  const { templateId = 'classic' } = data;

  const fontClass = fontClasses[font] || 'font-headline';
  const SelectedTemplate = templates[templateId as keyof typeof templates] || ClassicTemplate;

  return (
    <div id="cv-container" className="p-4 bg-gray-200/50 rounded-lg">
      <style>{`:root { --cv-primary: ${templateColor}; }`}</style>
      <Card
        id="cv-preview"
        className={`w-full aspect-[210/297] bg-white text-gray-800 shadow-lg overflow-hidden scale-[0.9] origin-top lg:scale-[1] ${fontClass}`}
      >
        <CardContent className="p-0 h-full">
           <SelectedTemplate data={data} templateColor={templateColor} />
           
           {/* Watermark (Proximamente para usuarios Free) */}
           <div className="absolute bottom-4 right-4 text-[10px] text-gray-300 pointer-events-none uppercase tracking-widest font-bold">
             Creado con MeaVitae
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
