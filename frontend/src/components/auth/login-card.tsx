'use client';

import { useRouter } from 'next/navigation';
import { BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export function LoginCard() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-md border-primary/20 bg-card/60 shadow-2xl shadow-primary/10 backdrop-blur-xl">
      <CardHeader className="items-center text-center space-y-4 pt-8">
        <BrainCircuit className="h-20 w-20 text-primary drop-shadow-glow-primary" />
        <CardTitle className="font-headline text-5xl font-black text-primary drop-shadow-glow-primary">
            NeuroFocus
        </CardTitle>
        <CardDescription className="text-lg text-foreground/80">
            Tune your mind. Achieve deep focus.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Button onClick={handleLogin} className="w-full text-lg h-14 bg-primary/90 hover:bg-primary text-primary-foreground font-bold" size="lg">
          Sign in
        </Button>
      </CardContent>
    </Card>
  );
}
