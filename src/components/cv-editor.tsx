'use client';

import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Briefcase,
  GraduationCap,
  Lightbulb,
  PlusCircle,
  Sparkles,
  Trash2,
  User,
  Pen,
  Wand2,
} from 'lucide-react';
import { CvData } from '@/lib/types';
import { refineWithAI, generateSummaryWithAI } from '@/app/actions';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PhotoUpload } from './photo-upload';

const colors = ['#64B5F6', '#818CF8', '#F87171', '#4ADE80', '#FBBF24', '#90A4AE'];
const fonts = [
  { value: 'poppins', label: 'Poppins' },
  { value: 'pt-sans', label: 'PT Sans' },
  { value: 'inter', label: 'Inter' },
];

interface CvEditorProps {
  setTemplateColor: (color: string) => void;
  setFont: (font: string) => void;
}

const AiRefineButton = ({ fieldName }: { fieldName: any }) => {
  const { setValue, getValues } = useFormContext<CvData>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRefine = async () => {
    setIsLoading(true);
    try {
      const content = getValues(fieldName);
      const result = await refineWithAI(content);
      if (result.refinedContent) {
        setValue(fieldName, result.refinedContent, { shouldValidate: true, shouldDirty: true });
        toast({
          title: "Contenido mejorado",
          description: "Tu contenido ha sido optimizado con IA.",
        });
      } else {
        throw new Error("AI refinement returned empty content.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo mejorar el contenido. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={handleRefine}
      disabled={isLoading}
      className="gap-2"
    >
      <Sparkles className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      Mejorar con IA
    </Button>
  );
};

const AiSummaryButton = () => {
  const { setValue, getValues } = useFormContext<CvData>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    const values = getValues();
    if (!values.experience || values.experience.length === 0) {
      toast({
        variant: "destructive",
        title: "Falta información",
        description: "Añade al menos una experiencia laboral para generar un resumen.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const input = {
        fullName: values.personal.fullName,
        jobTitle: values.personal.jobTitle,
        experience: values.experience.map(exp => ({
          jobTitle: exp.jobTitle,
          company: exp.company,
          description: exp.description,
        })),
      };

      const result = await generateSummaryWithAI(input);
      if (result.summary) {
        setValue('summary', result.summary, { shouldValidate: true, shouldDirty: true });
        toast({
          title: "Resumen generado",
          description: "Se ha redactado un resumen basado en tu perfil.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo generar el resumen. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={handleGenerate}
      disabled={isLoading}
      className="gap-2"
    >
      <Wand2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Generando...' : 'Generar resumen con IA'}
    </Button>
  );
};


export default function CvEditor({ setTemplateColor, setFont }: CvEditorProps) {
  const { control, register } = useFormContext<CvData>();

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({ control, name: 'experience' });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: 'education' });
  
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({ control, name: 'skills' });

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="content">Contenido</TabsTrigger>
        <TabsTrigger value="design">Diseño</TabsTrigger>
      </TabsList>
      <TabsContent value="content">
        <Accordion type="multiple" defaultValue={['item-0', 'item-1']} className="w-full mt-4">
          <AccordionItem value="item-0">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Pen className="h-4 w-4" /> <span className="font-headline">Detalles del CV</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-card rounded-b-lg">
              <div className="space-y-2">
                  <Label htmlFor="name">Nombre del CV</Label>
                  <Input id="name" {...register('name')} placeholder="Ej: CV Desarrollador Fullstack" />
                </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4" /> <span className="font-headline">Datos Personales</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-card rounded-b-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input id="fullName" {...register('personal.fullName')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Puesto / Título Profesional</Label>
                  <Input id="jobTitle" {...register('personal.jobTitle')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('personal.email')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...register('personal.phone')} />
                </div>
                 <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" {...register('personal.address')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" {...register('personal.linkedin')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web / Portfolio</Label>
                  <Input id="website" {...register('personal.website')} />
                </div>
                <div className="space-y-2 md:col-span-2 pt-2">
                  <PhotoUpload />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Pen className="h-4 w-4" /> <span className="font-headline">Resumen</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-card rounded-b-lg">
              <div className="space-y-2">
                <Label htmlFor="summary">Resumen Profesional</Label>
                <div className="flex flex-col gap-2">
                  <Textarea id="summary" {...register('summary')} rows={5} placeholder="Escribe un breve resumen de tu trayectoria..." />
                  <div className="flex gap-2">
                    <AiSummaryButton />
                    <AiRefineButton fieldName="summary" />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4" /> <span className="font-headline">Experiencia Laboral</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-card rounded-b-lg space-y-4">
              {experienceFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg relative space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Puesto / Título</Label>
                      <Input {...register(`experience.${index}.jobTitle`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Empresa</Label>
                      <Input {...register(`experience.${index}.company`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha Inicio</Label>
                      <Input {...register(`experience.${index}.startDate`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha Fin</Label>
                      <Input {...register(`experience.${index}.endDate`)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Descripción de responsabilidades</Label>
                      <Textarea {...register(`experience.${index}.description`)} rows={4}/>
                      <AiRefineButton fieldName={`experience.${index}.description`} />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeExperience(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => appendExperience({ id: crypto.randomUUID(), jobTitle: '', company: '', startDate: '', endDate: '', description: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Experiencia
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4" /> <span className="font-headline">Formación Académica</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-card rounded-b-lg space-y-4">
              {educationFields.map((field, index) => (
                 <div key={field.id} className="p-4 border rounded-lg relative space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institución / Universidad</Label>
                      <Input {...register(`education.${index}.institution`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Título / Carrera</Label>
                      <Input {...register(`education.${index}.degree`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha Inicio</Label>
                      <Input {...register(`education.${index}.startDate`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha Fin</Label>
                      <Input {...register(`education.${index}.endDate`)} />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeEducation(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => appendEducation({ id: crypto.randomUUID(), institution: '', degree: '', startDate: '', endDate: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Formación
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Lightbulb className="h-4 w-4" /> <span className="font-headline">Habilidades</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-card rounded-b-lg space-y-4">
              <div className="flex flex-wrap gap-2">
                {skillFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                    <Input {...register(`skills.${index}.name`)} className="bg-background border-none h-8" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" onClick={() => appendSkill({ id: crypto.randomUUID(), name: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Habilidad
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
      <TabsContent value="design">
         <div className="p-4 bg-card rounded-lg mt-4 space-y-6">
            <div className="space-y-2">
              <Label>Color de Acento</Label>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className="h-8 w-8 rounded-full border-2"
                    style={{ backgroundColor: color }}
                    onClick={() => setTemplateColor(color)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
                <Label>Plantilla</Label>
                 <Controller
                    name="templateId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value || 'classic'}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una plantilla" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classic">Clásica</SelectItem>
                          <SelectItem value="modern">Moderna</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
            </div>
            <div className="space-y-2">
                <Label>Tipografía</Label>
                 <Controller
                    name="font"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={(value) => {
                          setFont(value);
                          field.onChange(value);
                      }} defaultValue={field.value as string || 'poppins'}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent>
                          {fonts.map(font => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
            </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
