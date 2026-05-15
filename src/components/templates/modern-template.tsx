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
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TemplateProps {
  data: Partial<CvData>;
  templateColor: string;
}

export default function ModernTemplate({ data, templateColor }: TemplateProps) {
  const { personal, summary, experience, education, skills } = data;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Section */}
      <div className="p-10 flex flex-col md:flex-row items-center gap-8 border-b-8" style={{ borderColor: templateColor }}>
        {personal?.photoUrl && (
          <Avatar className="h-32 w-32 ring-4 ring-offset-2" style={{ ['--tw-ring-color' as any]: templateColor }}>
            <AvatarImage src={personal.photoUrl} alt={personal.fullName} />
            <AvatarFallback>
              <User className="h-14 w-14" />
            </AvatarFallback>
          </Avatar>
        )}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-5xl font-extrabold tracking-tighter uppercase mb-2" style={{ color: '#1a1a1a' }}>
            {personal?.fullName}
          </h1>
          <p className="text-2xl font-medium tracking-wide uppercase" style={{ color: templateColor }}>
            {personal?.jobTitle}
          </p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium">
            {personal?.email && <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {personal.email}</span>}
            {personal?.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {personal.phone}</span>}
            {personal?.address && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {personal.address}</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 p-10 space-y-10 overflow-y-auto">
          {summary && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-1" style={{ backgroundColor: templateColor }}></div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Sobre mí</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">{summary}</p>
            </section>
          )}

          {experience && experience.length > 0 && (
            <section>
               <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1" style={{ backgroundColor: templateColor }}></div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Experiencia Profesional</h2>
              </div>
              <div className="space-y-8">
                {experience.map(exp => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-gray-100">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 bg-white" style={{ borderColor: templateColor }}></div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl font-bold text-gray-800">{exp.jobTitle}</h3>
                      <span className="text-sm font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-500">
                        {exp.startDate} — {exp.endDate}
                      </span>
                    </div>
                    <p className="text-lg font-bold mb-2" style={{ color: templateColor }}>{exp.company}</p>
                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="w-80 bg-gray-50 p-10 space-y-10">
           {education && education.length > 0 && (
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                 <GraduationCap className="h-5 w-5" /> Educación
              </h2>
              <div className="space-y-6">
                {education.map(edu => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                    <p className="text-sm text-gray-500">{edu.institution}</p>
                    <p className="text-xs font-bold mt-1" style={{ color: templateColor }}>{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                 <Zap className="h-5 w-5" /> Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => skill.name && (
                  <Badge key={skill.id} className="rounded-none px-3 py-1 font-bold text-xs uppercase tracking-wider" style={{ backgroundColor: templateColor, color: 'white' }}>
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
