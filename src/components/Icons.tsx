import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 20, ...p }: P, children: React.ReactNode, filled = false) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...p}
    >
      {children}
    </svg>
  )
}

export const IconWhatsApp = (p: P) =>
  base(
    p,
    <path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.9L2.2 21.8l4.8-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2c0 1.2.9 2.3 1 2.5.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.3Z" />,
    true,
  )

export const IconArrowRight = (p: P) => base(p, <path d="M5 12h14m-6-6 6 6-6 6" />)
export const IconArrowLeft = (p: P) => base(p, <path d="M19 12H5m6-6-6 6 6 6" />)
export const IconChevronLeft = (p: P) => base(p, <path d="m15 5-7 7 7 7" />)
export const IconChevronRight = (p: P) => base(p, <path d="m9 5 7 7-7 7" />)
export const IconChevronDown = (p: P) => base(p, <path d="m6 9 6 6 6-6" />)
export const IconClose = (p: P) => base(p, <path d="M6 6l12 12M18 6 6 18" />)
export const IconSearch = (p: P) => base(p, <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>)
export const IconSliders = (p: P) =>
  base(p, <><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></>)
export const IconShare = (p: P) =>
  base(p, <><path d="M12 15V3m-4 4 4-4 4 4" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /></>)
export const IconCheck = (p: P) => base(p, <path d="m5 12.5 4.5 4.5L19 7.5" />)
export const IconShield = (p: P) =>
  base(p, <><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m8.8 12 2.2 2.2 4.2-4.4" /></>)
export const IconFile = (p: P) =>
  base(p, <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>)
export const IconCard = (p: P) =>
  base(p, <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h3" /></>)
export const IconSwap = (p: P) => base(p, <path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5" />)
export const IconPin = (p: P) =>
  base(p, <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>)
export const IconClock = (p: P) => base(p, <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>)
export const IconGauge = (p: P) =>
  base(p, <><path d="M4.5 17a8.5 8.5 0 1 1 15 0" /><path d="m12 13 3.5-4" /><circle cx="12" cy="13.5" r="1.2" /></>)
export const IconCalendar = (p: P) =>
  base(p, <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>)
export const IconFuel = (p: P) =>
  base(p, <><path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M4 10h10" /><path d="M14 8h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V9l-3-3" /></>)
export const IconGear = (p: P) =>
  base(p, <><circle cx="6" cy="6" r="2" /><circle cx="12" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="12" cy="18" r="2" /><path d="M6 8v8M12 8v8M18 8v4H6" /></>)
export const IconPlus = (p: P) => base(p, <path d="M12 5v14M5 12h14" />)
export const IconTrash = (p: P) =>
  base(p, <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />)
export const IconEdit = (p: P) => base(p, <path d="M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4" />)
export const IconStar = (p: P & { filled?: boolean }) => {
  const { filled, ...rest } = p
  return base(rest, <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />, filled)
}
export const IconTag = (p: P) =>
  base(p, <><path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9-8-8Z" /><circle cx="8" cy="8" r="1.4" /></>)
export const IconImage = (p: P) =>
  base(p, <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></>)
export const IconCamera = (p: P) =>
  base(p, <><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13.5" r="3.5" /></>)
export const IconLink = (p: P) =>
  base(p, <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />)
export const IconLock = (p: P) =>
  base(p, <><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>)
export const IconLogout = (p: P) => base(p, <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10" />)
export const IconSold = (p: P) => base(p, <><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>)
export const IconRefresh = (p: P) => base(p, <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" />)
export const IconCar = (p: P) =>
  base(p, <><path d="M3 16v-3.5l2-5A2 2 0 0 1 6.9 6h10.2a2 2 0 0 1 1.9 1.5l2 5V16a1 1 0 0 1-1 1h-1M3 16a1 1 0 0 0 1 1h1M3 12.5h18M9 17h6" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></>)
