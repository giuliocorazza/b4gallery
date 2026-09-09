import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WP_API_BASE, WP_AUTH_HEADERS, formatDateRange, formatOpening, type WpMostra } from '../lib/wp'

interface Featured {
  mostra: WpMostra
  label: string
}

function pickFeatured(mostre: WpMostra[]): Featured | null {
  const now = new Date()

  const current = mostre.filter(
    (mostra) => new Date(mostra.data_inizio) <= now && new Date(mostra.data_fine) >= now
  )
  if (current.length > 0) {
    return { mostra: current[0], label: 'In corso' }
  }

  const future = mostre.filter((mostra) => new Date(mostra.data_inizio) > now)
  if (future.length > 0) {
    future.sort((a, b) => new Date(a.data_inizio).getTime() - new Date(b.data_inizio).getTime())
    return { mostra: future[0], label: 'In arrivo' }
  }

  const past = mostre.filter((mostra) => new Date(mostra.data_fine) < now)
  if (past.length > 0) {
    past.sort((a, b) => new Date(b.data_fine).getTime() - new Date(a.data_fine).getTime())
    return { mostra: past[0], label: 'Passata' }
  }

  return null
}

export default function Home() {
  const [featured, setFeatured] = useState<Featured | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const mostre: WpMostra[] = await fetch(`${WP_API_BASE}/mostra&per_page=100`, {
          headers: WP_AUTH_HEADERS,
        }).then((res) => res.json())

        if (!cancelled) setFeatured(pickFeatured(mostre))
      } catch {
        if (!cancelled) setFeatured(null)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <section className="page-content">
        {featured && (
          <div className="featured-mostra">
            <div className="featured-mostra-info">
              <p className="featured-mostra-status">{featured.label}</p>
              <h3>{featured.mostra.titolo}</h3>
              {featured.mostra.artista.length > 0 && (
                <p className="exhibition-artists">
                  {featured.mostra.artista.map((name, i) => (
                    <span key={name}>
                      <Link to="/artisti">{name}</Link>
                      {i < featured.mostra.artista.length - 1 && ', '}
                    </span>
                  ))}
                </p>
              )}
              <p className="exhibition-dates">
                {featured.label === 'In arrivo' && featured.mostra.data_apertura
                  ? formatOpening(featured.mostra.data_apertura)
                  : formatDateRange(featured.mostra.data_inizio, featured.mostra.data_fine)}
              </p>
            </div>
            {featured.mostra.copertina && (
              <img
                className="featured-mostra-cover"
                src={featured.mostra.copertina}
                alt={featured.mostra.titolo}
              />
            )}
            {featured.mostra.descrizione && (
              <div
                className="featured-mostra-description"
                dangerouslySetInnerHTML={{ __html: featured.mostra.descrizione }}
              />
            )}
          </div>
        )}
      </section>
    </>
  )
}
