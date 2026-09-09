import { useState, type FormEvent } from 'react'

export default function Info() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="page-content">
      <h1>Newsletter</h1>
      <p className="info-form-intro">
        Iscriviti alla newsletter per ricevere aggiornamenti su mostre ed eventi della galleria.
      </p>
      <form className="info-form" onSubmit={handleSubmit}>
        <label>
          Nome
          <input type="text" name="nome" required />
        </label>
        <label>
          Cognome
          <input type="text" name="cognome" required />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <button type="submit">Iscriviti</button>
        {submitted && (
          <p className="info-form-success">Grazie per esserti iscritto alla newsletter!</p>
        )}
      </form>
    </section>
  )
}
