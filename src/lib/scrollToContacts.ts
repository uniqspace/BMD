// Smoothly scrolls to the company contacts block in the footer (present on every page)
export function scrollToContacts() {
    document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
