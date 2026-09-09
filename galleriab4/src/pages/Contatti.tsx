export default function Contatti() {
  return (
    <section className="page-content">
      <h1>Contatti</h1>
      <div className="contatti-columns">
        <div>
          <p className="featured-mostra-status">Indirizzo</p>
          <p>
            Via Vinazzetti 4b
            <br />
            40126 Bologna
            <br />
            Italia
          </p>
        </div>
        <div>
          <p className="featured-mostra-status">Orari</p>
          <p>
            Martedì - Sabato
            <br />
            17:00 - 20:00
          </p>
        </div>
        <div>
          <p className="featured-mostra-status">Contatti</p>
          <p>
            <a href="mailto:info@galleriab4.it">info@galleriab4.it</a>
            <br />
            <a href="tel:+393332223810">+39 3332223810</a>
          </p>
        </div>
      </div>
    </section>
  )
}
