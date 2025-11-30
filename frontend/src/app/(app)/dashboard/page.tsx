'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '@/contexts/app-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AttentionChart from '@/components/dashboard/attention-chart';
import { useToast } from '@/hooks/use-toast';
import { Zap, ZapOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type AttentionDataPoint = {
    time: number;
    value: number | null;
};

export default function DashboardPage() {
    const { settings, isSessionActive, setIsSessionActive } = useAppContext();
    const [attentionScore, setAttentionScore] = useState(75);
    const [attentionData, setAttentionData] = useState<AttentionDataPoint[]>(() => Array.from({ length: 30 }, (_, i) => ({ time: i, value: null })));
    const { toast } = useToast();
    const [isHeadsetConnected, setIsHeadsetConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => setIsHeadsetConnected(true), 2000);
        return () => clearTimeout(timeout);
    }, []);

    const showFocusAlert = useCallback(() => {
        if (settings.visualAlerts) {
            toast({
                variant: 'destructive',
                title: '⚠️ Focus Lost!',
                description: `Attention score is below your threshold of ${settings.threshold}.`,
            });
        }
    }, [settings.visualAlerts, settings.threshold, toast]);

    useEffect(() => {
        if (isSessionActive) {
            setAttentionData(Array.from({ length: 30 }, (_, i) => ({ time: i, value: null })));
            setAttentionScore(75);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                console.error("NEXT_PUBLIC_API_URL is not defined.");
                return;
            }

            const wsUrl = apiUrl.replace(/^http/, 'ws') + '/working';

            ws.current = new WebSocket(wsUrl);

            ws.current.onopen = () => {
                console.log("WebSocket connection established");
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (typeof data.attentionScore === 'number') {
                        const newScore = data.attentionScore;
                        setAttentionScore(newScore);
                        setAttentionData(prevData => {
                            const lastTime = prevData.length > 0 ? prevData[prevData.length - 1].time : 0;
                            const newData = [...prevData.slice(1), { time: lastTime + 1, value: newScore }];
                            return newData;
                        });
                    }
                } catch (error) {
                    console.error("Failed to parse WebSocket message:", error);
                }
            };

            ws.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                toast({
                    variant: "destructive",
                    title: "Connection Error",
                    description: "Failed to connect to the focus data stream.",
                });
            };

            ws.current.onclose = () => {
                console.log("WebSocket connection closed");
            };

        } else {
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
            setAttentionData(Array.from({ length: 30 }, (_, i) => ({ time: i, value: null })));
        }

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [isSessionActive, toast]);



    useEffect(() => {
        if (isSessionActive && attentionScore < settings.threshold) {
            showFocusAlert();
        }
    }, [attentionScore, isSessionActive, settings.threshold, showFocusAlert]);

    const handleToggleSession = async () => {
        const newSessionState = !isSessionActive;
        const statusToSend = newSessionState ? 1 : 0;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            console.error("NEXT_PUBLIC_API_URL is not defined in your environment variables.");
            toast({
                variant: "destructive",
                title: "Configuration Error",
                description: "The API URL is not set.",
            });
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: statusToSend }),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            setIsSessionActive(newSessionState);
            toast({
                title: `Session ${newSessionState ? 'Started' : 'Ended'}`,
                description: `Successfully sent status ${statusToSend} to the API.`,
            });

        } catch (error) {
            console.error("Failed to send status to API:", error);
            toast({
                variant: "destructive",
                title: "API Error",
                description: "Could not update session status. Please try again.",
            });
        }
    };


    const isWarning = isSessionActive && attentionScore < settings.threshold;

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-3xl font-bold font-headline text-foreground">Dashboard</h2>
                <div className="flex items-center gap-3 rounded-full border border-primary/20 bg-card/50 px-4 py-2 backdrop-blur-sm">
                    <span className="text-muted-foreground">Headset Status</span>
                    <div className="relative flex h-3 w-3">
                        {isHeadsetConnected ? (
                            <>
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </>
                        ) : (
                            <>
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className={cn(
                    "lg:col-span-1 border-primary/20 bg-card/60 backdrop-blur-xl transition-all duration-300",
                    isWarning && "border-destructive/80 shadow-lg shadow-destructive/20"
                )}>
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-lg font-medium text-muted-foreground">Attention Score</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center gap-6">
                        <div className={cn(
                            "text-7xl font-black text-primary drop-shadow-glow-primary transition-colors",
                            isWarning && "text-destructive dropshadow-glow-destructive"
                        )}>
                            {isSessionActive ? Math.round(attentionScore) : '-'}
                        </div>
                        <Button
                            size="lg"
                            className="w-full text-xl h-16 font-bold"
                            onClick={handleToggleSession}
                            variant={isSessionActive ? 'destructive' : 'default'}
                            disabled={!isHeadsetConnected}
                        >
                            {isSessionActive ? <ZapOff className="mr-2"/> : <Zap className="mr-2"/>}
                            {isSessionActive ? 'End Session' : 'Start Session'}
                        </Button>
                    </CardContent>
                </Card>

                <Card className={cn(
                    "lg:col-span-2 border-primary/20 bg-card/60 backdrop-blur-xl transition-all duration-300",
                    isWarning && "border-destructive/80 shadow-lg shadow-destructive/20"
                )}>
                    <CardHeader>
                        <CardTitle>Live Brain Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AttentionChart data={attentionData} threshold={settings.threshold} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
