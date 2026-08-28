import { languages } from '../content/site'
import { useContactModal } from '../lib/contactModal'
import { useLanguage } from '../lib/language'
import './Header.css'

export function Header() {
  const contactModal = useContactModal()
  const { lang, setLang, content } = useLanguage()

  return (
    <header className="header">
      <a className="header__brand" href="#welcome">
        {content.brand.name}
      </a>
      <nav className="header__nav">
        {content.nav.map((item) => (
          <a className="header__link" key={item.id} href={item.href}>
            {item.label}
          </a>
        ))}

        <div className="header__lang" role="group" aria-label={content.ui.languageLabel}>
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              className={`u-button-reset header__lang-option${
                item.code === lang ? ' header__lang-option--active' : ''
              }`}
              onClick={() => setLang(item.code)}
              aria-pressed={item.code === lang}
              title={item.title}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button type="button" className="u-button-reset header__cta" onClick={contactModal.open}>
          {content.cta.contact}
        </button>
      </nav>
    </header>
  )
}
