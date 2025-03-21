'use client';
// import { ScratchToReveal } from '@/components/magicui/scratch-to-reveal';
// import { RainbowButton } from '@/components/magicui/rainbow-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { DualRangeSlider } from '@/components/custom/DualRangeSlider';

import { Input } from '@/components/ui/input';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { BorderBeam } from '@/components/magicui/border-beam';

// import { NumberTicker } from '@/components/magicui/number-ticker';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useStore } from '@/lib/store';

const formSchema = z.object({
  role: z.string().min(1, { message: 'Role is required' }),
  problem: z.string().min(1, { message: 'Problem is required' }),
  confidence: z.number().int().min(1).max(10),
  clue: z.number().int().min(1).max(10),
  motivation: z.number().int().min(1).max(10),
});

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/app/api';

export default function Start() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
      problem: '',
      confidence: 5,
      clue: 5,
      motivation: 5,
      // terms: false,
    },
  });

  const [colorSlider, setColorSlider] = useState<number[]>([50, 50, 50]);

  const { color1, color2, setColor1, setColor2 } = useStore();

  const changeColorSlider = (index: number, value: number) => {
    const newColorSlider = [...colorSlider];
    newColorSlider[index] = value;
    setColorSlider(newColorSlider);

    // const color1 = `hsl(${colorSlider[0]}, 100%, 50%)`;
    // const color2 = `hsl(${colorSlider[1]}, 100%, 50%)`;
    // setColor1(color1);
    // setColor2(color2);

    // Ensure values are clamped between 0 and 100
    const clamp = (value: number) => Math.max(0, Math.min(100, value));

    const value1 = clamp(colorSlider[0]);
    const value2 = clamp(colorSlider[1]);
    const value3 = clamp(colorSlider[2]);

    // Map values to HSL components
    const hue1 = (value1 / 100) * 360; // Map to 0-360
    const saturation1 = 100; // Full saturation
    const lightness1 = 50; // Mid lightness

    const hue2 = (value2 / 100) * 360; // Map to 0-360
    const saturation2 = 100; // Full saturation
    const lightness2 = (value3 / 100) * 50 + 25; // Map to 25-75 for better contrast

    // Generate HSL color strings
    const color1 = `hsl(${hue1},${saturation1}%,${lightness1}%)`;
    const color2 = `hsl(${hue2},${saturation2}%,${lightness2}%)`;

    // Set colors
    setColor1(color1);
    setColor2(color2);

    console.log(color1, color2);
  };

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      // Convert form data to match slider values
      const sliderData = {
        ...data,
        // Map form values to corresponding colorSlider values (0-100 scale)
        clue: colorSlider[0],
        motivation: colorSlider[1],
        confidence: colorSlider[2],
      };

      // Construct URL with query parameters
      const url = new URL(`${BASE_URL}/init`, window.location.origin);

      // Add all form data as query parameters
      url.searchParams.append('role', data.role);
      url.searchParams.append('problem', data.problem);
      url.searchParams.append('clue', colorSlider[0].toString());
      url.searchParams.append('motivation', colorSlider[1].toString());
      url.searchParams.append('confidence', colorSlider[2].toString());

      console.log('Submitting data:', sliderData);

      // Make GET request to server
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Origin: 'http://innovation-sg.ch',
          'Access-Control-Request-Method': 'GET',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Server response was not ok');
      }

      // Parse response data
      const responseData = await response.json();

      // Add the slider data to the response before storing
      const fullData = {
        //@ts-expect-error type error
        ...responseData,
        ...sliderData,
      };

      // Store response data in localStorage to access it on the next page
      localStorage.setItem('startData', JSON.stringify(fullData));

      // Navigate to next page
      router.push('/chat/ey38he3udh3iuye29w');
    } catch (error) {
      console.error('Error:', error);
      toast('Error submitting your data', {
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className='flex justify-center items-center min-h-screen flex-col '
      suppressHydrationWarning>
      <div className='flex justify-center items-center flex-col w-1/2'>
        <Card className='absolute w-xl overflow-hidden'>
          <CardHeader>
            <CardTitle>Start</CardTitle>
            <CardDescription>
              We need some information to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-12'>
                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='I am CEO of company XYZ...'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='problem'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Problem</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="I canno't create any sales..."
                          className='resize-none h-36'
                          {...field}
                        />
                      </FormControl>
                      {/* <FormDescription>This is the event name.</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='clue'
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        How confident are you in knowing what your problems are?
                      </FormLabel>
                      <FormControl>
                        {/* <Slider defaultValue={[33]} max={100} step={1} /> */}
                        <DualRangeSlider
                          label
                          lableContenPos={'left'}
                          value={[colorSlider[0]]}
                          onValueChange={(widthPercentage) =>
                            widthPercentage != null &&
                            // setWidthPercentage1(widthPercentage[0])
                            changeColorSlider(0, widthPercentage[0])
                          }
                          min={0}
                          max={100}
                          step={1}
                        />
                      </FormControl>
                      {/* <FormDescription>This is the event name.</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='motivation'
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        How motivated are you to implement possible solutions?
                      </FormLabel>
                      <FormControl>
                        <DualRangeSlider
                          label
                          lableContenPos={'left'}
                          value={[colorSlider[1]]}
                          onValueChange={(widthPercentage) =>
                            widthPercentage != null &&
                            changeColorSlider(1, widthPercentage[0])
                          }
                          min={0}
                          max={100}
                          step={1}
                        />
                      </FormControl>
                      {/* <FormDescription>This is the event name.</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='confidence'
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        How confident do you feel about your current situation?{' '}
                      </FormLabel>
                      <FormControl>
                        <DualRangeSlider
                          label
                          lableContenPos={'left'}
                          value={[colorSlider[2]]}
                          onValueChange={(widthPercentage) =>
                            widthPercentage != null &&
                            changeColorSlider(2, widthPercentage[0])
                          }
                          min={0}
                          max={100}
                          step={1}
                        />
                      </FormControl>
                      {/* <FormDescription>This is the event name.</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name='terms'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center space-x-2'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel htmlFor='terms'>
                          Accept terms and conditions
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <Button className={'w-full'} type='submit' disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Submit'}
                </Button>

                {/* <RainbowButton type='submit'>Submit</RainbowButton> */}
              </form>
            </Form>
          </CardContent>
          {/* <CardFooter></CardFooter> */}
          <BorderBeam
            duration={8}
            size={100}
            colorFrom={color1}
            colorTo={color2}
          />
        </Card>
      </div>
    </div>
  );
}
