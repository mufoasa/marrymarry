'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useLanguage, type Language } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { Heart, Menu, Globe, User, LogOut, ChevronDown } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
  { code: 'mk', name: 'Македонски', flag: '🇲🇰' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-primary fill-primary" />
          <span className="text-lg sm:text-xl font-serif font-semibold text-foreground">Marry.mk</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            {t('home')}
          </Link>
          <Link href="/venues" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            {t('venues')}
          </Link>
          <Link href="/services" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            {t('services')}
          </Link>
          <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            {t('about')}
          </Link>
          <Link href="/contact" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            {t('contact')}
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector - Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 h-9 px-2 sm:px-3 bg-transparent">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">{currentLang.name}</span>
                <ChevronDown className="h-3 w-3 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? 'bg-accent' : ''}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <User className="h-4 w-4" />
                    <span className="max-w-24 truncate hidden lg:inline">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="bg-transparent">
                  <Link href="/auth/login">{t('login')}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/sign-up">{t('signUp')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 bg-transparent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <SheetHeader className="p-4 border-b text-left">
                <SheetTitle className="font-serif text-lg text-primary flex items-center gap-2">
                  <Heart className="h-5 w-5 fill-primary" />
                  Marry.mk
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col">
                <Link 
                  href="/" 
                  className="px-4 py-3 text-base font-medium border-b border-border/50 hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('home')}
                </Link>
                <Link 
                  href="/venues" 
                  className="px-4 py-3 text-base font-medium border-b border-border/50 hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('venues')}
                </Link>
                <Link 
                  href="/services" 
                  className="px-4 py-3 text-base font-medium border-b border-border/50 hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('services')}
                </Link>
                <Link 
                  href="/about" 
                  className="px-4 py-3 text-base font-medium border-b border-border/50 hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('about')}
                </Link>
                <Link 
                  href="/contact" 
                  className="px-4 py-3 text-base font-medium border-b border-border/50 hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('contact')}
                </Link>

                <div className="p-4 space-y-3">
                  {user ? (
                    <>
                      <p className="text-sm text-muted-foreground truncate pb-2">
                        {user.email}
                      </p>
                      <Button variant="outline" asChild className="w-full h-11 bg-transparent">
                        <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <User className="h-4 w-4 mr-2" />
                          {t('dashboard')}
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={handleSignOut}
                        className="w-full h-11 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('logout')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="w-full h-11 bg-transparent">
                        <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                          {t('login')}
                        </Link>
                      </Button>
                      <Button asChild className="w-full h-11">
                        <Link href="/auth/sign-up" onClick={() => setIsMenuOpen(false)}>
                          {t('signUp')}
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
