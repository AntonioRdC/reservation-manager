import {
  ArrowRight,
  ComputerIcon,
  Building,
  CalendarCheck,
  Layers3Icon,
  LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQProps {
  question: string;
  answer: string;
}

const FAQList: FAQProps[] = [
  {
    question: 'As reservas são gratuitas?',
    answer:
      'Não. Após a aprovação da solicitação de agendamento, a cobrança será enviada por e-mail ou estará disponível no site.',
  },
  {
    question: 'Como posso realizar uma reserva?',
    answer:
      'Cadastre-se no site. Após concluir o processo de cadastro, faça login e preencha o formulário de solicitação de agendamento.',
  },
  {
    question: 'É possível reservar espaços para eventos?',
    answer:
      'Sim. Durante a solicitação de um espaço, você poderá verificar a capacidade de pessoas permitida no local desejado.',
  },
];

interface FeatureProps {
  title: string;
  description: string;
  iconColor: string;
  icon: LucideIcon;
}

const features: FeatureProps[] = [
  {
    title: 'Espaços Disponíveis',
    description:
      'Escolha entre diferentes espaços equipados com TV, WIFI e acomodação personalizada para atender suas necessidades.',
    iconColor: 'bg-rose-500',
    icon: Building,
  },
  {
    title: 'Gestão de Recursos',
    description:
      'Reserve equipamentos adicionais como projetores e flipcharts para complementar seus eventos.',
    iconColor: 'bg-rose-500',
    icon: ComputerIcon,
  },
  {
    title: 'Calendário Integrado',
    description:
      'Gerencie todas as suas reservas e eventos em um só lugar, com sincronização em tempo real e integração com o Google Calendar. Receba automaticamente os detalhes do agendamento direto no seu e-mail.',
    iconColor: 'bg-rose-500',
    icon: CalendarCheck,
  },
];

export default function HomePage() {
  return (
    <main>
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Layers3Icon className="h-6 w-6" />
            <span className="ml-2 text-xl font-semibold text-rose-500">
              Reserva de espaços
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button>
              <Link href="/sign-in">Fazer login</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Faça reservas
                <span className="block text-rose-500">Gerencie eventos</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Crie uma conta e faça reservas em espaços públicos. Reserve
                salas para reuniões, cursos, consultorias, etc. Gerencie as
                reservas pelo Google Calendar e crie eventos.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <a
                  href="https://vercel.com/templates/next.js/next-js-saas-starter"
                  target="_blank"
                >
                  <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                    Acessar reservas
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"></div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;

              return (
                <div key={index} className="mt-10 lg:mt-0">
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-md text-white ${feature.iconColor}`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="mt-5">
                    <h2 className="text-lg font-medium text-gray-900">
                      {feature.title}
                    </h2>
                    <p className="mt-2 text-base text-gray-500 text-justify">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <Accordion
              type="single"
              collapsible
              className="w-full AccordionRoot"
            >
              {FAQList.map(({ question, answer }: FAQProps, value) => (
                <AccordionItem key={value} value={String(value)}>
                  <AccordionTrigger className="text-left font-bold text-gray-900">
                    {question}
                  </AccordionTrigger>

                  <AccordionContent className="text-gray-500">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full text-center">
        <h3>
          &copy; 2024 Page Made by{' '}
          <a
            target="_blank"
            href="https://github.com/AntonioRdC"
            className="text-rose-500 transition-all border-primary hover:border-b-2"
          >
            Antônio
          </a>
        </h3>
      </section>
    </main>
  );
}
