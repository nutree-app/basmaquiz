const PREP_MESSAGES = [
  "نراجع هدفك",
  "نحدد مكان تمرينك",
  "نختار مستوى الخطة المناسب",
  "نجهز توصيتك الخاصة",
];

const STEP_DELAY_MS = 550;

export function LoadingScreen() {
  return (
    <div className="animate-fade-in flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-border border-t-pink" />
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
            fill="#FFD21A"
            stroke="#FFD21A"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col items-start gap-4">
        {PREP_MESSAGES.map((message, index) => (
          <div
            key={message}
            className="flex animate-fade-in items-center gap-3 opacity-0"
            style={{
              animationDelay: `${index * STEP_DELAY_MS}ms`,
              animationFillMode: "forwards",
            }}
          >
            <span
              className="flex h-6 w-6 shrink-0 animate-fade-in items-center justify-center rounded-full bg-pink opacity-0"
              style={{
                animationDelay: `${index * STEP_DELAY_MS + 200}ms`,
                animationFillMode: "forwards",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-base font-bold text-foreground">{message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
