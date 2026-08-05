/**
 * The handful of line icons the onboarding uses, drawn inline.
 *
 * The flow was originally built against lucide-react; inlining the twelve
 * glyphs it actually needs keeps this project's dependency list and lockfile
 * untouched, and ships a few hundred bytes instead of a package.
 *
 * All of them share lucide's drawing conventions — 24×24 box, no fill,
 * round caps and joins — so the stroke weights match the rest of the design.
 */

export interface IconProps {
  className?: string;
  strokeWidth?: number;
}

export type OnboardingIcon = (props: IconProps) => React.JSX.Element;

function Svg({
  className = "",
  strokeWidth = 2,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export const Check: OnboardingIcon = (props) => (
  <Svg {...props}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);

export const ChevronRight: OnboardingIcon = (props) => (
  <Svg {...props}>
    <path d="m9 18 6-6-6-6" />
  </Svg>
);

export const ArrowLeft: OnboardingIcon = (props) => (
  <Svg {...props}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </Svg>
);

export const Minus: OnboardingIcon = (props) => (
  <Svg {...props}>
    <path d="M5 12h14" />
  </Svg>
);

export const Plus: OnboardingIcon = (props) => (
  <Svg {...props}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Svg>
);

export const MapPin: OnboardingIcon = (props) => (
  <Svg {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);

export const Sparkles: OnboardingIcon = (props) => (
  <Svg {...props}>
    <path d="M9.9 2.6 8.5 6.2 4.9 7.6l3.6 1.4 1.4 3.6 1.4-3.6 3.6-1.4-3.6-1.4z" />
    <path d="m18 9-.9 2.3-2.3.9 2.3.9.9 2.3.9-2.3 2.3-.9-2.3-.9z" />
    <path d="m14 17-.6 1.6-1.6.6 1.6.6.6 1.6.6-1.6 1.6-.6-1.6-.6z" />
  </Svg>
);

export const Pencil: OnboardingIcon = (props) => (
  <Svg {...props}>
    <path d="M21.2 5.7a2.4 2.4 0 0 0-3.4-3.4L3.5 16.6 2 22l5.4-1.5z" />
    <path d="m15 5 4 4" />
  </Svg>
);

export const RotateCcw: OnboardingIcon = (props) => (
  <Svg {...props}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </Svg>
);

export const Calendar: OnboardingIcon = (props) => (
  <Svg {...props}>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M8 2v4M16 2v4M3 10h18" />
  </Svg>
);

export const Flame: OnboardingIcon = (props) => (
  <Svg {...props}>
    <path d="M12 2c1.5 3.5-1 5-1 7a3 3 0 0 0 6 0c0-.7-.2-1.3-.5-1.9C18.7 8.8 20 11.2 20 14a8 8 0 0 1-16 0c0-3.6 2.5-6.6 5-9 1.5-1.4 2.7-2.3 3-3" />
  </Svg>
);

export const Flag: OnboardingIcon = (props) => (
  <Svg {...props}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <path d="M4 22v-7" />
  </Svg>
);
