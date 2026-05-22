import { useState } from 'react'
import './ForgotPassword.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  const resetForm = () => {
    setSubmitted(false)
    setEmail('')
  }

  return (
    <main className="forgot-password-page" dir="rtl">
      <div className={`reset-card ${submitted ? 'flipped' : ''}`}>
        <section className="card-face card-front">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C7.5 2 4 5.5 4 10v4H2v8h20v-8h-2v-4c0-4.5-3.5-8-8-8Zm-4 8c0-2.2 1.8-4 4-4s4 1.8 4 4v4H8v-4Zm12 10H4v-6h16v6Zm-8-3.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
            </svg>
          </div>
          <h1>هل نسيت كلمة المرور؟</h1>
          <p className="subtitle">سنرسل لك رابط إعادة التعيين على بريدك الإلكتروني</p>
          <form className="reset-form" onSubmit={handleSubmit}>
            <label htmlFor="email">البريد الإلكتروني</label>
            <input className="email-input"
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="submit-button">
              إرسال رابط إعادة التعيين
            </button>
          </form>
          <button type="button" className="link-button" onClick={resetForm}>
            ← العودة لتسجيل الدخول
          </button>
        </section>

        <section className="card-face card-back">
          <div className="success-mark">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9.5 16.5 5 12l1.4-1.4 3.1 3.1 7.1-7.1L17.9 8l-8.4 8.5ZM12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10Z" />
            </svg>
          </div>
          <h1>تم الإرسال!</h1>
          <p className="subtitle">لقد أرسلنا رابط إعادة التعيين إلى بريدك الإلكتروني.</p>
          <button type="button" className="submit-button" onClick={resetForm}>
            العودة لتسجيل الدخول
          </button>
        </section>
      </div>
    </main>
  )
}
