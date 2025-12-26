import { CvData } from './types';

export const initialData: CvData = {
  personal: {
    fullName: 'Jane Doe',
    jobTitle: 'Software Engineer',
    email: 'jane.doe@email.com',
    phone: '123-456-7890',
    address: 'City, Country',
    linkedin: 'linkedin.com/in/janedoe',
    website: 'janedoe.dev',
    photoUrl: 'https://picsum.photos/seed/1/200/200',
  },
  summary: `Innovative and deadline-driven Software Engineer with 5+ years of experience designing and developing user-centered digital products from initial concept to final, polished deliverable.`,
  experience: [
    {
      id: 'exp1',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: `- Lead the development of a new microservices-based architecture, improving system scalability by 40%.\n- Mentor junior engineers, fostering a culture of technical excellence and continuous learning.\n- Collaborate with product managers to define feature specifications and deliver high-quality software on time.`,
    },
  ],
  education: [
    {
      id: 'edu1',
      institution: 'State University',
      degree: 'B.S. in Computer Science',
      startDate: '2012',
      endDate: '2016',
    },
  ],
  skills: [
    { id: 'skill1', name: 'React' },
    { id: 'skill2', name: 'Node.js' },
    { id: 'skill3', name: 'TypeScript' },
    { id: 'skill4', name: 'Docker' },
    { id: 'skill5', name: 'AWS' },
  ],
};
