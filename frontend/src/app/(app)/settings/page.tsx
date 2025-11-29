'use client';

import { useAppContext } from '@/contexts/app-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const { settings, setSettings } = useAppContext();

  const handleThresholdChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, threshold: value[0] }));
  };

  const handleVisualAlertsChange = (checked: boolean) => {
    setSettings(prev => ({ ...prev, visualAlerts: checked }));
  };

  const handleAudioAlertsChange = (checked: boolean) => {
    setSettings(prev => ({ ...prev, audioAlerts: checked }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-headline text-foreground">Settings</h2>
      <Card className="max-w-2xl border-primary/20 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Alerts & Sensitivity</CardTitle>
          <CardDescription>Customize how NeuroFocus helps you stay on track.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="space-y-4">
            <Label htmlFor="threshold" className="text-lg">Focus Threshold</Label>
            <p className="text-sm text-muted-foreground">
              Warn me if my focus score drops below: <span className="font-bold text-primary text-base drop-shadow-glow-primary">{settings.threshold}</span>
            </p>
            <Slider
              id="threshold"
              min={0}
              max={100}
              step={5}
              value={[settings.threshold]}
              onValueChange={handleThresholdChange}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="visual-alerts" className="text-base font-medium">Visual Alerts</Label>
              <p className="text-sm text-muted-foreground">Show screen warnings and toast messages.</p>
            </div>
            <Switch
              id="visual-alerts"
              checked={settings.visualAlerts}
              onCheckedChange={handleVisualAlertsChange}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="audio-alerts" className="text-base font-medium">Audio Alerts</Label>
              <p className="text-sm text-muted-foreground">Play a sound when focus drops (feature pending).</p>
            </div>
            <Switch
              id="audio-alerts"
              checked={settings.audioAlerts}
              onCheckedChange={handleAudioAlertsChange}
              disabled
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
