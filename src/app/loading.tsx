export default function Loading() {
  return (
    <div className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-[#d0bcff]/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#FFB0CD]/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 bg-[#121223]/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-4xl mx-auto">
          <div className="w-24 h-4 bg-white/10 rounded animate-pulse" />
          <div className="w-32 h-4 bg-white/10 rounded animate-pulse" />
          <div className="w-10" />
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="h-6 w-48 bg-white/10 rounded mx-auto mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-panel rounded-xl p-6 h-32 animate-pulse">
              <div className="w-10 h-10 bg-white/10 rounded-lg mb-3" />
              <div className="h-4 w-20 bg-white/10 rounded mb-2" />
              <div className="h-3 w-16 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
