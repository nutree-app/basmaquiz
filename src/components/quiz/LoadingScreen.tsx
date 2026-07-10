export function LoadingScreen() {
  return (
    <div className="animate-fade-in flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-border border-t-pink" />
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path
            d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
            fill="#FFD21A"
            stroke="#FFD21A"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-lg font-extrabold text-foreground">
        جاري تحديد الخطة المناسبة لك...
      </p>
    </div>
  );
}
