'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FocusTrendInputSchema = z.object({
  historicalData: z.string().describe('Historical focus session data in JSON format.'),
});

export type FocusTrendInput = z.infer<typeof FocusTrendInputSchema>;

const FocusTrendOutputSchema = z.object({
  insights: z.string().describe('Insights into focus trends. For example: "Based on the historical data, your focus tends to be higher in the morning and lower in the afternoon."'),
  suggestedSettings: z.string().describe('Personalized settings to optimize focus sessions. For example: "Consider scheduling your most important tasks for the morning when your focus is at its peak. Experiment with different alert thresholds to find what works best for you."'),
});

export type FocusTrendOutput = z.infer<typeof FocusTrendOutputSchema>;

const focusTrendPrompt = ai.definePrompt({
  name: 'focusTrendPrompt',
  input: { schema: FocusTrendInputSchema },
  output: { schema: FocusTrendOutputSchema },
  prompt: `You are a focus optimization expert. Analyze the user's historical focus session data to provide insights into their focus trends and suggest personalized settings that would help them optimize their focus sessions.

  The historical data is: {{{historicalData}}}

  Provide insights and suggested settings based on this data.
  `,
});

const focusTrendFlow = ai.defineFlow({
  name: 'focusTrendFlow',
  inputSchema: FocusTrendInputSchema,
  outputSchema: FocusTrendOutputSchema,
}, async (input) => {
  const { output } = await focusTrendPrompt(input);
  if (!output) {
    throw new Error('No output from prompt');
  }
  return output;
});

export async function analyzeFocusTrends(input: FocusTrendInput): Promise<FocusTrendOutput> {
  return focusTrendFlow(input);
}
