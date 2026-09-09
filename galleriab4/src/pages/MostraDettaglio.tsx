import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { WP_API_BASE, WP_AUTH_HEADERS, formatDateRange, formatOpening, type WpMostra } from '../lib/wp'

function getStatus(mostra: WpMostra): string {
  const now = new Date()
  if (new Date(mostra.data_inizio) <= now && new Date(mostra.data_fine) >= now) return 'In corso'
  if (new Date(mostra.data_inizio) > now) return 'In arrivo'
  return 'Passata'
}

export default function MostraDettaglio() {
  const { id } = useParams()
  const [mostra, setMostra] = useState<WpMostra | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data: WpMostra = await fetch(`${WP_API_BASE}/mostra/${id}`, {
          headers: WP_AUTH_HEADERS,
        }).then((res) => res.json())

        if (!cancelled) setMostra(data)
      } catch {
        if (!cancelled) setError('Impossibile caricare la mostra.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  const status = mostra ? getStatus(mostra) : null

  return (
    <section className="page-content">
      <Link to="/mostre" className="back-link">
        Torna alle mostre
      </Link>

      {error && <p>{error}</p>}
      {/* {!error && !mostra && <p>Caricamento...</p>} */}

      {mostra && status && (
        <div className="featured-mostra">
          <div className="featured-mostra-info">
            <p className="featured-mostra-status">{status}</p>
            <h3>{mostra.titolo}</h3>
            {mostra.artista.length > 0 && (
              <p className="exhibition-artists">
                {mostra.artista.map((name, i) => (
                  <span key={name}>
                    <Link to="/artisti">{name}</Link>
                    {i < mostra.artista.length - 1 && ', '}
                  </span>
                ))}
              </p>
            )}
            <p className="exhibition-dates">
              {status === 'In arrivo' && mostra.data_apertura
                ? formatOpening(mostra.data_apertura)
                : formatDateRange(mostra.data_inizio, mostra.data_fine)}
            </p>
          </div>
          {mostra.copertina && (
            <img className="featured-mostra-cover" src={mostra.copertina} alt={mostra.titolo} />
          )}
          {mostra.descrizione && (
            <div
              className="featured-mostra-description"
              dangerouslySetInnerHTML={{ __html: mostra.descrizione }}
            />
          )}
        </div>
      )}
    </section>
  )
}
