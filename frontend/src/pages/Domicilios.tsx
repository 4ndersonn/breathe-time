import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BarChart2, Table as TableIcon, RefreshCw, X, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { fetchDomicilios } from '../services/api';
import { DomicilioRecord } from '../types';

const countryTranslations: Record<string, string> = {
  'Afghanistan': 'Afeganistão', 'Albania': 'Albânia', 'Angola': 'Angola',
  'Argentina': 'Argentina', 'Armenia': 'Armênia', 'Aruba': 'Aruba',
  'Australia': 'Austrália', 'Austria': 'Áustria', 'Belgium': 'Bélgica',
  'Brazil': 'Brasil', 'Canada': 'Canadá', 'Chile': 'Chile', 'Colombia': 'Colômbia',
  'Costa Rica': 'Costa Rica', 'Czechia': 'República Tcheca', 'Denmark': 'Dinamarca',
  'Estonia': 'Estônia', 'Finland': 'Finlândia', 'France': 'França', 'Germany': 'Alemanha',
  'Greece': 'Grécia', 'Hungary': 'Hungria', 'Iceland': 'Islândia', 'India': 'Índia',
  'Ireland': 'Irlanda', 'Israel': 'Israel', 'Italy': 'Itália', 'Japan': 'Japão',
  'Latvia': 'Letônia', 'Lithuania': 'Lituânia', 'Luxembourg': 'Luxemburgo',
  'Mexico': 'México', 'Netherlands': 'Países Baixos', 'New Zealand': 'Nova Zelândia',
  'Norway': 'Noruega', 'Poland': 'Polônia', 'Portugal': 'Portugal', 'Russia': 'Rússia',
  'Slovakia': 'Eslováquia', 'Slovenia': 'Eslovênia', 'South Africa': 'África do Sul',
  'South Korea': 'Coreia do Sul', 'Spain': 'Espanha', 'Sweden': 'Suécia',
  'Switzerland': 'Suíça', 'Turkey': 'Turquia', 'United Kingdom': 'Reino Unido',
  'United States': 'Estados Unidos'
};

function translateCountry(name: string): string {
  return countryTranslations[name] || name;
}

export const Domicilios: React.FC = () => {
  const [data, setData] = useState<DomicilioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAno, setSelectedAno] = useState('');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  
  // Modal State for Country Detail
  const [modalCountry, setModalCountry] = useState<string | null>(null);
  const [modalSelectedYear, setModalSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedAno]);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetchDomicilios(undefined, selectedAno || undefined);
      setData(res || []);
    } catch (err) {
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  // Unique years available in dataset for dropdown
  const availableYears = Array.from(new Set(data.map(d => d.ano))).sort((a, b) => b - a);
  const totalUniqueCountries = new Set(data.map(d => d.pais)).size;

  // Process data for chart/table
  const processedData = React.useMemo(() => {
    if (!selectedAno) {
      const map = new Map<string, DomicilioRecord>();
      data.forEach(item => {
        const existing = map.get(item.pais);
        if (!existing || item.ano > existing.ano) {
          map.set(item.pais, item);
        }
      });
      return Array.from(map.values());
    } else {
      return data.filter(item => String(item.ano) === selectedAno);
    }
  }, [data, selectedAno]);

  const translatedData = processedData.map(item => ({
    ...item,
    paisPt: translateCountry(item.pais),
    percFormatted: Number(item.perc_domicilios_unipessoais.toFixed(2))
  }));

  const filteredData = translatedData.filter(item => 
    item.paisPt.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.percFormatted - a.percFormatted);

  // Top ranking for chart (Top 20)
  const chartRankingData = filteredData.slice(0, 20).reverse();

  // KPIs
  const allPercs = data.map(d => d.perc_domicilios_unipessoais);
  const globalAvg = allPercs.length > 0 ? (allPercs.reduce((a, b) => a + b, 0) / allPercs.length).toFixed(2) : '0.00';
  
  const sortedGlobal = [...translatedData].sort((a, b) => b.percFormatted - a.percFormatted);
  const maxCountry = sortedGlobal.length > 0 ? sortedGlobal[0] : null;
  const minCountry = sortedGlobal.length > 0 ? sortedGlobal[sortedGlobal.length - 1] : null;

  // Modal Country Records
  const modalCountryRecords = modalCountry 
    ? data.filter(d => d.pais === modalCountry).sort((a, b) => a.ano - b.ano)
    : [];

  const modalActiveRecord = modalSelectedYear !== null
    ? modalCountryRecords.find(r => r.ano === modalSelectedYear) || modalCountryRecords[modalCountryRecords.length - 1]
    : modalCountryRecords[modalCountryRecords.length - 1];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline"> Demografia</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Domicílios Unipessoais</h1>
          <p className="text-muted-foreground">Análise comparativa consolidada da proporção de lares com apenas um morador.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-orange-50/80 dark:bg-muted/50 p-1 rounded-xl border border-border/50">
            <button
              onClick={() => setViewMode('chart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'chart' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BarChart2 className="h-4 w-4" /> Gráfico
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TableIcon className="h-4 w-4" /> Tabela
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards in Top */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
       <Card className="border-white-50/60 bg-orange-60/50 dark:bg-card hover:bg-bg-white/5 group cursor-pointer transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Média Global (%)</span>
          </div>
          <div className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{globalAvg}%</div>
          <p className="text-xs text-muted-foreground mt-1">Média geral consolidada na base</p>
        </Card>

       <Card className="border-white-50/60 bg-orange-60/50 dark:bg-card hover:bg-bg-white/5 group cursor-pointer transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Maior Proporção</span>
          </div>
          <div className="text-xl font-semibold text-slate-800 dark:text-slate-100 truncate">
            {maxCountry ? maxCountry.paisPt : 'N/D'}
          </div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {maxCountry ? `${maxCountry.percFormatted}%` : '-'}
          </div>
        </Card>

       <Card className="border-white-50/60 bg-orange-60/50 dark:bg-card hover:bg-bg-white/5 group cursor-pointer transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menor Proporção</span>
          </div>
          <div className="text-xl font-semibold text-slate-800 dark:text-slate-100 truncate">
            {minCountry ? minCountry.paisPt : 'N/D'}
          </div>
          <div className="text-xs font-bold text-red-600 dark:text-red-400 mt-1">
            {minCountry ? `${minCountry.percFormatted}%` : '-'}
          </div>
        </Card>

       <Card className="border-white-50/60 bg-orange-60/50 dark:bg-card hover:bg-white/5 group cursor-pointer transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Países Analisados</span>
          </div>
          <div className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{totalUniqueCountries} Países</div>
          <p className="text-xs text-muted-foreground mt-1">Cobertura estatística internacional.</p>
        </Card>
      </section>

      {/* Filters Bar */}
     <Card className="border-white-100-50 bg-orange-50/60 dark:bg-card hover:bg-white/5 group cursor-pointer transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar país (ex: Brasil, Japão)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedAno}
              onChange={(e) => setSelectedAno(e.target.value)}
               className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none 
               hover:bg-muted focus:bg-muted dark:hover:bg-white/10 dark:focus:bg-white/10 transition-colors duration-300"            >
              <option value="">Todos os Anos (Consolidado)</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <Button variant="outline" size="md" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-1.5" /> Atualizar
            </Button>
          </div>
        </div>
      </Card>

      {/* Content View */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-[450px] w-full rounded-2xl" />
        </div>
      ) : viewMode === 'chart' ? (
         <Card className="border-white-100-50 bg-orange-50/60 dark:bg-card hover:bg-white/5 group cursor-pointer transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                Ranking de Domicílios Unipessoais ({selectedAno || 'Histórico Consolidado '})
              </h3>
              <p className="text-xs text-muted-foreground">
                Clique em qualquer barra do gráfico para abrir o perfil detalhado e histórico do país.
              </p>
            </div>
            <Badge variant="outline">{chartRankingData.length} países exibidos</Badge>
          </div>

          <div className="h-[550px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartRankingData} 
                layout="vertical" 
                margin={{ top: 10, right: 30, left: 90, bottom: 10 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    const countryName = e.activePayload[0].payload.pais;
                    setModalCountry(countryName);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis type="number" stroke="currentColor" opacity={0.7} fontSize={12} unit="%" domain={[0, 60]} />
                <YAxis type="category" dataKey="paisPt" stroke="currentColor" opacity={0.8} fontSize={12} width={110} />
                <Tooltip 
                  formatter={(val: any) => [`${Number(val).toFixed(2)}%`, 'Domicílios Unipessoais']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.75rem',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar 
                  dataKey="percFormatted" 
                  fill="#3b82f6" 
                  radius={[0, 8, 8, 0]} 
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="px-6 py-4">País</th>
                  <th className="px-6 py-4">Ano</th>
                  <th className="px-6 py-4">Domicílios Unipessoais (%)</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredData.map((row, idx) => (
                  <motion.tr 
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.01 }}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setModalCountry(row.pais)}
                  >
                    <td className="px-6 py-4 font-medium">{row.paisPt}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.ano}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{row.percFormatted}%</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="ghost">Ver Detalhes</Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Country Detail Centered Modal / Pop-up */}
      <AnimatePresence>
        {modalCountry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setModalCountry(null); setModalSelectedYear(null); }}
              className="absolute inset-0 bg-background/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {modalCountryRecords[0]?.codigo_pais || 'INT'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{translateCountry(modalCountry)}</h2>
                    <span className="text-xs text-muted-foreground">Evolução Histórica de Domicílios Unipessoais</span>
                  </div>
                </div>
                <button
                  onClick={() => { setModalCountry(null); setModalSelectedYear(null); }}
                  className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 pt-6 flex-1">
                {/* Active Record Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Ano Selecionado</span>
                    <div className="text-2xl font-bold mt-1">{modalActiveRecord?.ano || '-'}</div>
                  </Card>
                  <Card className="p-4">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Taxa Unipessoal</span>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                      {modalActiveRecord ? `${modalActiveRecord.perc_domicilios_unipessoais.toFixed(2)}%` : '-'}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total de Registros</span>
                    <div className="text-2xl font-bold mt-1">{modalCountryRecords.length} anos</div>
                  </Card>
                </div>

                {/* Year Selector inside Modal */}
                <div className="flex items-center gap-3 bg-muted/40 p-4 rounded-2xl border border-border/60">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Selecionar ano específico:</span>
                  <select
                    value={modalSelectedYear || modalCountryRecords[modalCountryRecords.length - 1]?.ano || ''}
                    onChange={(e) => setModalSelectedYear(parseInt(e.target.value))}
                    className="px-3 py-1.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {modalCountryRecords.map(r => (
                      <option key={r.ano} value={r.ano}>{r.ano} — {r.perc_domicilios_unipessoais.toFixed(2)}%</option>
                    ))}
                  </select>
                </div>

                {/* Line Chart inside Modal */}
                <div className="h-[280px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={modalCountryRecords} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                      <XAxis dataKey="ano" stroke="currentColor" opacity={0.7} fontSize={12} />
                      <YAxis stroke="currentColor" opacity={0.7} fontSize={12} unit="%" domain={[0, 60]} />
                      <Tooltip 
                        formatter={(val: any) => [`${Number(val).toFixed(2)}%`, 'Domicílios Unipessoais']}
                        labelFormatter={(label) => `Ano: ${label}`}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '0.75rem',
                          color: 'hsl(var(--foreground))',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Line type="monotone" dataKey="perc_domicilios_unipessoais" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-6 border-t border-border mt-6 flex justify-end">
                <Button onClick={() => { setModalCountry(null); setModalSelectedYear(null); }}>
                  Fechar Janela
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
