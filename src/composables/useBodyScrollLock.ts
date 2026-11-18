import { watch, onUnmounted, type Ref } from 'vue'

// Shared counter: several overlays can lock the page at once (e.g. the mobile menu
// hands over to the booking popup). Scrolling comes back only when the last one closes,
// no matter in which order they open and close.
let locks = 0

function apply() {
  document.body.style.overflow = locks > 0 ? 'hidden' : ''
}

export function useBodyScrollLock(isOpen: Ref<boolean>) {
  let holding = false

  function set(open: boolean) {
    if (open && !holding) {
      holding = true
      locks++
    } else if (!open && holding) {
      holding = false
      locks = Math.max(0, locks - 1)
    }
    apply()
  }

  watch(isOpen, set, { immediate: true })

  onUnmounted(() => set(false))
}
