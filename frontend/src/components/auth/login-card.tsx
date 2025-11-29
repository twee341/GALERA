'use client';

import { useRouter } from 'next/navigation';
import { BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 fill-white"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.58 1.63-4.66 1.63-3.86 0-6.99-3.14-6.99-7s3.13-7 6.99-7c2.09 0 3.61.81 4.5 1.75l2.72-2.72C18.17 1.84 15.64 0 12.48 0 5.6 0 0 5.6 0 12.48s5.6 12.48 12.48 12.48c6.88 0 12.48-5.6 12.48-12.48 0-.81-.07-1.61-.21-2.38z"/></svg>
);


export function LoginCard() {
  const router = useRouter();

  const handleLogin = () => {
    // Mock login logic
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
          <GoogleIcon />
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
}
