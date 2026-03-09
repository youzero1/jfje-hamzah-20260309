'use client';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center shadow">
              <span className="text-white font-bold text-lg">j</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">jfje</h1>
              <p className="text-xs text-slate-500 leading-tight">Your E-commerce Notes Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:block">Organize. Plan. Succeed.</span>
          </div>
        </div>
      </div>
    </header>
  );
}
