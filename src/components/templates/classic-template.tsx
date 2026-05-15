'use client';

import { CvData } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Link as LinkIcon,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TemplateProps {
  data: Partial<CvData>;
  templateColor: string;
}

export default function ClassicTemplate({ data, templateColor }: TemplateProps) {
  const { personal, summary, experience, education, skills } = data;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="p-8 bg-[var(--cv-primary)] text-white flex items-center gap-6">
        {personal?.photoUrl && (
          <Avatar className="h-24 w-24 border-4 border-white/50">
            <AvatarImage src={personal.photoUrl} alt={personal.fullName} />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
        )}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{personal?.fullName}</h1>
          <p className="text-xl text-white/90">{personal?.jobTitle}</p>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Column */}
        <aside className="w-1/3 bg-gray-50 p-6 space-y-6 border-r border-gray-200">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: templateColor }}>Contacto</h2>
            <div className="space-y-2 text-sm text-gray-600">
              {personal?.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[var(--cv-primary)]" /> {personal.email}</p>}
              {personal?.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[var(--cv-primary)]" /> {personal.phone}</p>}
              {personal?.address && <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[var(--cv-primary)]" /> {personal.address}</p>}
              {personal?.linkedin && <p className="flex items-center gap-2 truncate"><LinkIcon className="h-4 w-4 text-[var(--cv-primary)]" /> {personal.linkedin}</p>}
              {personal?.website && <p className="flex items-center gap-2 truncate"><LinkIcon className="h-4 w-4 text-[var(--cv-primary)]" /> {personal.website}</p>}
            </div>
          </div>

          {education && education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: templateColor }}>Educación</h2>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id} className="text-sm">
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: templateColor }}>Habilidades</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => skill.name && (
                  <Badge key={skill.id} variant="secondary" className="bg-gray-200 text-gray-700">{skill.name}</Badge>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Column */}
        <main className="w-2/3 p-6 space-y-6 overflow-y-auto">
          {summary && (
            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-2 border-b-2 pb-2" style={{ borderColor: templateColor }}>
                Resumen
              </h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{summary}</p>
            </section>
          )}

          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-2 border-b-2 pb-2" style={{ borderColor: templateColor }}>
                Experiencia
              </h2>
              <div className="space-y-4">
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-md">{exp.jobTitle}</h3>
                      <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                    </div>
                    <p className="text-sm font-semibold italic" style={{ color: templateColor }}>{exp.company}</p>
                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
