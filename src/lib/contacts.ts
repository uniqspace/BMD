// Company contacts shown as round icon buttons (footer on mobile, mobile/tablet menu).
// Icons: solid glyphs on a 24x24 grid, all in one style.

// TODO: real email address and Facebook page are still to come from the client
export const EMAIL = 'info@example.com'
export const FACEBOOK = 'https://www.facebook.com/'

export type ContactIcon = { key: string; label: string; href: string; external: boolean; d: string }

export const CONTACT_ICONS: ContactIcon[] = [
    { key: 'phone', label: '+998 99 222 66 32', href: 'tel:+998992226632', external: false, d: 'M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384z' },
    { key: 'email', label: 'Email', href: `mailto:${EMAIL}`, external: false, d: 'M2 7.2V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7.2l-9.4 6.1a1.1 1.1 0 0 1-1.2 0z M2.9 4.6 12 10.5l9.1-5.9A2 2 0 0 0 20 4H4a2 2 0 0 0-1.1.6z' },
    { key: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/998992226632', external: true, d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z M 12.824,14.055 a 0.45,0.45 0 0,0 0.545,-0.136 l 0.159,-0.209 A 0.9,0.9 0 0,1 14.25,13.35 l 1.35,0 a 0.9,0.9 0 0,1 0.9,0.9 l 0,1.35 a 0.9,0.9 0 0,1 -0.9,0.9 A 8.1,8.1 0 0,1 7.5,8.4 a 0.9,0.9 0 0,1 0.9,-0.9 l 1.35,0 a 0.9,0.9 0 0,1 0.9,0.9 l 0,1.35 a 0.9,0.9 0 0,1 -0.36,0.72 l -0.210,0.157 a 0.45,0.45 0 0,0 -0.131,0.554 a 6.3,6.3 0 0,0 2.876,2.872 z' },
    { key: 'telegram', label: 'Telegram', href: 'https://t.me/+998992226632', external: true, d: 'M 3.10,10.58 l 17.45,-6.70 c 0.88,-0.35 1.58,0.17 1.41,1.41 l -2.99,13.92 c -0.17,1.05 -0.88,1.23 -1.76,0.70 l -4.58,-3.35 l -2.29,2.11 c -0.17,0.17 -0.52,0.35 -0.88,0.35 l 0.35,-4.76 l 8.63,-7.75 c 0.35,-0.35 0,-0.52 -0.52,-0.17 l -10.57,6.70 l -4.58,-1.41 c -1.05,-0.35 -1.05,-1.05 0.35,-1.05 z' },
    { key: 'facebook', label: 'Facebook', href: FACEBOOK, external: true, d: 'M13.6 22v-8.3h2.8l.4-3.3h-3.2V8.3c0-.95.27-1.6 1.63-1.6h1.74V3.8c-.3-.04-1.33-.13-2.53-.13-2.5 0-4.22 1.53-4.22 4.33v2.4H7.4v3.3h2.82V22z' },
    { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/sht.product', external: true, d: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M12 9.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z M17.5 5.3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z' },
]
