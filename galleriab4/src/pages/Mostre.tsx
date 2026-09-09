import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { WP_API_BASE, WP_AUTH_HEADERS, formatDateRange, formatOpening, type WpMostra } from '../lib/wp'

interface ExhibitionGroup {
  key: string
  label: string
  mostre: WpMostra[]
}

function groupMostre(mostre: WpMostra[]): ExhibitionGroup[] {
  const now = new Date()
  const future = mostre.filter((mostra) => new Date(mostra.data_inizio) > now)
  const current = mostre.filter(
    (mostra) => new Date(mostra.data_inizio) <= now && new Date(mostra.data_fine) >= now
  )
  const past = mostre.filter((mostra) => new Date(mostra.data_fine) < now)

  const byYear = new Map<number, WpMostra[]>()
  for (const mostra of past) {
    const year = new Date(mostra.data_inizio).getFullYear()
    if (!byYear.has(year)) byYear.set(year, [])
    byYear.get(year)!.push(mostra)
  }

  const yearGroups: ExhibitionGroup[] = [...byYear.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, yearMostre]) => ({
      key: String(year),
      label: String(year),
      mostre: yearMostre.sort(
        (a, b) => new Date(b.data_inizio).getTime() - new Date(a.data_inizio).getTime()
      ),
    }))

  const groups: ExhibitionGroup[] = []

  if (current.length > 0) {
    groups.push({
      key: 'in-corso',
      label: 'IN CORSO',
      mostre: current.sort((a, b) => new Date(a.data_inizio).getTime() - new Date(b.data_inizio).getTime()),
    })
  }

  if (future.length > 0) {
    groups.push({
      key: 'in-arrivo',
      label: 'PROSSIMAMENTE',
      mostre: future.sort((a, b) => new Date(a.data_inizio).getTime() - new Date(b.data_inizio).getTime()),
    })
  }

  return [...groups, ...yearGroups]
}

export default function Mostre() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const artistaFilter = searchParams.get('artista')
  const [allMostre, setAllMostre] = useState<WpMostra[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(null)
  const yearNavRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const mostre: WpMostra[] = await fetch(`${WP_API_BASE}/mostra&per_page=100`, {
          headers: WP_AUTH_HEADERS,
        }).then((res) => res.json())

        if (!cancelled) setAllMostre(mostre)
      } catch {
        if (!cancelled) setError('Impossibile caricare le mostre al momento.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredMostre = allMostre
    ? artistaFilter
      ? allMostre.filter((mostra) => mostra.artista.includes(artistaFilter))
      : allMostre
    : null

  const groups = filteredMostre ? groupMostre(filteredMostre) : null

  useEffect(() => {
    if (!groups || groups.length === 0) return

    const sections = groups
      .map(({ key }) => document.getElementById(`group-${key}`))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveGroupKey(entry.target.id.replace('group-', ''))
          }
        }
      },
      { rootMargin: '-160px 0px -70% 0px', threshold: 0 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [groups])

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 991px)')
    let lastY = window.scrollY
    let ticking = false

    function updateScroll() {
      const currentY = window.scrollY
      const delta = currentY - lastY
      lastY = currentY

      const el = yearNavRef.current
      if (el) {
        el.scrollLeft = mobileQuery.matches ? el.scrollLeft + delta : 0
      }
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(updateScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
      <section className="page-content">
        {artistaFilter && (
          <p className="mostre-filter">
            Mostre di <strong>{artistaFilter}</strong> — <Link to="/mostre">rimuovi filtro</Link>
          </p>
        )}

        {error && <p>{error}</p>}
        {groups && groups.length === 0 && (
          <p>{artistaFilter ? 'Nessuna mostra per questo artista.' : 'Nessuna mostra.'}</p>
        )}

        {groups && groups.length > 0 && (
          <div className="mostre-layout">
            <nav className="year-nav" aria-label="Naviga per anno">
              <ul ref={yearNavRef}>
                {groups.map(({ key, label }) => (
                  <li key={key}>
                    <a
                      href={`#group-${key}`}
                      className={key === activeGroupKey ? 'active' : ''}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mostre-content rise-in">
              {groups.map(({ key, label, mostre }) => (
                <section
                  key={key}
                  id={`group-${key}`}
                  className={`year-group${key === 'in-corso' || key === 'in-arrivo' ? ' year-group--status' : ''}`}
                >
                  <h2>{label}</h2>
                  <ul className="exhibitions-list">
                    {mostre.map((mostra) => (
                      <li
                        key={mostra.id}
                        className="exhibition-card exhibition-card--clickable"
                        onClick={() => navigate(`/mostre/${mostra.id}`)}
                      >
                        <div className="exhibition-cover-wrap">
                          {mostra.copertina ? (
                            <img className="exhibition-cover" src={mostra.copertina} alt={mostra.titolo} />
                          ) : (
                            <div className="exhibition-cover exhibition-cover--placeholder" />
                          )}
                        </div>
                        <div className="exhibition-info">
                          <h3>{mostra.titolo}</h3>
                          {mostra.artista.length > 0 && (
                            <p className="exhibition-artists">
                              {mostra.artista.map((name, i) => (
                                <span key={name}>
                                  <Link
                                    to={`/mostre?artista=${encodeURIComponent(name)}`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {name}
                                  </Link>
                                  {i < mostra.artista.length - 1 && ', '}
                                </span>
                              ))}
                            </p>
                          )}
                          <p className="exhibition-dates">
                            {key === 'in-arrivo' && mostra.data_apertura
                              ? formatOpening(mostra.data_apertura)
                              : formatDateRange(mostra.data_inizio, mostra.data_fine)}
                          </p>
                          {/* <Link to={`/mostre/${mostra.id}`} className="exhibition-cta">
                            Scopri di più
                          </Link> */}
                        </div>
                        <span className="exhibition-hover-label">Scopri di più</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        )}
      </section>
  )
}
