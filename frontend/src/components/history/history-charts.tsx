'use client';
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const weeklyData = [
  { day: 'Mon', focus: 65 },
  { day: 'Tue', focus: 78 },
  { day: 'Wed', focus: 85 },
  { day: 'Thu', focus: 72 },
  { day: 'Fri', focus: 81 },
  { day: 'Sat', focus: 92 },
  { day: 'Sun', focus: 68 },
];

const ratioData = [
  { name: 'Focused', value: 75 },
  { name: 'Distracted', value: 25 },
];

const chartConfig = {
  focus: {
    label: "Focus",
    color: "hsl(var(--accent))",
  },
  focused: {
    label: "Focused",
    color: "hsl(var(--primary))",
  },
  distracted: {
    label: "Distracted",
    color: "hsl(var(--destructive))",
  },
}

export function HistoryCharts() {
    return (
        <div className="grid gap-12 pt-4">
            <div className="h-[250px] w-full">
                <h3 className="text-center text-sm text-muted-foreground mb-2">Weekly Performance</h3>
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.1)" />
                        <XAxis dataKey="day" stroke="hsl(var(--foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} />
                        <YAxis stroke="hsl(var(--foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} />
                        <ChartTooltip cursor={{ fill: 'hsl(var(--accent)/0.1)' }} content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="focus" fill="var(--color-focus)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </div>
            <div className="h-[200px] flex flex-col justify-center items-center">
                 <h3 className="text-center text-sm text-muted-foreground mb-2">Focus vs. Distraction</h3>
                 <ChartContainer config={chartConfig} className="w-full h-full">
                    <PieChart>
                        <ChartTooltip cursor={{ fill: 'hsl(var(--accent)/0.1)' }} content={<ChartTooltipContent />} />
                        <Pie data={ratioData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} labelLine={false}>
                            {ratioData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name.toLowerCase()})`} stroke={`var(--color-${entry.name.toLowerCase()})`} />
                            ))}
                        </Pie>
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '14px' }}/>
                    </PieChart>
                </ChartContainer>
            </div>
        </div>
    );
}
