export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Flowing gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100" />
      
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-gray-900 animate-fade-in">
          Dive Into Efficiency with Aquivis
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
          The all-in-one software designed to make your pool service business shine. Streamline scheduling, invoicing, and client communication, all from one powerful platform.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay">
          <a href="/signup" className="btn shadow-lg shadow-primary/25 text-base px-8 py-3">Start Your Free Trial</a>
          <a href="/login" className="btn-ghost text-base px-8 py-3">Request a Demo</a>
        </div>
      </section>
    </main>
  );
}
