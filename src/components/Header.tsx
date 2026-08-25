import { brand, cta, nav } from '../content/site'
import './Header.css'

export function Header() {
  return (
    <header className="header">
      <a className="header__brand" href="#welcome">
        {brand.name}
      </a>
      <nav className="header__nav">
        {nav.slice(0, 3).map((item) => (
          <a key={item.id} href={item.href}>
            {item.label}
          </a>
        ))}
        <a className="header__cta" href={nav[3].href}>
          {cta.contact}
        </a>
      </nav>
    </header>
  )
}
