
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RiskChartProps {
  riskLevel: number;
}

const getBarColor = (value: number) => {
  if (value <= 33) return '#4ade80'; // Green
  if (value <= 66) return '#facc15'; // Yellow
  return '#f87171'; // Red
};

export const RiskChart: React.FC<RiskChartProps> = ({ riskLevel }) => {
    const data = [{ name: 'Risk', level: riskLevel }];

    return (
        <div style={{ width: '100%', height: 60 }}>
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            border: '1px solid #ccc',
                            borderRadius: '5px'
                        }}
                        labelStyle={{ fontWeight: 'bold' }}
                        formatter={(value) => [`${value}%`, 'Risk Level']}
                    />
                    <Bar dataKey="level" barSize={30} radius={[5, 5, 5, 5]} background={{ fill: '#eee', radius: 5 }}>
                         {
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.level)} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
