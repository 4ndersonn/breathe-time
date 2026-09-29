import React, { useState } from 'react';
import { Card } from '../components/ui/Card';

type Unit = 'Segundos' | 'Minutos' | 'Horas' | 'Dias' | 'Semanas' | 'Meses';

const presets = [
  { label: 'Expectativa global (73 anos)', value: 73 },
  { label: 'Até os 25 anos', value: 25 },
  { label: 'Uma década', value: 10 },
  { label: 'Um ano', value: 1 },
];

const units: Unit[] = ['Segundos', 'Minutos', 'Horas', 'Dias', 'Semanas', 'Meses'];

const formatNumber = (value: number) => Math.round(value).toLocaleString('pt-BR');

const abbreviateNumber = (value: number) => {
  const roundedValue = Math.round(value);
  if (roundedValue >= 1e9) return `${(roundedValue / 1e9).toFixed(1).replace('.', ',')} bi`;
  if (roundedValue >= 1e6) return `${(roundedValue / 1e6).toFixed(1).replace('.', ',')} mi`;
  return roundedValue.toLocaleString('pt-BR');
};

export const TimeEngine: React.FC = () => {
  const [years, setYears] = useState(73);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(73);
  const [activeUnit, setActiveUnit] = useState<Unit>('Segundos');
  const [age, setAge] = useState('');

  const seconds = years * 365.25 * 24 * 3600;
  const conversions: Record<Unit, number> = {
    Segundos: seconds,
    Minutos: seconds / 60,
    Horas: seconds / 3600,
    Dias: seconds / 86400,
    Semanas: seconds / (86400 * 7),
    Meses: seconds / (86400 * 30.44),
  };

  const ageValue = Number(age);
  const hasAge = age !== '' && Number.isFinite(ageValue);
  const invalidAge = hasAge && ageValue >= years;
  const books = Math.round(years * 12);
  const sleepDays = Math.round(years * 365.25 * 8 / 24);
  const beats = Math.round(years * 365.25 * 24 * 60 * 70);

  const handlePreset = (value: number) => {
    setYears(value);
    setSelectedPreset(value);
  };

  return (
    
    <div className="space-y-8 pb-12">
      <div className="border-b border-border/40 pb-6">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conversor de escala</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Motor do tempo</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">Escolha uma referência de tempo ou insira um valor customizado. Veja o que esses anos representam em cada escala.</p>
      </div>

      <Card className="border-white-100-50 bg-white-100-50 hover:bg-white/5 group cursor-pointer transition-colors duration-300">
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePreset(preset.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selectedPreset === preset.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Referência customizada</span>
            <span className="text-primary">{Math.round(years)} anos</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={years}
            onChange={(event) => {
              setYears(Math.round(Number(event.target.value)));
              setSelectedPreset(null);
            }}
            className="w-full accent-primary cursor-pointer"
          />
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border/70 bg-outline/50 p-1.5 w-fit">
        {units.map((unit) => (
          <button
            key={unit}
            onClick={() => setActiveUnit(unit)}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:text-sm ${
              activeUnit === unit ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {unit}
          </button>
        ))}
      </div>

      {/* Hero number dentro de Card com hover */}
      <Card className="border-white-100-50 bg-white-100-50 hover:bg-white/5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-default py-10 text-center">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{activeUnit}</span>
        <div className="mt-3 font-mono text-4xl font-whitebold tracking-tight sm:text-6xl">
          {formatNumber(conversions[activeUnit])}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">em {Math.round(years)} anos</p>
      </Card>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((unit) => (
          <Card key={unit} className="border-white-100-50 bg-white-100-50 hover:bg-white/5 group cursor-pointer transition-colors duration-300">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{unit}</span>
            <div className="mt-2 text-2xl font-semibold tracking-tight">{abbreviateNumber(conversions[unit])}</div>
            <p className="mt-1 text-xs text-muted-foreground">{formatNumber(conversions[unit])}</p>
          </Card>
        ))}
      </section>

      <section className="space-y-2 border-y border-border/40 py-8 text-lg leading-relaxed text-muted-foreground sm:text-xl">
        <p>Com esse tempo, você poderia ler cerca de {formatNumber(books)} livros, uma biblioteca inteira construída página a página.</p>
        <p>Você dedicaria cerca de {formatNumber(sleepDays)} dias inteiros ao sono, quase {formatNumber(Math.round(sleepDays / 365))} anos só de descanso.</p>
        <p>Seu coração bateria aproximadamente {formatNumber(beats)} vezes, silencioso e constante, sem pedir nada.</p>
      </section>

      <Card className="border-white-100-50 bg-white-100-50 hover:bg-white/5 group cursor-pointer transition-colors duration-300">
        <label htmlFor="age" className="text-sm font-medium">Quanto desse tempo já passou?</label>
        <input
          id="age"
          type="number"
          min="1"
          max={years}
          placeholder="Sua idade"
          value={age}
          onChange={(event) => setAge(event.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {invalidAge ? (
          <p className="text-xs font-medium text-red-600 dark:text-red-400">A idade deve ser menor que o período de referência.</p>
        ) : hasAge && ageValue >= 1 ? (
          <div className="space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-muted/60">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, Math.round((ageValue / years) * 100))}%` }} />
            </div>
            <div className="flex justify-between gap-4 text-xs text-muted-foreground">
              <span>{formatNumber(ageValue)} anos vividos</span>
              <span>{formatNumber(years - ageValue)} anos restantes para chegar na expectativa média selecionada!</span>
            </div>
            <p className="text-sm text-muted-foreground">{formatNumber(Math.round((ageValue / years) * 100))}% do tempo de referência já percorrido.</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
};
