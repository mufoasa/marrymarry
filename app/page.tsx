import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedHalls } from '@/components/home/featured-halls';
import { FeaturedServices } from '@/components/home/featured-services';
import type { Hall, Service } from '@/lib/types/database';

export const revalidate = 60; // Revalidate every minute

async function getHomePageData(): Promise<{ halls: Hall[]; services: Service[] }> {
  try {
    const supabase = await createClient();
    
    // Fetch both in parallel using the same client
    const [hallsResult, servicesResult] = await Promise.all([
      supabase
        .from('halls')
        .select('*')
        .eq('status', 'approved')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6),
      supabase
        .from('services')
        .select('*')
        .eq('status', 'approved')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6)
    ]);

    return {
      halls: hallsResult.data || [],
      services: servicesResult.data || []
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return { halls: [], services: [] };
  }
}

export default async function HomePage() {
  const { halls: featuredHalls, services: featuredServices } = await getHomePageData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedHalls halls={featuredHalls} />
        <FeaturedServices services={featuredServices} />
        
        {/* How It Works Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Finding and booking your dream wedding venue has never been easier
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-serif font-semibold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Browse Venues</h3>
                <p className="text-sm text-muted-foreground">
                  Explore our curated collection of beautiful wedding halls across Macedonia
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-serif font-semibold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Check Availability</h3>
                <p className="text-sm text-muted-foreground">
                  Use our calendar to find available dates that work for your celebration
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-serif font-semibold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Book & Celebrate</h3>
                <p className="text-sm text-muted-foreground">
                  Submit your booking request and get ready for your special day
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
              Ready to Find Your Perfect Venue?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join hundreds of happy couples who found their dream wedding hall on Marry.mk
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/venues" 
                className="inline-flex items-center justify-center h-11 px-8 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Browse Venues
              </a>
              <a 
                href="/auth/sign-up" 
                className="inline-flex items-center justify-center h-11 px-8 rounded-md border border-border bg-transparent text-foreground font-medium hover:bg-accent transition-colors"
              >
                List Your Venue
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
