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
} from 'lucide-react';
import { CvData } from '@/lib/types';
import { refineWithAI } from '@/app/actions';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
          title: "Content Refined",
          description: "Your content has been successfully refined with AI.",
        });
      } else {
        throw new Error("AI refinement returned empty content.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refine content with AI. Please try again.",
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
      Refine with AI
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
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="design">Design</TabsTrigger>
      </TabsList>
      <TabsContent value="content">
        <Accordion type="multiple" defaultValue={['item-0', 'item-1']} className="w-full mt-4">
          <AccordionItem value="item-0">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Pen /> <span className="font-headline">CV Details</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-card rounded-b-lg">
              <div className="space-y-2">
                  <Label htmlFor="name">CV Name</Label>
                  <Input id="name" {...register('name')} placeholder="e.g. CV for Software Engineer role" />
                </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <User /> <span className="font-headline">Personal Details</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-card rounded-b-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" {...register('personal.fullName')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title / Role</Label>
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
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...register('personal.address')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" {...register('personal.linkedin')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website/Portfolio</Label>
                  <Input id="website" {...register('personal.website')} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="photoUrl">Photo URL</Label>
                  <Input id="photoUrl" {...register('personal.photoUrl')} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Pen /> <span className="font-headline">Summary</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-card rounded-b-lg">
              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea id="summary" {...register('summary')} rows={5} />
                <AiRefineButton fieldName="summary" />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Briefcase /> <span className="font-headline">Work Experience</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-card rounded-b-lg space-y-4">
              {experienceFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg relative space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input {...register(`experience.${index}.jobTitle`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input {...register(`experience.${index}.company`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input {...register(`experience.${index}.startDate`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input {...register(`experience.${index}.endDate`)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
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
                <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <GraduationCap /> <span className="font-headline">Education</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-card rounded-b-lg space-y-4">
              {educationFields.map((field, index) => (
                 <div key={field.id} className="p-4 border rounded-lg relative space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input {...register(`education.${index}.institution`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree / Certificate</Label>
                      <Input {...register(`education.${index}.degree`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input {...register(`education.${index}.startDate`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
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
                <PlusCircle className="mr-2 h-4 w-4" /> Add Education
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Lightbulb /> <span className="font-headline">Skills</span>
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
                <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
      <TabsContent value="design">
         <div className="p-4 bg-card rounded-lg mt-4 space-y-6">
            <div className="space-y-2">
              <Label>Accent Color</Label>
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
                <Label>Font</Label>
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
