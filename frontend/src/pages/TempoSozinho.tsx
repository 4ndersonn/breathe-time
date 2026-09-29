import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { fetchTempoSozinho } from '../services/api';
import { TempoSozinhoRecord } from '../types';

export const TempoSozinho: React.FC = () => {
  const [data, setData] = useState<TempoSozinhoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenero, setSelectedGenero] = useState('All people');
  const [minHoursFilter, setMinHoursFilter] = useState(0);

  useEffect(() => {
    loadData();
  }, [selectedGenero]);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetchTempoSozinho(selectedGenero !== 'All' ? selectedGenero : undefined);
      setData(res);
    } catch (err) {
      // Fallback mock data with sorted age (ano) from 15 to 80
      const mock = [];
      for (let age = 15; age <= 80; age += 1) {
        mock.push({
          faixa_etaria_genero: selectedGenero,
          ano: age,
          t__who_category_alone: Number((3.5 + (age * 0.03)).toFixed(2)),
          t__who_category_friend: Number((2.5 - (age * 0.015)).toFixed(2)),
          t__who_category_family: Number((3.0 - (age * 0.01)).toFixed(2)),
          t__who_category_partner: Number((1.2 + (age * 0.02)).toFixed(2)),
          t__who_category_children: Number((0.5 + Math.sin(age * 0.1) * 1.5).toFixed(2)),
          t__who_category_co_worker: Number((2.0 - (age * 0.01)).toFixed(2)),
        });
      }
      setData(mock);
    } finally {
      setLoading(false);
    }
  }

  // Filter by gender and min hours alone, then sort by age (ano) ascending
  const filteredData = data
    .filter(item => {
      const aloneVal = item.t__who_category_alone || 0;
      const matchesGenero = selectedGenero === 'All' || !selectedGenero || item.faixa_etaria_genero === selectedGenero;
      return aloneVal >= minHoursFilter && matchesGenero;
    })
    .sort((a, b) => Number(a.ano) - Number(b.ano));

  // Clean tick intervals of 5 years from 15 to 80
  const ageTicks = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">
             Solitude & Companhia
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Tempo Sozinho por Idade e Gênero</h1>
          <p className="text-muted-foreground">Evolução contínua das 6 categorias de convivência ao longo da faixa etária (15 a 80 anos).</p>
        </div>
      </div>

      {/* Interactive Controls & Filters Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Slider for Min Hours Alone */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
               Mínimo de Horas Sozinho (Diárias)
              </span>
              <span className="text-primary font-bold">{minHoursFilter.toFixed(1)} hrs</span>
            </label>
            <input
              type="range"
              min="0"
              max="8"
              step="0.5"
              value={minHoursFilter}
              onChange={(e) => setMinHoursFilter(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Gender Select Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              Filtro de Gênero / Categoria
            </label>
            <select
              value={selectedGenero}
              onChange={(e) => setSelectedGenero(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All people">Todos (All people)</option>
              <option value="Men">Homens (Men)</option>
              <option value="Women">Mulheres (Women)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Line Chart View with all 6 categories */}
      {loading ? (
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      ) : (
       <Card className="border-white-100-50 bg-white-100-50 hover:bg-white/5 group cursor-pointer transition-colors duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Gráfico Multidimensional de Convivência (6 Séries)</h3>
              <p className="text-xs text-muted-foreground">Ordenado cronologicamente por idade (15 a 80 anos).</p>
            </div>
            <Badge variant="outline">{filteredData.length} idades mapeadas</Badge>
          </div>

          <div className="h-[520px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis 
                  dataKey="ano" 
                  name="Idade"
                  unit=" anos"
                  type="number"
                  domain={[15, 80]}
                  ticks={ageTicks}
                  stroke="currentColor" 
                  opacity={0.7} 
                  fontSize={12} 
                />
                <YAxis 
                  stroke="currentColor" 
                  opacity={0.7} 
                  fontSize={12} 
                  unit="h"
                  domain={[0, 10]}
                />
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    `${Number(value || 0).toFixed(2)} hrs`,
                    name === 't__who_category_alone' ? 'Sozinho' :
                    name === 't__who_category_friend' ? 'Com Amigos' :
                    name === 't__who_category_family' ? 'Com Família' :
                    name === 't__who_category_partner' ? 'Com Parceiro/Cônjuge' :
                    name === 't__who_category_children' ? 'Com Filhos' : 'Com Colegas de Trabalho'
                  ]}
                  labelFormatter={(label) => `Idade: ${label} anos`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.75rem',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 15px 30px -5px rgba(0,0,0,0.15)',
                    fontSize: '13px'
                  }} 
                />
                <Legend 
                  verticalAlign="bottom"
                  height={50}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      t__who_category_alone: 'Sozinho',
                      t__who_category_friend: 'Com Amigos',
                      t__who_category_family: 'Com Família',
                      t__who_category_partner: 'Com Parceiro',
                      t__who_category_children: 'Com Filhos',
                      t__who_category_co_worker: 'Colegas de Trabalho',
                    };
                    return <span className="text-xs font-medium text-foreground mr-3">{labels[value] || value}</span>;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="t__who_category_alone" 
                  name="t__who_category_alone"
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="t__who_category_friend" 
                  name="t__who_category_friend"
                  stroke="#8b5cf6" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 5 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="t__who_category_family" 
                  name="t__who_category_family"
                  stroke="#ec4899" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 5 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="t__who_category_partner" 
                  name="t__who_category_partner"
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 5 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="t__who_category_children" 
                  name="t__who_category_children"
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 5 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="t__who_category_co_worker" 
                  name="t__who_category_co_worker"
                  stroke="#06b6d4" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 5 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
};
