import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WP_API_BASE, WP_AUTH_HEADERS, type WpMostra } from '../lib/wp'

function getArtistNames(mostre: WpMostra[]): string[] {
  const names = new Set<string>()
  for (const mostra of mostre) {
    for (const name of mostra.artista) {
      names.add(name)
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b, 'it'))
}

export default function Artisti() {
  const [artisti, setArtisti] = useState<string[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const mostre: WpMostra[] = await fetch(`${WP_API_BASE}/mostra&per_page=100`, {
          headers: WP_AUTH_HEADERS,
        }).then((res) => res.json())

        if (!cancelled) setArtisti(getArtistNames(mostre))
      } catch {
        if (!cancelled) setError('Impossibile caricare gli artisti al momento.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="page-content">
      <h1>Artisti</h1>

      {error && <p>{error}</p>}
      {artisti && artisti.length === 0 && <p>Nessun artista.</p>}

      {artisti && artisti.length > 0 && (
        <ol className="artisti-list">
          {artisti.map((name) => (
            <li key={name}>
              <Link to={`/mostre?artista=${encodeURIComponent(name)}`}>{name}</Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
