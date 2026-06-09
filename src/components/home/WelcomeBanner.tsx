interface WelcomeBannerProps {
  userName?: string;
  pendingCount?: number;
  urgentCount?: number;
}

export function WelcomeBanner({
  userName = "Employee",
  pendingCount = 3,
  urgentCount = 1,
}: WelcomeBannerProps) {
  return (
    <section
      className="bg-primary text-on-primary rounded-xl p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between relative overflow-hidden gap-8"
      aria-label="Welcome banner"
    >
      <div className="relative z-10">
        <h2 className="text-[32px] lg:text-[48px] font-bold leading-tight lg:leading-[56px] tracking-[-0.02em]">
          Good morning, {userName}.
        </h2>
        <p className="text-[16px] lg:text-[18px] leading-7 opacity-90 mt-2 max-w-xl">
          Stay updated with the latest news and company announcements for today.
        </p>
      </div>

      <div className="flex gap-4 lg:gap-6 relative z-10 flex-shrink-0">
        <div className="bg-white/10 backdrop-blur-md p-5 lg:p-6 rounded-lg border border-white/20 flex flex-col items-center min-w-[100px] lg:min-w-[120px]">
          <span className="text-[24px] font-bold">{pendingCount}</span>
          <span className="text-[11px] lg:text-[12px] opacity-80 uppercase tracking-widest font-mono mt-1">
            Pending
          </span>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-5 lg:p-6 rounded-lg border border-white/20 flex flex-col items-center min-w-[100px] lg:min-w-[120px]">
          <span className="text-[24px] font-bold">{urgentCount}</span>
          <span className="text-[11px] lg:text-[12px] opacity-80 uppercase tracking-widest font-mono mt-1">
            Urgent
          </span>
        </div>
      </div>

      {/* Decorative blur circle */}
      <div
        className="absolute right-[-10%] top-[-50%] w-[500px] h-[500px] bg-tertiary-container opacity-30 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
