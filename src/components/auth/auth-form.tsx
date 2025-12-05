'use client'; 

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, User, CheckCircle2, MailIcon, KeyIcon } from "lucide-react"; // Added CheckCircle2

// List of trusted domains to prevent dummy/spam signups
const ALLOWED_DOMAINS = [
  "gmail.com", "googlemail.com",
  "yahoo.com", "ymail.com",
  "outlook.com", "hotmail.com", "live.com", "msn.com",
  "icloud.com", "me.com",
  "proton.me", "protonmail.com",
  "aol.com"
];

export default function AuthForm() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'signin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // Track message type
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const domain = email.split('@')[1];
    if (!domain || !ALLOWED_DOMAINS.includes(domain.toLowerCase())) {
        return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setMessage('');
    setIsSuccess(false);

    // 1. Validate Email Domain
    if (!validateEmail(email)) {
        setMessage("Please use a valid email provider (Gmail, Outlook, Yahoo, etc).");
        return;
    }

    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: username, 
        }
      }
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      setIsSuccess(false);
    } else {
      setMessage('Success! Check your email to confirm your account.');
      setIsSuccess(true); // Set success state
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setMessage('');
    setIsSuccess(false);
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setMessage(`Error: ${error.message}`);
      setIsSuccess(false);
    } else {
      router.push('/dashboard');
      router.refresh(); 
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center w-full px-4">
      
      <Tabs defaultValue={defaultTab} className="w-full max-w-[400px]">
        
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        {/* Sign In Tab */}
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Welcome back! Sign in to continue your quest.
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-in">Email</Label>
                  <div className="relative">
                    <MailIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input 
                      id="email-in" 
                      type="email" 
                      placeholder="Email"
                      value={email} 
                      className="pl-9"
                      onChange={(e) => setEmail(e.target.value)} 
                      disabled={loading}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-in">Password</Label>
                  <div className="relative">
                    <KeyIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input 
                      id="password-in" 
                      type="password" 
                      placeholder="Password"
                      value={password} 
                      className="pl-9"
                      onChange={(e) => setPassword(e.target.value)} 
                      disabled={loading}
                      required 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </CardFooter>
            </form>

          </Card>
        </TabsContent>

        {/* Sign Up Tab */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Start your journey. Create a free account.
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="username" 
                        type="text" 
                        placeholder="Adventure Name"
                        className="pl-9"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        disabled={loading} 
                        required
                        minLength={3}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-up">Email</Label>
                  <div className="relative">
                    <MailIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input 
                      id="email-up" 
                      type="email" 
                      placeholder="Email"
                      className="pl-9"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      disabled={loading} 
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Only authentic providers (Gmail, Outlook, etc.) allowed.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-up">Password</Label>
                  <div className="relative">
                    <KeyIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password-up" 
                      type="password"
                      placeholder="Password"
                      className="pl-9" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      disabled={loading}
                      required 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </CardFooter>
            </form>

          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 2. DYNAMIC MESSAGE STYLING */}
      {message && (
        <div 
          className={`mt-4 w-full max-w-[400px] rounded-md border p-3 text-center text-sm flex items-center justify-center gap-2 ${
            isSuccess 
              ? "border-green-500/50 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" // Green style
              : "border-destructive/50 bg-destructive/10 text-destructive" // Red style
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          )}
          <span className="break-words">{message}</span>
        </div>
      )}
    </div>
  );
}