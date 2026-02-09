import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-b from-primary/5 via-background to-background border-b">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
              About Marry.mk
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Your trusted partner in planning the perfect wedding
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <h2 className="font-serif text-3xl font-semibold mb-6">
                Our Story
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-4">
                Marry.mk was founded with a simple mission: to make wedding
                planning easier and more enjoyable for couples across North
                Macedonia. We understand that planning a wedding can feel
                overwhelming, which is why we created a single platform that
                brings together trusted wedding venues and services.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Our platform features carefully curated listings from cities
                such as Skopje, Tetovo, Gostivar, Ohrid, Bitola, and many more.
                Whether you’re searching for an elegant wedding hall or
                professional wedding services, Marry.mk helps you find
                everything in one place.
              </p>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-primary/10 -z-10 translate-x-4 translate-y-4" />
              <img
                src="https://i.imgur.com/9RQdbj5.jpeg"
                alt="Wedding celebration"
                className="rounded-2xl shadow-lg object-cover w-full h-[420px]"
              />
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We focus on quality, simplicity, and trust to help couples plan
                their special day with confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-background rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-semibold text-xl mb-2">
                  Simplify Planning
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Make wedding planning stress-free by providing all essential
                  information in one easy-to-use platform.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-background rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="font-semibold text-xl mb-2">
                  Connect Couples
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Bridge the gap between couples and the best wedding
                  professionals across North Macedonia.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-background rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="font-semibold text-xl mb-2">
                  Quality Selection
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We carefully feature trusted and high-quality venues and
                  services to make your special day unforgettable.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
