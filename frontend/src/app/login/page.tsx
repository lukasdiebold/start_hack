'use client';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { BorderBeam } from '../../components/magicui/border-beam';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';

// import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/authContext';
import { fetchToken } from "../api/index";



const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const [error, setError] = useState("");

  console.log(error);

  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (data: { username: string; password: string }) => {
    setError("");

    try {
      const tokenData = await fetchToken(data.username, data.password);
      localStorage.setItem("token", tokenData.access_token);
      login();
      router.push('/chat/ey38he3udh3iuye29w');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };


  // function onSubmit(data: z.infer<typeof formSchema>) {
  //   setSubmitted(true);
  //   router.push('/chat/ey38he3udh3iuye29w');
  //   toast('Login successful', {
  //     description: (
  //       <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
  //         <code className='text-white'>Logged in as: {data.username}</code>
  //       </pre>
  //     ),
  //   });
  // }
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
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Please enter your credentials to login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='space-y-8'>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter your username'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className={'w-full'} type='submit'>
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
          <BorderBeam duration={8} size={100} />
        </Card>
      </div>
    </div>
  );
}