'use client';
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis, ReferenceLine } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export default function AttentionChart({ data, threshold }: { data: any[], threshold: number }) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorAttention" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                         <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border border-border/50 bg-background/80 p-2 text-xs shadow-xl backdrop-blur-sm">
                                        <p className="font-bold text-primary">{`Score: ${payload[0].value}`}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                        cursor={false}
                    />
                    <ReferenceLine y={threshold} stroke="hsl(var(--destructive))" strokeDasharray="3 3" strokeWidth={1.5}  />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2.5}
                        fill="url(#colorAttention)"
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
