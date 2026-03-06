import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const COURSE_SECTIONS = [
  {
    id: 'ai-future-tech',
    label: 'AI & Future Tech',
    track: 'AI & Emerging Technologies',
    accent: 'from-indigo-500 to-purple-500',
    bg: 'bg-slate-900/80',
    description:
      'Build a future-proof career in artificial intelligence, large language models, and automation.',
    courses: [
      'Artificial Intelligence (AI) Fundamentals',
      'Generative AI (ChatGPT, Midjourney, AI Tools)',
      'Prompt Engineering Mastery',
      'Machine Learning (Beginner to Advanced)',
      'Deep Learning & Neural Networks',
      'Computer Vision',
      'NLP (Natural Language Processing)',
      'LLM Development (OpenAI, LangChain, RAG Systems)',
      'AI Automation for Business',
      'AI for Freelancing & Earning',
    ],
  },
  {
    id: 'data-analytics',
    label: 'Data & Analytics',
    track: 'Data & Analytics',
    accent: 'from-emerald-500 to-cyan-500',
    bg: 'bg-slate-900/80',
    description:
      'Turn raw data into insights and decisions with end‑to‑end analytics skills.',
    courses: [
      'Data Science Complete Course',
      'Data Analysis (Excel + Power BI + Tableau)',
      'Python for Data Science',
      'SQL & Database Management',
      'Data Engineering Basics',
    ],
  },
  {
    id: 'development',
    label: 'Development Courses',
    track: 'Software Development',
    accent: 'from-sky-500 to-indigo-500',
    bg: 'bg-slate-900/80',
    description:
      'Master full‑stack web and app development for real‑world products.',
    courses: [
      'Web Development (Full Stack – MERN)',
      'Frontend (HTML, CSS, JavaScript, React)',
      'Backend (Node.js / Django / Laravel)',
      'Mobile App Development (Flutter / React Native)',
      'WordPress Development',
      'Shopify & E-commerce Development',
    ],
  },
  {
    id: 'cloud-devops',
    label: 'Cloud & DevOps',
    track: 'Cloud & DevOps',
    accent: 'from-cyan-500 to-sky-400',
    bg: 'bg-slate-900/80',
    description:
      'Learn the tooling behind modern, scalable infrastructure and CI/CD pipelines.',
    courses: [
      'AWS Cloud Practitioner',
      'Microsoft Azure Fundamentals',
      'DevOps (CI/CD, Docker, Kubernetes)',
      'Cloud Deployment & Hosting',
    ],
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    track: 'Cybersecurity',
    accent: 'from-rose-500 to-orange-500',
    bg: 'bg-slate-900/80',
    description:
      'Protect systems, networks, and applications in one of the most in‑demand tech fields.',
    courses: [
      'Ethical Hacking',
      'Cybersecurity Fundamentals',
      'Network Security',
      'Penetration Testing',
    ],
  },
  {
    id: 'digital-skills',
    label: 'Digital Skills',
    track: 'Digital Marketing & E-commerce',
    accent: 'from-fuchsia-500 to-amber-400',
    bg: 'bg-slate-900/80',
    description:
      'Grow businesses online with marketing, design, and store‑building skills.',
    courses: [
      'Digital Marketing (SEO, Social Media, Ads)',
      'Amazon VA / Product Hunting',
      'Shopify Dropshipping',
      'Freelancing (Upwork, Fiverr Mastery)',
      'Graphic Design (Photoshop, Illustrator, Canva)',
      'Video Editing (Premiere Pro / CapCut)',
    ],
  },
  {
    id: 'business-productivity',
    label: 'Business & Productivity',
    track: 'Freelancing & Career Skills',
    accent: 'from-amber-400 to-lime-400',
    bg: 'bg-slate-900/80',
    description:
      'Upgrade your office, communication, and business‑building skills for any career.',
    courses: [
      'MS Office Complete',
      'Advanced Excel',
      'Business Communication',
      'Startup & Online Business Training',
    ],
  },
  {
    id: 'blockchain-web3',
    label: 'Blockchain & Web3',
    track: 'Blockchain & Web3',
    accent: 'from-violet-500 to-sky-500',
    bg: 'bg-slate-900/80',
    description:
      'Explore decentralized technologies, smart contracts, and the next generation of the web.',
    courses: [
      'Blockchain Fundamentals',
      'Cryptocurrency & Trading Basics',
      'Smart Contract Development (Solidity)',
      'Web3 Development',
      'NFT Creation & Marketing',
    ],
  },
  {
    id: 'game-dev',
    label: 'Game Development',
    track: 'Game Development',
    accent: 'from-indigo-500 to-emerald-500',
    bg: 'bg-slate-900/80',
    description:
      'Create games from idea to publishing across 2D, 3D, and mobile platforms.',
    courses: [
      'Unity Game Development',
      'Unreal Engine Basics',
      '2D Game Development',
      '3D Game Development',
      'Mobile Game Publishing',
    ],
  },
  {
    id: 'ui-ux',
    label: 'UI/UX Design',
    track: 'UI/UX Design',
    accent: 'from-sky-500 to-pink-500',
    bg: 'bg-slate-900/80',
    description:
      'Design beautiful, usable products with in‑demand UI and UX skills.',
    courses: [
      'UI/UX Design Fundamentals',
      'Figma Complete Course',
      'Mobile App UI Design',
      'Web UI Design',
      'UX Research & Wireframing',
    ],
  },
  {
    id: 'no-code',
    label: 'No-Code / Low-Code',
    track: 'No-Code / Low-Code',
    accent: 'from-emerald-400 to-blue-500',
    bg: 'bg-slate-900/80',
    description:
      'Ship apps and automations fast using modern no‑code and low‑code tools.',
    courses: [
      'Bubble.io Development',
      'Webflow Mastery',
      'No-Code App Development',
      'Automation with Zapier & Make',
    ],
  },
  {
    id: 'automation',
    label: 'Automation & Productivity',
    track: 'Automation & Productivity',
    accent: 'from-cyan-400 to-purple-500',
    bg: 'bg-slate-900/80',
    description:
      'Automate workflows using AI, spreadsheets, and business tools to save hours every week.',
    courses: [
      'Business Automation with AI',
      'Excel Automation with Python',
      'Google Workspace Automation',
      'CRM Setup & Automation',
    ],
  },
  {
    id: 'content-branding',
    label: 'Content Creation & Personal Branding',
    track: 'Content Creation',
    accent: 'from-rose-500 to-yellow-400',
    bg: 'bg-slate-900/80',
    description:
      'Grow an audience and build a personal brand with high‑impact content.',
    courses: [
      'YouTube Automation',
      'Content Creation with AI',
      'Social Media Growth Strategy',
      'Influencer Marketing',
      'Podcast Creation',
    ],
  },
  {
    id: 'remote-careers',
    label: 'Remote Jobs & International Careers',
    track: 'Remote Career & Jobs',
    accent: 'from-teal-400 to-indigo-500',
    bg: 'bg-slate-900/80',
    description:
      'Prepare for global opportunities with practical skills for remote work.',
    courses: [
      'Remote Job Hunting Guide',
      'LinkedIn Optimization',
      'CV & Portfolio Building',
      'Interview Preparation (Tech & Non-Tech)',
    ],
  },
]

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = (searchParams.get('search') || '').trim().toLowerCase()

  const handleSearchChange = (value) => {
    const next = new URLSearchParams(searchParams)
    if (!value.trim()) {
      next.delete('search')
    } else {
      next.set('search', value.trim())
    }
    setSearchParams(next)
  }

  const filteredSections = useMemo(() => {
    if (!search) return COURSE_SECTIONS

    return COURSE_SECTIONS.map((section) => {
      const matchesSection =
        section.label.toLowerCase().includes(search) ||
        section.track.toLowerCase().includes(search)

      const matchingCourses = section.courses.filter((course) =>
        course.toLowerCase().includes(search)
      )

      if (matchesSection || matchingCourses.length > 0) {
        return {
          ...section,
          courses: matchingCourses.length > 0 ? matchingCourses : section.courses,
        }
      }

      return null
    }).filter(Boolean)
  }, [search])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950/95 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90 px-5 py-6 sm:px-8 sm:py-8 shadow-xl shadow-slate-900/40">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                Learnova Academy
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
                Explore high‑demand learning paths
              </h1>
              <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                Carefully curated tracks across AI, development, data, design, and more.
                Choose a path, follow the sequence, and build a portfolio that gets you hired.
              </p>
            </div>

            <div className="w-full max-w-xs">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-300">
                Search courses
              </label>
              <div className="mt-1.5 relative">
                <input
                  type="search"
                  defaultValue={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="e.g. AI, Web, UI/UX…"
                  className="w-full rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-1 ring-transparent transition focus:border-blue-500 focus:ring-blue-500/60"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-300">
            {[
              'AI & Emerging Technologies',
              'Software Development',
              'Data & Analytics',
              'Cloud & DevOps',
              'Cybersecurity',
              'Digital Marketing & E-commerce',
              'Freelancing & Career Skills',
              'Blockchain & Web3',
              'Game Development',
              'UI/UX Design',
              'No-Code / Low-Code',
              'Automation & Productivity',
              'Content Creation',
              'Remote Career & Jobs',
            ].map((track) => (
              <span
                key={track}
                className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-slate-200"
              >
                {track}
              </span>
            ))}
          </div>
        </header>

        {filteredSections.length === 0 ? (
          <p className="text-sm text-slate-300">
            No courses match your search yet. Try a different keyword such as &quot;AI&quot;,
            &quot;web&quot;, or &quot;data&quot;.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredSections.map((section) => (
              <article
                key={section.id}
                className={`group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 ${section.bg} p-5 sm:p-6 shadow-lg shadow-slate-900/40 transition hover:-translate-y-1 hover:border-blue-500/70 hover:shadow-blue-500/30`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {section.track}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-50">
                        {section.label}
                      </h2>
                    </div>
                    <div
                      className={`hidden h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-br sm:block ${section.accent} transition-transform duration-150 group-hover:scale-105`}
                    />
                  </div>
                  <p className="text-sm text-slate-300">{section.description}</p>
                </div>

                <div className="mt-4 flex-1 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Included courses
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-100">
                    {section.courses.map((course) => (
                      <li
                        key={course}
                        className="flex items-start gap-2 rounded-xl bg-slate-900/70 px-3 py-1.5 text-xs sm:text-[13px] text-slate-100"
                      >
                        <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" />
                        <span>{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-800 pt-3 text-xs text-slate-300">
                  <span className="rounded-full bg-slate-900/90 px-3 py-1 text-[11px] text-slate-200">
                    {section.courses.length} course
                    {section.courses.length > 1 ? 's' : ''} in this path
                  </span>
                  <button
                    type="button"
                    className="rounded-full bg-blue-500 px-3 py-1.5 text-[11px] font-semibold text-slate-950 transition hover:bg-blue-400"
                  >
                    View details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesPage

