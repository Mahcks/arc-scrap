interface IconProps {
  className?: string;
}

export function CoinIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M32 4C47.464 4 60 16.536 60 32C60 47.464 47.464 60 32 60C16.536 60 4 47.464 4 32C4 16.536 16.536 4 32 4ZM31.333 12C20.6558 12.0002 12.0002 20.6558 12 31.333C12 42.0104 20.6557 50.6668 31.333 50.667C42.0105 50.667 50.667 42.0105 50.667 31.333C50.6668 20.6557 42.0104 12 31.333 12Z" />
      <rect x="24" width="6" height="64" />
      <rect x="34.6667" width="6" height="64" />
    </svg>
  );
}

export function WeightIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3C13.1 3 14 3.9 14 5C14 5.73 13.6 6.4 13 6.72V9H18C19.1 9 20 9.9 20 11V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V11C4 9.9 4.9 9 6 9H11V6.72C10.4 6.4 10 5.73 10 5C10 3.9 10.9 3 12 3M12 5C11.45 5 11 5.45 11 6C11 6.55 11.45 7 12 7C12.55 7 13 6.55 13 6C13 5.45 12.55 5 12 5M6 11V20H18V11H6Z" />
    </svg>
  );
}

export function ChartIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 3V21H21V19H5V3H3M9 17H7V10H9V17M13 17H11V7H13V17M17 17H15V13H17V17M19 17H21V9H19V17Z" />
    </svg>
  );
}

export function RecycleIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`stroke-current ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </svg>
  );
}

export function StoreIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`stroke-current ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

export function AlertIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`stroke-current ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function FireIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`stroke-current ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

export function CheckIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.59L21 7Z" />
    </svg>
  );
}

export function CloseIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
    </svg>
  );
}

export function InfoIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13 9H11V7H13M13 17H11V11H13M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" />
    </svg>
  );
}

export function BookIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2M18 20H6V4H18V20M9 8H15V10H9V8M9 11H15V13H9V11M9 14H15V16H9V14Z" />
    </svg>
  );
}

export function LightbulbIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C8.14 2 5 5.14 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.14 15.86 2 12 2M14.85 13.1L14 13.7V16H10V13.7L9.15 13.1C7.8 12.16 7 10.63 7 9C7 6.24 9.24 4 12 4C14.76 4 17 6.24 17 9C17 10.63 16.2 12.16 14.85 13.1M11 20V19H13V20C13 20.55 12.55 21 12 21C11.45 21 11 20.55 11 20Z" />
    </svg>
  );
}

export function TargetIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2M12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4M12 7C9.2 7 7 9.2 7 12C7 14.8 9.2 17 12 17C14.8 17 17 14.8 17 12C17 9.2 14.8 7 12 7M12 9C13.7 9 15 10.3 15 12C15 13.7 13.7 15 12 15C10.3 15 9 13.7 9 12C9 10.3 10.3 9 12 9Z" />
    </svg>
  );
}

export function FlashIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 2V13H10V22L17 10H13L17 2H7Z" />
    </svg>
  );
}

export function DiamondIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 2L2 8L12 22L22 8L18 2H6M6.5 3.5H8.97L10.47 7.5H5.66L6.5 3.5M11.47 3.5H12.53L14.03 7.5H9.97L11.47 3.5M15.03 3.5H17.5L18.34 7.5H13.53L15.03 3.5M5.66 9H8.69L10.5 17.34L5.66 9M10.16 9H13.84L12 19.5L10.16 9M15.31 9H18.34L13.5 17.34L15.31 9Z" />
    </svg>
  );
}

export function PackageIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22C11.79 22 11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2C12.21 2 12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5M12 4.15L6.04 7.5L12 10.85L17.96 7.5L12 4.15M5 15.91L11 19.29V12.58L5 9.21V15.91M19 15.91V9.21L13 12.58V19.29L19 15.91Z" />
    </svg>
  );
}

export function SearchIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.5 3C13.09 3 16 5.91 16 9.5C16 11.11 15.41 12.59 14.44 13.73L14.71 14H15.5L20.5 19L19 20.5L14 15.5V14.71L13.73 14.44C12.59 15.41 11.11 16 9.5 16C5.91 16 3 13.09 3 9.5C3 5.91 5.91 3 9.5 3M9.5 5C7 5 5 7 5 9.5C5 12 7 14 9.5 14C12 14 14 12 14 9.5C14 7 12 5 9.5 5Z" />
    </svg>
  );
}

export function HammerIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`stroke-current ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9" />
      <path d="m18 15 4-4" />
      <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
    </svg>
  );
}

export function RocketIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8.18 17.24L6.76 15.83L2 20.59V22M2 19.17L6.09 15.09C5.88 14.79 5.73 14.47 5.64 14.12L2 17.76V19.17Z" />
    </svg>
  );
}

export function ClipboardIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={`fill-current ${className}`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 3H14.82C14.4 1.84 13.3 1 12 1S9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M12 3C12.55 3 13 3.45 13 4S12.55 5 12 5 11 4.55 11 4 11.45 3 12 3M7 7H17V5H19V19H5V5H7V7Z" />
    </svg>
  );
}
