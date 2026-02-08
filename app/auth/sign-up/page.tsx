'use client';

import React from "react"
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/lib/i18n/context';
import { Heart, Sparkles, Building2, Users } from 'lucide-react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'hall_owner' | 'service_provider'>('hall_owner');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    if (password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    toast({ title: 'Success', description: t('signUpSuccess') });
    router.push('/auth/sign-up-success');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-serif font-semibold text-foreground">Marry.mk</span>
          </Link>
        </div>
        
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">{t('signUp')}</CardTitle>
            <CardDescription>
              Create an account to start your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('fullName')}</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-3">
                <Label>{t('selectRole')}</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as 'hall_owner' | 'service_provider')}
                  className="space-y-2"
                >
                  <label
                    htmlFor="hall_owner"
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      role === 'hall_owner' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="hall_owner" id="hall_owner" />
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <span className="text-sm font-medium">{t('hallOwnerRole')}</span>
                      <p className="text-xs text-muted-foreground">{t('hallOwnerDesc')}</p>
                    </div>
                  </label>
                  <label
                    htmlFor="service_provider"
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      role === 'service_provider' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="service_provider" id="service_provider" />
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                      <span className="text-sm font-medium">{t('serviceProviderRole')}</span>
                      <p className="text-xs text-muted-foreground">{t('serviceProviderDesc')}</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? t('loading') : t('signUp')}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {t('hasAccount')}{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                {t('login')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
