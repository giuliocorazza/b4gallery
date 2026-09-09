// Pretty permalinks (/wp-json/...) currently 404 on this host, but the REST
// API itself is public and works through the query-var fallback form.
export const WP_API_BASE = 'https://www.galleriab4.it/?rest_route=/wp/v2'

// Dev-only auth: lets the app read content that isn't public yet on the WP
// site. Credentials come from .env.local (gitignored), never committed.
const WP_USERNAME = import.meta.env.VITE_WP_USERNAME
const WP_APP_PASSWORD = import.meta.env.VITE_WP_APP_PASSWORD
export const WP_AUTH_HEADERS =
  WP_USERNAME && WP_APP_PASSWORD
    ? { Authorization: `Basic ${btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`)}` }
    : undefined

export interface WpMostra {
  id: number
  titolo: string
  artista: string[]
  copertina: string
  data_inizio: string
  data_fine: string
  data_apertura: string
  descrizione: string
}

export function formatOpening(value: string): string {
  const date = new Date(value)
  const datePart = date
    .toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
    .toUpperCase()
  const timePart = date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  return `${datePart} alle ${timePart}`
}

export function formatDateRange(start: string, end: string): string {
  const format = (value: string) =>
    new Date(value).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${format(start)} – ${format(end)}`.toUpperCase()
}
