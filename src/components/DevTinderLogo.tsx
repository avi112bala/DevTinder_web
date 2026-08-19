/**
 * DevTinder Logo — a heart formed from two code angle-brackets
 * Used in NavBar and Login page.
 */
const DevTinderLogo = ({ size = 28 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="DevTinder logo"
  >
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF4458" />
        <stop offset="100%" stopColor="#FF6B6B" />
      </linearGradient>
    </defs>

    {/* Left bracket < */}
    <path
      d="M20 10 L8 24 L20 38"
      stroke="url(#logo-grad)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Right bracket > */}
    <path
      d="M28 10 L40 24 L28 38"
      stroke="url(#logo-grad)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Heart dot in the centre */}
    <circle cx="24" cy="24" r="3.5" fill="url(#logo-grad)" />
  </svg>
)

export default DevTinderLogo
