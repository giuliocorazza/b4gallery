import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <p>
          Via Vinazzetti 4b
          <br />
          40126 Bologna
          <br />
          Italia
        </p>
        <p>
          Martedì - Sabato
          <br />
          17:00 - 20:00
        </p>
        <p>
          <a href="mailto:info@galleriab4.it">info@galleriab4.it</a>
          <br />
          <a href="tel:+393332223810">+39 3332223810</a>
        </p>
      </div>
    </footer>
  );
}
