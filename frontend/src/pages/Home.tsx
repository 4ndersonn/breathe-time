import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

interface HomeProps {
  onNavigate: (tab: string) => void;
}

const insights: [string, string, string][] = [
  [
    '1 em cada 5',
    'lares no mundo são habitados por apenas uma pessoa.',
    'A taxa global de domicílios unipessoais cresceu 4.2% na última década, com aceleração em áreas urbanas.',
  ],
  [
    '83.2%',
    'das pessoas dizem ter alguém confiável em momentos de crise.',
    'Mas o número médio de pessoas nessa rede caiu de 3.2 para 2.1 em dez anos, a rede existe, porém encolhe.',
  ],
  [
    '4.5 horas',
    'é o tempo médio que uma pessoa passa sozinha por dia.',
    'Entre solitude voluntária e isolamento compulsório, a fronteira é invisível, mas os dados conseguem distingui-las.',
  ],
  [
    '3.900 semanas',
    'é o que uma vida de 73 anos representa em tempo real.',
    'Uma perspectiva que o Motor do Tempo deste projeto permite explorar em qualquer escala, de segundos a décadas.',
  ],
];

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-12">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-16 md:pb-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-orange-500/5 to-transparent dark:from-blue-500/20 dark:via-orange-500/10" />

        <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 px-3 py-1 text-xs uppercase tracking-wider font-semibold">
              Análise Social
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]"
          >
            Radiografia Global do{' '}
            <span className="gradient-text">Comportamento e Solidão</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Explore análises avançadas de domicílios unipessoais, redes de suporte social e o tempo despendido em isolamento ao redor do mundo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Button size="lg" onClick={() => onNavigate('domicilio')}>
              Explorar Domicílios <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Opening paragraph */}
      <section className="max-w-2xl mx-auto px-4 text-center">
        <p className="text-muted-foreground text-lg leading-relaxed">
          Vivemos na era mais conectada da história. E, paradoxalmente, nunca nos sentimos tão sozinhos. Este projeto explora os dados por trás desse silêncio, e o que eles revelam sobre como habitamos o mundo e uns aos outros.
        </p>
      </section>

      {/* Insight blocks */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="rounded-xl border border-border bg-orange-50/60 dark:bg-card divide-y divide-border overflow-hidden">
          {insights.map(([number, phrase, context], index) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 + index * 0.1 }}
              whileHover={{ y: -3, backgroundColor: 'rgba(155, 142, 134, 0.06)' }}
              className="px-6 py-6 cursor-default"
            >
              <div className="flex gap-6 items-start">
                <div className="w-1 rounded-full bg-gradient-to-b from-orange-400 to-red-500 self-stretch shrink-0" />
                <div>
                  <div className="text-4xl font-semibold tracking-tight mb-2 bg-gradient-to-r from-orange-400 via-red-500 bg-clip-text text-transparent">
                    {number}
                  </div>
                  <p className="text-lg text-foreground font-medium">{phrase}</p>
                  <p className="text-sm text-muted-foreground mt-2">{context}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing line */}
      <p className="text-center text-sm tracking-widest text-muted-foreground font-medium">
        Os dados estão aqui. A interpretação é sua. Bons estudos!
      </p>

      {/* Navigation cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
        <Card onClick={() => onNavigate('domicilio')} className="border border-border hover:border-outline-400/50 bg-transparent hover:bg-gray-500/5 cursor-pointer transition-all duration-300">
          <h3 className="font-semibold text-base mb-1">Domicílios</h3>
          <p className="text-xs text-muted-foreground">Análise detalhada por país e ano de moradias unipessoais.</p>
        </Card>
        <Card onClick={() => onNavigate('suporte')} className="border border-border hover:border-outline-400/50 bg-transparent hover:bg-gray-500/5 cursor-pointer transition-all duration-300">
          <h3 className="font-semibold text-base mb-1">Suporte Social</h3>
          <p className="text-xs text-muted-foreground">Redes de apoio e conexões interpessoais globais.</p>
        </Card>
        <Card onClick={() => onNavigate('tempo')} className="border border-border hover:border-outline-400/50 bg-transparent hover:bg-gray-500/5 cursor-pointer transition-all duration-300">
          <h3 className="font-semibold text-base mb-1">Tempo Sozinho</h3>
          <p className="text-xs text-muted-foreground">Distribuição horária e categorização por faixa etária.</p>
        </Card>
        <Card onClick={() => onNavigate('timengine')} className="border border-border hover:border-outline-400/50 bg-transparent hover:bg-gray-500/5 cursor-pointer transition-all duration-300">
          <h3 className="font-semibold text-base mb-1">Motor do Tempo</h3>
          <p className="text-xs text-muted-foreground">Converta anos em segundos, semanas, meses e muito mais.</p>
        </Card>
      </section>

    </div>
  );
};