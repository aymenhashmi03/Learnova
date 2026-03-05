import { useState } from 'react'
import { Link } from 'react-router-dom'
import header1 from '../assets/header1.jpg'
import header2 from '../assets/header2.jpg'

// Load all asset images so we can pick relevant ones by keyword
const assetImages = import.meta.glob('../assets/*.{png,jpg,jpeg,webp}', {
  eager: true,
  as: 'url',
})

const findImage = (keyword) => {
  const lower = keyword.toLowerCase()
  const entry = Object.entries(assetImages).find(([path]) =>
    path.toLowerCase().includes(lower),
  )
  return entry ? entry[1] : null
}

const aiAndFutureTech = [
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
]

const dataAndAnalytics = [
  'Data Science Complete Course',
  'Data Analysis (Excel + Power BI + Tableau)',
  'Python for Data Science',
  'SQL & Database Management',
  'Data Engineering Basics',
]

const developmentCourses = [
  'Web Development (Full Stack – MERN)',
  'Frontend (HTML, CSS, JavaScript, React)',
  'Backend (Node.js / Django / Laravel)',
  'Mobile App Development (Flutter / React Native)',
  'WordPress Development',
  'Shopify & E-commerce Development',
]

const cloudDevOps = [
  'AWS Cloud Practitioner',
  'Microsoft Azure Fundamentals',
  'DevOps (CI/CD, Docker, Kubernetes)',
  'Cloud Deployment & Hosting',
]

const cybersecurity = [
  'Ethical Hacking',
  'Cybersecurity Fundamentals',
  'Network Security',
  'Penetration Testing',
]

const digitalSkills = [
  'Digital Marketing (SEO, Social Media, Ads)',
  'Amazon VA / Product Hunting',
  'Shopify Dropshipping',
  'Freelancing (Upwork, Fiverr Mastery)',
  'Graphic Design (Photoshop, Illustrator, Canva)',
  'Video Editing (Premiere Pro / CapCut)',
]

const uiUxCourses = [
  'UI/UX Design Fundamentals',
  'Figma Complete Course',
  'Mobile App UI Design',
  'Web UI Design',
  'UX Research & Wireframing',
]

const noCodeCourses = [
  'Bubble.io Development',
  'Webflow Mastery',
  'No-Code App Development',
  'Automation with Zapier & Make',
]

const automationCourses = [
  'Business Automation with AI',
  'Excel Automation with Python',
  'Google Workspace Automation',
  'CRM Setup & Automation',
]

const contentCreation = [
  'YouTube Automation',
  'Content Creation with AI',
  'Social Media Growth Strategy',
  'Influencer Marketing',
  'Podcast Creation',
]

const remoteCareer = [
  'Remote Job Hunting Guide',
  'LinkedIn Optimization',
  'CV & Portfolio Building',
  'Interview Preparation (Tech & Non-Tech)',
]

const heroSlides = [
  {
    id: 1,
    title: 'Courses from $9.99',
    subtitle: 'Level up your skills for today and tomorrow.',
    cta: 'Browse courses',
    image: header1,
  },
  {
    id: 2,
    title: 'New AI & Future Tech programs',
    subtitle: 'Master AI, automation, and future-ready digital skills.',
    cta: 'Explore AI courses',
    image: header2,
  },
]

const trendingCourseCards = [
  {
    key: 'tc-1',
    title: 'AI Engineer Agentic Track',
    tag: 'Bestseller · Advanced',
    description:
      'Design, build, and deploy agentic AI systems with real-world projects and tools.',
    image: findImage('TC-1') || findImage('ai') || header1,
  },
  {
    key: 'tc-2',
    title: '100 Days of Code™: The Complete Python Pro Bootcamp',
    tag: 'Guided path',
    description:
      'Go from beginner to confident Python developer with daily hands-on challenges.',
    image: findImage('TC-2') || findImage('python') || header2,
  },
  {
    key: 'tc-3',
    title: 'Ultimate AWS Certified Solutions Architect Associate',
    tag: 'Certification prep',
    description:
      'Prepare for the AWS SAA exam with scenarios, labs, and exam-style questions.',
    image: findImage('TC-3') || findImage('cloud') || header1,
  },
  {
    key: 'tc-4',
    title: 'Prompt Engineering Mastery',
    tag: 'AI skills',
    description:
      'Learn to design high-impact prompts for ChatGPT, Claude, and leading LLMs.',
    image: findImage('TC-4') || findImage('prompt') || header2,
  },
]

const trustedCompanies = [
  'Google',
  'Microsoft',
  'Amazon Web Services',
  'Meta',
  'Netflix',
  'IBM',
  'Cisco',
  'Salesforce',
  'Adobe',
  'Spotify',
]

const essentialCards = [
  {
    key: 'ai',
    title: 'AI & Future Tech',
    items: aiAndFutureTech,
    image: findImage('ai') || header1,
  },
  {
    key: 'data',
    title: 'Data & Analytics',
    items: dataAndAnalytics,
    image: findImage('data') || header2,
  },
  {
    key: 'dev',
    title: 'Development',
    items: developmentCourses,
    image: findImage('development') || findImage('dev') || findImage('code') || header1,
  },
  {
    key: 'cloud',
    title: 'Cloud & DevOps',
    items: cloudDevOps,
    image: findImage('cloud') || findImage('devops') || header2,
  },
]

const transformCards = [
  {
    key: 'future',
    title: 'AI & Future Tech',
    description: 'Stay ahead with AI, LLMs, and automation skills.',
    image: findImage('future') || findImage('ai') || header1,
  },
  {
    key: 'career',
    title: 'Career accelerators',
    description: 'Guided paths for developers, analysts, designers, and more.',
    image: findImage('career') || findImage('path') || header2,
  },
  {
    key: 'remote',
    title: 'Freelancing & remote work',
    description: 'Learn freelancing, branding, and remote-job skills.',
    image: findImage('remote') || findImage('freelance') || header1,
  },
]

const careerTracks = [
  {
    key: 'fullstack',
    title: 'Full Stack Web Developer',
    description:
      'Build frontends, backends, APIs, and deploy production-ready applications with modern tools.',
    image:
      findImage('S3-Full stack') ||
      findImage('full stack') ||
      findImage('developer') ||
      header1,
  },
  {
    key: 'digital-marketer',
    title: 'Digital Marketer',
    description:
      'Learn performance marketing, SEO, social media, and analytics to grow brands online.',
    image:
      findImage('S3-Digital marketer') ||
      findImage('digital marketer') ||
      findImage('marketing') ||
      header2,
  },
  {
    key: 'data-scientist',
    title: 'Data Scientist',
    description:
      'Go from fundamentals to machine learning, analytics, and real-world data projects.',
    image:
      findImage('S3-Data Science') ||
      findImage('data science') ||
      findImage('analytics') ||
      header1,
  },
  {
    key: 'ui-ux',
    title: 'UI/UX Designer',
    description:
      'Design intuitive interfaces and user journeys using Figma, design systems, and UX research.',
    image:
      findImage('S3-UI/UX') ||
      findImage('ui ux') ||
      findImage('design') ||
      header2,
  },
]

const teamCards = [
  {
    key: 'team-plan',
    title: 'Team plan',
    subtitle: '2 to 50 people · For your team',
    image: findImage('Team1') || findImage('team-1') || header1,
  },
  {
    key: 'enterprise-plan',
    title: 'Enterprise plan',
    subtitle: '20+ people · For your whole organization',
    image: findImage('Team2') || findImage('team-2') || header2,
  },
  {
    key: 'ai-fluency',
    title: 'AI fluency',
    subtitle: 'AI foundations and role-based learning paths.',
    image: findImage('Team3') || findImage('team-3') || header1,
  },
]

const globalTrendsImage =
  findImage('banner') || findImage('global-trends') || findImage('report') || header2

const HomePage = () => {
  const [activeSlide, setActiveSlide] = useState(0)

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  return (
    <div className="space-y-16">
      {/* 1. Hero header with sliding banners */}
      <section className="overflow-hidden rounded-none border border-gray-200 bg-white shadow-sm md:rounded-xl">
        <div className="relative flex flex-col gap-6 md:flex-row">
          <div className="flex-1 px-6 py-8 sm:px-10 sm:py-10">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {heroSlides[activeSlide].title}
            </h1>
            <p className="mt-3 max-w-xl text-base text-gray-600">
              {heroSlides[activeSlide].subtitle}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="rounded-full bg-[#a435f0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#8710d8]"
              >
                {heroSlides[activeSlide].cta}
              </Link>
            </div>
          </div>

          <div className="relative flex-1">
            <div className="h-full w-full">
              <img
                src={heroSlides[activeSlide].image}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-gray-300 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-gray-300 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* 2. Learn essential career and life skills */}
      <section className="grid gap-8 md:grid-cols-[1.1fr,2fr] md:items-center">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900 transition-colors duration-200 hover:text-[#a435f0]">
            Learn essential career and life skills
          </h2>
          <p className="text-sm text-gray-600">
            Build in-demand capabilities in AI, data, development, cloud, design, business,
            and more—with hands-on courses built for modern careers.
          </p>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-2">
            {essentialCards.map((card) => (
              <div
                key={card.key}
                className="card-hover group min-w-[230px] max-w-xs flex-1 cursor-pointer rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="h-24 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-pink-500/10">
                  {card.image && (
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#a435f0]">
                    {card.title}
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
                    {card.items.slice(0, 5).map((item) => (
                      <li
                        key={item}
                        className="flex items-center justify-between gap-2 rounded-lg px-1 py-1 transition-colors duration-150 group-hover:bg-gray-50"
                      >
                        <span className="line-clamp-1">{item}</span>
                        <span className="text-gray-400 group-hover:text-[#a435f0]">→</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Skills to transform your career + trusted by companies */}
      <section className="space-y-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 transition-colors duration-200 hover:text-[#a435f0]">
              Skills to transform your career and life
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              From AI and cloud to business, freelancing, and design, Learnova gives you
              access to job-ready skills that create real opportunities.
            </p>
          </div>
          <div className="grid gap-4 text-xs text-gray-600 sm:grid-cols-3">
            {transformCards.map((card) => (
              <div
                key={card.key}
                className="card-hover group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="h-24 w-full overflow-hidden bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-pink-500/10">
                  {card.image && (
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#a435f0]">
                    {card.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Trusted by learners worldwide
          </p>
          <div className="company-marquee rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
            <div className="company-marquee-inner gap-8 text-sm font-medium text-indigo-700">
              {[...trustedCompanies, ...trustedCompanies].map((name, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <span key={`${name}-${index}`} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  <span>{name}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Join others transforming their lives through learning
            </h3>
            <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5">
              {[
                {
                  quote:
                    'After completing the AI and data tracks, I landed my first remote role as a junior data analyst.',
                  name: 'Hassan A.',
                  role: 'Junior Data Analyst',
                },
                {
                  quote:
                    'The full stack path gave me the confidence to ship real client projects and start freelancing.',
                  name: 'Sara K.',
                  role: 'Freelance Web Developer',
                },
                {
                  quote:
                    'Learnova made cloud and DevOps finally click. I passed my certification on the first attempt.',
                  name: 'Daniel R.',
                  role: 'Cloud Engineer',
                },
                {
                  quote:
                    'UI/UX and no‑code courses helped me design and launch my startup MVP without a large team.',
                  name: 'Ayesha M.',
                  role: 'Founder, EdTech Startup',
                },
                {
                  quote:
                    'The structured lessons on freelancing and personal branding helped me build a steady global client base.',
                  name: 'Omar L.',
                  role: 'Digital Marketer',
                },
              ].map((review) => (
                <div
                  key={review.name}
                  className="card-hover flex h-full flex-col rounded-2xl border border-transparent bg-gradient-to-br from-indigo-100 via-purple-100 to-emerald-100 p-[1px] text-sm text-gray-700 shadow-sm"
                >
                  <div className="flex h-full flex-col rounded-2xl bg-white/95 p-4 backdrop-blur-sm">
                    <p className="text-2xl leading-none text-indigo-300">“</p>
                    <p className="-mt-3 flex-1 text-xs text-gray-700">{review.quote}</p>
                    <div className="mt-4 text-xs">
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <p className="text-gray-500">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Get certified + Ready to reimagine your career */}
      <section className="space-y-10">
        <div className="rounded-2xl bg-[#1c1d1f] px-6 py-8 text-white md:px-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr,1.5fr] md:items-center">
            <div>
              <h2 className="text-2xl font-bold">Get certified and get ahead in your career</h2>
              <p className="mt-3 text-sm text-gray-200">
                Prep for certifications with comprehensive courses, practice tests, and
                real projects across AI, cloud, data, and more.
              </p>
              <button
                type="button"
                className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#1c1d1f]"
              >
                Explore certifications
              </button>
            </div>
            <div className="grid gap-3 text-xs text-gray-100 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-800 px-4 py-3">
                <p className="font-semibold">AI & Data</p>
                <p className="mt-1">AI, ML, data science, analytics.</p>
              </div>
              <div className="rounded-xl bg-gray-800 px-4 py-3">
                <p className="font-semibold">Cloud & DevOps</p>
                <p className="mt-1">AWS, Azure, CI/CD, Kubernetes.</p>
              </div>
              <div className="rounded-xl bg-gray-800 px-4 py-3">
                <p className="font-semibold">Security & Web3</p>
                <p className="mt-1">Cybersecurity, blockchain, Web3.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to reimagine your career?
          </h2>
          <p className="text-sm text-gray-600">
            Follow curated paths in web development, digital marketing, data, design, cloud,
            and more—built to take you from beginner to job-ready.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {careerTracks.map((track) => (
              <div
                key={track.key}
                className="card-hover flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-sm text-gray-800 shadow-sm"
              >
                <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                  {track.image && (
                    <img
                      src={track.image}
                      alt={track.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-2 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-100">
                      Career path
                    </p>
                    <p className="text-sm font-semibold text-white">{track.title}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-4 text-xs text-gray-600">
                  <p>{track.description}</p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center text-[11px] font-semibold text-[#a435f0] hover:text-[#8710d8]"
                  >
                    View learning path
                    <span className="ml-1 text-[10px]">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trending courses carousel */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Trending courses</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-2">
            {trendingCourseCards.map((course) => (
              <div
                key={course.key}
                className="card-hover group min-w-[260px] max-w-xs flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                  {course.image && (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-2 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                      Trending course
                    </p>
                    <p className="text-sm font-semibold text-white line-clamp-2">
                      {course.title}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <p className="text-[11px] font-medium text-emerald-600">{course.tag}</p>
                  <p className="mt-1 text-xs text-gray-600 line-clamp-3">
                    {course.description}
                  </p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center text-[11px] font-semibold text-[#a435f0] hover:text-[#8710d8]"
                  >
                    View course details
                    <span className="ml-1 text-[10px]">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Grow your team's skills */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Grow your team&apos;s skills and your business
        </h2>
        <p className="text-sm text-gray-600">
          Reach goals faster with AI-powered learning plans, analytics, and enterprise-ready
          content.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {teamCards.map((card) => (
            <div
              key={card.key}
              className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative h-24 w-full overflow-hidden bg-gray-100">
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-2 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-100">
                    For organizations
                  </p>
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <p className="text-xs text-gray-600">{card.subtitle}</p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center text-[11px] font-semibold text-[#a435f0] hover:text-[#8710d8]"
                >
                  Talk to our team
                  <span className="ml-1 text-[10px]">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Global Learning & Skills Trends report */}
      <section className="rounded-2xl border border-gray-200 bg-white px-6 py-8 shadow-sm md:px-10">
        <div className="grid gap-8 md:grid-cols-[1.3fr,1.2fr] md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Get the 2026 Global Learning & Skills Trends Report
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Discover how AI, automation, and new skills are reshaping careers. Learn where
              to invest your time and your team&apos;s learning.
            </p>
            <button
              type="button"
              className="mt-4 rounded-full bg-[#a435f0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8710d8]"
            >
              Download now
            </button>
          </div>
          <div className="relative h-40 overflow-hidden rounded-xl bg-gray-100">
            {globalTrendsImage && (
              <img
                src={globalTrendsImage}
                alt="Global Learning & Skills Trends"
                className="h-full w-full object-cover"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/40 via-indigo-500/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* 8. Popular skills */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Popular skills</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2 text-sm text-gray-700">
            <h3 className="text-sm font-semibold text-gray-900">AI & Data</h3>
            {[
              ...aiAndFutureTech.slice(0, 4),
              ...dataAndAnalytics.slice(0, 3),
              'Python for Data Science',
            ].map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <h3 className="text-sm font-semibold text-gray-900">Development & Cloud</h3>
            {[...developmentCourses.slice(0, 4), ...cloudDevOps.slice(0, 2)].map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <h3 className="text-sm font-semibold text-gray-900">Design, business & careers</h3>
            {[
              ...uiUxCourses.slice(0, 3),
              ...digitalSkills.slice(0, 3),
              ...contentCreation.slice(0, 2),
              ...remoteCareer.slice(0, 2),
            ].map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

