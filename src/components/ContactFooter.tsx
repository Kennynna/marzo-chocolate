import { useContactModal } from '../lib/contactModal'
import { useSite } from '../lib/language'
import { useReveal } from '../lib/useReveal'
import './ContactFooter.css'

export function ContactFooter() {
  const ref = useReveal({ stagger: 0.1 })
  const contactModal = useContactModal()
  const { brand, contacts, cta, footer, ui } = useSite()

  return (
    <footer className="site-footer" id={contacts.id} ref={ref}>
      <div className="site-footer__contact">
        <div className="site-footer__intro">
          <h2 className="site-footer__title" data-reveal>
            {contacts.title}
          </h2>
          <p className="site-footer__lead" data-reveal>
            {contacts.lead}
          </p>
        </div>

        <div className="site-footer__columns">
          <div className="site-footer__block" data-reveal>
            <p className="site-footer__label">{ui.contactsLabel}</p>
            <a href={`tel:${contacts.phone.replace(/\s/g, '')}`}>{contacts.phone}</a>
            <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
            <button
              type="button"
              className="u-button-reset site-footer__order"
              onClick={contactModal.open}
            >
              {cta.contact}
            </button>
          </div>

          <div className="site-footer__block" data-reveal>
            <p className="site-footer__label">{contacts.hoursLabel}</p>
            <p className="site-footer__text">{contacts.hours}</p>
          </div>

          <div className="site-footer__block" data-reveal>
            <p className="site-footer__label">{contacts.addressLabel}</p>
            <p className="site-footer__text site-footer__address">{contacts.address}</p>
            <a href={contacts.maps.yandex} target="_blank" rel="noreferrer">
              {contacts.maps.yandexLabel}
            </a>
            <a href={contacts.maps.google} target="_blank" rel="noreferrer">
              {contacts.maps.googleLabel}
            </a>
          </div>

          <div className="site-footer__block" data-reveal>
            <p className="site-footer__label">{contacts.socialsLabel}</p>
            {contacts.socials.map((social) =>
              social.href ? (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              ) : (
                <span key={social.label} className="site-footer__muted">
                  {social.label}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="site-footer__legal">
        <div className="site-footer__company" data-reveal>
          <p>{brand.legalName}</p>
          <p>{brand.shortLegalName}</p>
          <p>
            {brand.ogrnLabel} {brand.ogrn}
            <br />
            {brand.innLabel} {brand.inn}
          </p>
        </div>

        <div className="site-footer__disclaimers" data-reveal>
          <p>{footer.offerDisclaimer}</p>
          <p>{footer.instagramDisclaimer}</p>
        </div>

        <div className="site-footer__links" data-reveal>
          <a href={footer.privacyHref}>{footer.privacy}</a>
          <a href={footer.creditsHref} target="_blank" rel="noreferrer">
            {footer.credits}
          </a>
        </div>
      </div>
    </footer>
  )
}
