import { z } from 'zod';

export const personalDetailsSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string(),
  address: z.string(),
  linkedin: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  photoUrl: z.string().url().optional().or(z.literal('')),
});

export const experienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const cvDataSchema = z.object({
  name: z.string().optional(),
  personal: personalDetailsSchema,
  summary: z.string(),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  font: z.string().optional(),
  lastEdited: z.any().optional(), // Allow serverTimestamp
});

export type PersonalDetails = z.infer<typeof personalDetailsSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type CvData = z.infer<typeof cvDataSchema>;
