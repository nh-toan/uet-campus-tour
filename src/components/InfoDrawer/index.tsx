import { campusInfo } from '../../config/campus.config'
import { clubs } from '../../config/club.config'
import { faculties } from '../../config/faculty.config'
import { useUIStore, type UIState } from '../../store/useUIStore'
import type { Club } from '../../types/campus.types'

type DrawerTab = UIState['drawer']['tab']

const DRAWER_TABS: { id: DrawerTab; label: string }[] = [
  { id: 'about', label: 'Về trường' },
  { id: 'faculty', label: 'Liên chi - Khoa' },
  { id: 'club', label: 'Câu lạc bộ' },
]

const CLUB_CATEGORY_LABELS: Record<Club['category'], string> = {
  academic: 'Học thuật',
  sports: 'Thể thao',
  arts: 'Nghệ thuật',
  volunteer: 'Tình nguyện',
  other: 'Khác',
}

function AboutContent() {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-uet-display text-xl font-bold text-uet-navy">
          {campusInfo.name}
        </p>
        <p className="mt-2 font-uet-body text-sm leading-6 text-uet-slate">
          {campusInfo.slogan}
        </p>
      </div>

      <div className="rounded-xl border border-uet-slate/20 bg-uet-cloud p-4">
        <p className="font-uet-body text-xs font-bold tracking-wider text-uet-blue uppercase">
          Địa chỉ
        </p>
        <p className="mt-2 font-uet-body text-sm leading-6 text-uet-navy">
          {campusInfo.address}
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-3">
        {campusInfo.stats.map((stat) => (
          <div
            className="rounded-xl bg-uet-navy p-4 text-uet-cloud"
            key={stat.label}
          >
            <dd className="font-uet-display text-xl font-bold text-uet-gold">
              {stat.value}
            </dd>
            <dt className="mt-1 font-uet-body text-xs leading-5">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  )
}

function FacultyContent() {
  return (
    <div className="space-y-4">
      {faculties.map((faculty) => (
        <article
          className="rounded-xl border border-uet-slate/20 p-4"
          key={faculty.id}
        >
          <h3 className="font-uet-display text-base font-bold text-uet-navy">
            {faculty.name}
          </h3>
          {faculty.description ? (
            <p className="mt-2 font-uet-body text-sm leading-6 text-uet-slate">
              {faculty.description}
            </p>
          ) : null}
          <p className="mt-3 font-uet-body text-xs font-semibold text-uet-navy">
            Trưởng khoa: {faculty.dean}
          </p>
          <ul
            aria-label="Chương trình đào tạo"
            className="mt-3 flex flex-wrap gap-2"
          >
            {faculty.programs.map((program) => (
              <li
                className="rounded-full bg-uet-blue/10 px-3 py-1.5 font-uet-body text-xs text-uet-navy"
                key={program}
              >
                {program}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}

function ClubContent() {
  return (
    <div className="space-y-4">
      {clubs.map((club) => (
        <article
          className="rounded-xl border border-uet-slate/20 p-4"
          key={club.id}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-uet-display text-base font-bold text-uet-navy">
              {club.name}
            </h3>
            <span className="rounded-full bg-uet-gold/20 px-2.5 py-1 font-uet-body text-xs font-semibold text-uet-navy">
              {CLUB_CATEGORY_LABELS[club.category]}
            </span>
          </div>
          <p className="mt-2 font-uet-body text-sm leading-6 text-uet-slate">
            {club.description}
          </p>
          {club.memberCount === undefined ? null : (
            <p className="mt-3 font-uet-body text-xs font-semibold text-uet-blue">
              {club.memberCount} thành viên
            </p>
          )}
        </article>
      ))}
    </div>
  )
}

function DrawerContent({ activeTab }: { activeTab: DrawerTab }) {
  if (activeTab === 'about') {
    return <AboutContent />
  }

  if (activeTab === 'faculty') {
    return <FacultyContent />
  }

  return <ClubContent />
}

export function InfoDrawer() {
  const drawerOpen = useUIStore((state) => state.drawer.open)
  const activeTab = useUIStore((state) => state.drawer.tab)
  const openDrawer = useUIStore((state) => state.openDrawer)
  const closeDrawer = useUIStore((state) => state.closeDrawer)

  return (
    <div
      aria-hidden={!drawerOpen}
      className={`fixed inset-0 z-30 ${drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      inert={drawerOpen ? undefined : true}
    >
      <button
        aria-label="Đóng bảng thông tin"
        className={`absolute inset-0 h-full w-full bg-uet-navy/55 transition-opacity duration-300 motion-reduce:transition-none ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeDrawer}
        tabIndex={-1}
        type="button"
      />

      <section
        aria-labelledby="campus-info-title"
        aria-modal="true"
        className={`pointer-events-auto absolute inset-x-0 bottom-0 flex max-h-[82svh] min-h-0 flex-col rounded-t-2xl bg-uet-cloud shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-h-none md:w-[28rem] md:rounded-none md:rounded-l-2xl ${drawerOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full md:translate-y-0'}`}
        id="campus-info-drawer"
        role="dialog"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-uet-slate/20 px-4 py-3">
          <div>
            <p className="font-uet-body text-xs font-bold tracking-wider text-uet-blue uppercase">
              Khám phá UET
            </p>
            <h2
              className="mt-1 font-uet-display text-lg font-bold text-uet-navy"
              id="campus-info-title"
            >
              Thông tin khuôn viên
            </h2>
          </div>
          <button
            aria-label="Đóng bảng thông tin"
            className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-uet-slate/30 bg-uet-cloud font-uet-body text-xl text-uet-navy outline-none active:bg-uet-blue/10 focus-visible:ring-2 focus-visible:ring-uet-blue"
            onClick={closeDrawer}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div
          aria-label="Danh mục thông tin"
          className="grid shrink-0 grid-cols-3 border-b border-uet-slate/20 px-2"
          role="tablist"
        >
          {DRAWER_TABS.map((tab) => {
            const selected = activeTab === tab.id

            return (
              <button
                aria-controls="drawer-panel"
                aria-selected={selected}
                className={`min-h-11 touch-manipulation border-b-2 px-2 py-2 font-uet-body text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-uet-blue ${selected ? 'border-uet-blue text-uet-blue' : 'border-transparent text-uet-slate active:bg-uet-blue/10'}`}
                id={`drawer-tab-${tab.id}`}
                key={tab.id}
                onClick={() => openDrawer(tab.id)}
                role="tab"
                type="button"
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div
          aria-labelledby={`drawer-tab-${activeTab}`}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-6"
          id="drawer-panel"
          key={activeTab}
          role="tabpanel"
        >
          <DrawerContent activeTab={activeTab} />
        </div>
      </section>
    </div>
  )
}
