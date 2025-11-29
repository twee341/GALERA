'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { analyzeFocusTrends, FocusTrendOutput } from '@/ai/flows/focus-trend-analyzer';
import { Loader, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const mockHistoricalData = JSON.stringify([
  { session: 1, duration: 25, avg_focus: 85, distractions: 2, time: "morning" },
  { session: 2, duration: 45, avg_focus: 72, distractions: 5, time: "afternoon" },
  { session: 3, duration: 30, avg_focus: 91, distractions: 1, time: "morning" },
  { session: 4, duration: 60, avg_focus: 65, distractions: 8, time: "afternoon" },
  { session: 5, duration: 20, avg_focus: 88, distractions: 2, time: "evening" },
]);

export function FocusAnalysis() {
  const [analysis, setAnalysis] = useState<FocusTrendOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const result = await analyzeFocusTrends({ historicalData: mockHistoricalData });
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      setError('Failed to analyze trends. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="space-y-4">
        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full font-semibold">
          {isLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
              <Wand2 className="mr-2 h-4 w-4" />
          )}
          {analysis ? 'Re-analyze Trends' : 'Analyze My Focus Trends'}
        </Button>

        {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {analysis && (
            <div className="space-y-4 text-left pt-4">
              <Alert variant="default" className="border-primary/30 bg-primary/10">
                <Wand2 className="h-4 w-4 !text-primary" />
                <AlertTitle className="text-primary">AI Insights</AlertTitle>
                <AlertDescription className="text-foreground/80">{analysis.insights}</AlertDescription>
              </Alert>
              <Alert variant="default" className="border-accent/30 bg-accent/10">
                <Wand2 className="h-4 w-4 !text-accent" />
                <AlertTitle className="text-accent">Suggested Settings</AlertTitle>
                <AlertDescription className="text-foreground/80">{analysis.suggestedSettings}</AlertDescription>
              </Alert>
            </div>
        )}
      </div>
  );
}