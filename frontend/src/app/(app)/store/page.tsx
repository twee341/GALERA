'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const b2cFeatures = [
    "Unlimited Focus Sessions",
    "Historical Trend Analysis",
    "Personalized AI Insights",
    "Deep Work Optimization",
];

const b2bFeatures = [
    "All Pro Features",
    "Anonymized Department Analytics",
    "Team Productivity Dashboards",
    "Burnout Prevention Alerts",
    "ROI Calculator",
];


export default function StorePage() {
    const museImage = PlaceHolderImages.find(p => p.id === 'muse-headset');
    const neurosityImage = PlaceHolderImages.find(p => p.id === 'neurosity-headset');


    return (
        <div className="space-y-12">
            <header className="text-center py-8">
                <h1 className="text-5xl md:text-6xl font-black text-primary drop-shadow-glow-primary font-headline">
                    Your Potential Unlocked
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                    You already track your sleep and steps with an Apple Watch or Oura. It&apos;s time to track your most valuable asset: <span className="font-bold text-foreground">Your Focus.</span>
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <Card className="border-primary/20 bg-card/60 backdrop-blur-xl flex flex-col">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-3xl font-bold text-foreground">Pro Neural</CardTitle>
                        <CardDescription className="text-muted-foreground">For Students & Freelancers</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-6 text-center">
                        <p className="text-5xl font-black text-primary drop-shadow-glow-primary">$9.99<span className="text-lg font-medium text-muted-foreground"> / month</span></p>
                        <div className="text-left space-y-3">
                            {b2cFeatures.map(feature => (
                                <div key={feature} className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500"/>
                                    <span className="text-foreground/90">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-4 pt-6">
                        <p className="text-sm text-accent font-semibold drop-shadow-glow-accent">&quot;Master your attention economy.&quot;</p>
                        <Button size="lg" className="w-full text-lg h-12 font-bold">Subscribe to Pro</Button>
                    </CardFooter>
                </Card>

                <Card className="border-accent/80 bg-gradient-to-br from-card/80 to-accent/20 shadow-2xl shadow-accent/20 backdrop-blur-2xl flex flex-col ring-2 ring-accent/50">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-3xl font-bold text-accent drop-shadow-glow-accent">Enterprise</CardTitle>
                        <CardDescription className="text-muted-foreground">For Companies & Teams</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-6 text-center">
                        <p className="text-4xl font-black text-foreground">Custom Corporate Plan</p>

                        <div className="bg-background/50 border border-accent/30 rounded-lg p-4 my-4">
                            <p className="text-base font-semibold text-accent-foreground !leading-relaxed">
                                &quot;One burnt-out senior developer costs the company <span className="font-bold text-accent">$50k+</span> to replace. This subscription costs pennies compared to employee retention.&quot;
                            </p>
                        </div>

                        <div className="text-left space-y-3">
                            {b2bFeatures.map(feature => (
                                <div key={feature} className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500"/>
                                    <span className="text-foreground/90">{feature}</span>
                                </div>
                            ))}
                        </div>

                    </CardContent>
                    <CardFooter className="flex-col gap-2 pt-6">
                        <Button size="lg" variant="outline" className="w-full text-lg h-12 font-bold border-accent/50 text-accent hover:bg-accent/20 hover:text-accent-foreground">Contact Sales</Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="text-center max-w-4xl mx-auto py-8">
                <h2 className="text-4xl font-bold font-headline text-foreground">Hardware Agnostic Platform</h2>
                <p className="mt-2 text-lg text-muted-foreground">We don&apos;t force you to buy our headset. Use what you love.</p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {museImage && (
                        <div className="space-y-4">
                            <Image src={museImage.imageUrl} alt="Muse Headset" width={600} height={400} className="rounded-lg border border-primary/20 opacity-80" data-ai-hint={museImage.imageHint}/>
                            <p className="text-foreground font-semibold">Connect your device and start tracking instantly.</p>
                        </div>
                    )}
                    {neurosityImage && (
                        <div className="space-y-4">
                            <Image src={neurosityImage.imageUrl} alt="Neurosity Crown" width={600} height={400} className="rounded-lg border border-primary/20 opacity-80" data-ai-hint={neurosityImage.imageHint} />
                            <p className="text-foreground font-semibold">Seamless integration with leading hardware.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}