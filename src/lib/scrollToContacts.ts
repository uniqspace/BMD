// Smoothly scrolls to the company contacts block in the footer (present on every page).
// The footer is the last block of the page (and sticky on tablet/desktop), so scroll to the very end.
export function scrollToContacts() {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
}
