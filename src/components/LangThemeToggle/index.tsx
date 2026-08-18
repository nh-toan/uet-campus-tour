import { Languages } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'

export function LangThemeToggle() {
  const lang = useUIStore((state) => state.lang)
  const setLang = useUIStore((state) => state.setLang)
  const languageLabel = lang === 'vi' ? 'VI' : 'EN'

  return (
    <div
      aria-label="Ngôn ngữ"
      className="flex items-center rounded-2xl border border-uet-cloud/30 bg-uet-navy/95 p-1.5 text-uet-cloud shadow-lg backdrop-blur-sm"
      role="group"
    >
      <button
        aria-label={
          lang === 'vi'
            ? 'Ngôn ngữ hiện tại: Tiếng Việt. Chuyển sang English'
            : 'Current language: English. Switch to Vietnamese'
        }
        aria-pressed={lang === 'en'}
        className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center gap-2 rounded-xl bg-uet-cloud/10 px-3 font-uet-body text-sm font-bold text-uet-cloud outline-none active:bg-uet-navy-soft focus-visible:ring-2 focus-visible:ring-uet-gold"
        onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
        type="button"
      >
        <Languages aria-hidden="true" size={18} strokeWidth={2} />
        <span aria-live="polite">{languageLabel}</span>
      </button>
    </div>
  )
}
