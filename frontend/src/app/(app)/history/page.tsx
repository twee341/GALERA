import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HistoryCharts } from '@/components/history/history-charts';
import { FocusAnalysis } from '@/components/history/focus-analysis';
import { Trophy, Clock, BarChart } from 'lucide-react';

const summaryData = [
    { title: 'Best Score', value: '98', icon: Trophy, color: 'text-primary' },
    { title: 'Total Focus Time', value: '14h 32m', icon: Clock, color: 'text-accent' },
    { title: 'Average Focus', value: '78%', icon: BarChart, color: 'text-emerald-400' },
];

export default function HistoryPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold font-headline text-foreground">History & Analytics</h2>

            <div className="grid gap-6 md:grid-cols-3">
                {summaryData.map((item) => (
                    <Card key={item.title} className="border-primary/20 bg-card/60 backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                            <item.icon className={`h-5 w-5 ${item.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold ${item.color} drop-shadow-[0_0_5px_currentColor]`}>{item.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-3 border-primary/20 bg-card/60 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle>Performance Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <HistoryCharts />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2 border-primary/20 bg-card/60 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle>AI Focus Analysis</CardTitle>
                        <CardDescription>Get personalized insights and suggestions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FocusAnalysis />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
