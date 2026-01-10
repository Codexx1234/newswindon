import { getDb } from './db';
import { chatbotFaqs } from '../drizzle/schema';

const initialFaqs = [
  {
    question: '¿Qué cursos ofrecen?',
    answer: 'Ofrecemos cursos de inglés para todas las edades: niños desde 3 años, jóvenes y adultos. También tenemos preparación para exámenes Cambridge (First Certificate y Proficiency), taller de conversación, preparación para ingreso a profesorado/traductorado, y capacitación corporativa para empresas.',
    category: 'cursos',
    isActive: true,
  },
  {
    question: '¿Desde qué edad pueden empezar los niños?',
    answer: 'Los niños pueden comenzar desde los 3 años. Tenemos grupos especiales para los más pequeños con metodología lúdica y divertida, adaptada a cada etapa del desarrollo.',
    category: 'cursos',
    isActive: true,
  },
  {
    question: '¿Preparan para exámenes de Cambridge?',
    answer: 'Sí, somos especialistas en preparación para exámenes de la Universidad de Cambridge. Preparamos para First Certificate (FCE) y Proficiency (CPE) con un alto índice de aprobación.',
    category: 'examenes',
    isActive: true,
  },
  {
    question: '¿Cuántos alumnos hay por grupo?',
    answer: 'Trabajamos con grupos reducidos de máximo 8 alumnos por clase. Esto nos permite brindar una atención personalizada a cada estudiante.',
    category: 'cursos',
    isActive: true,
  },
  {
    question: '¿Cobran matrícula?',
    answer: 'No, no cobramos matrícula ni derecho de examen. Solo abonás las clases mensuales.',
    category: 'precios',
    isActive: true,
  },
  {
    question: '¿Cuáles son los horarios de clase?',
    answer: 'Tenemos horarios flexibles de lunes a viernes de 9:00 a 21:00 y sábados de 9:00 a 13:00. Ofrecemos turnos mañana, tarde y noche para adaptarnos a tu disponibilidad.',
    category: 'horarios',
    isActive: true,
  },
  {
    question: '¿Dónde están ubicados?',
    answer: 'Estamos ubicados en Carapachay, Buenos Aires, Argentina. Podés contactarnos al 15 3070-7350 o por email a swindoncollege2@gmail.com para más información.',
    category: 'general',
    isActive: true,
  },
  {
    question: '¿Tienen capacitación para empresas?',
    answer: 'Sí, tenemos más de 30 años de experiencia brindando capacitación en inglés a empresas. Ofrecemos programas personalizados, modalidad in-company, y horarios flexibles adaptados a las necesidades de cada organización.',
    category: 'empresas',
    isActive: true,
  },
  {
    question: '¿Qué metodología utilizan?',
    answer: 'Utilizamos un enfoque comunicativo con recursos multimedios modernos: revistas en inglés, DVDs, videos y CDs. Nuestro objetivo es que los alumnos desarrollen las 4 habilidades del idioma: comprensión auditiva, lectura, escritura y conversación.',
    category: 'cursos',
    isActive: true,
  },
  {
    question: '¿Cuántos años de experiencia tienen?',
    answer: 'Tenemos más de 35 años de experiencia formando estudiantes de todas las edades. Nuestro mayor orgullo es mantener una relación de más de 30 años brindando servicios de capacitación a empresas.',
    category: 'general',
    isActive: true,
  },
  {
    question: '¿Tienen taller de conversación?',
    answer: 'Sí, ofrecemos un taller de conversación donde podrás practicar el idioma de forma intensiva en grupos reducidos. Es ideal para quienes quieren ganar fluidez y confianza al hablar en inglés.',
    category: 'cursos',
    isActive: true,
  },
  {
    question: '¿Cómo puedo inscribirme?',
    answer: 'Podés inscribirte completando el formulario de contacto en nuestra web, llamando al 15 3070-7350, o enviando un email a swindoncollege2@gmail.com. Te contactaremos a la brevedad para coordinar una entrevista y evaluar tu nivel.',
    category: 'general',
    isActive: true,
  },
];

export async function seedFaqs() {
  const db = await getDb();
  if (!db) {
    console.log('Database not available, skipping FAQ seed');
    return;
  }

  try {
    // Check if FAQs already exist
    const existing = await db.select().from(chatbotFaqs).limit(1);
    if (existing.length > 0) {
      console.log('FAQs already seeded, skipping...');
      return;
    }

    // Insert initial FAQs
    for (const faq of initialFaqs) {
      await db.insert(chatbotFaqs).values(faq);
    }
    
    console.log(`Seeded ${initialFaqs.length} FAQs successfully`);
  } catch (error) {
    console.error('Error seeding FAQs:', error);
  }
}
