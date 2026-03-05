import { Link } from 'react-router-dom'
import logo from '../assets/learnova-logo.png'

const footerSections = [
  {
    heading: 'In-demand careers',
    links: [
      'AI & Future Tech',
      'Data Scientist',
      'Full Stack Web Developer',
      'Cloud Engineer',
      'Project Manager',
      'Game Developer',
      'UI/UX Designer',
    ],
  },
  {
    heading: 'AI & Future Tech',
    links: [
      'Artificial Intelligence (AI) Fundamentals',
      'Generative AI & Prompt Engineering',
      'Machine Learning',
      'Deep Learning & Neural Networks',
      'Computer Vision',
      'NLP & LLM Development',
    ],
  },
  {
    heading: 'Data & Analytics',
    links: [
      'Data Science Complete Course',
      'Data Analysis (Excel, Power BI, Tableau)',
      'Python for Data Science',
      'SQL & Database Management',
      'Data Engineering Basics',
    ],
  },
  {
    heading: 'Development',
    links: [
      'Full Stack Web Development (MERN)',
      'Frontend (HTML, CSS, JS, React)',
      'Backend (Node.js / Django / Laravel)',
      'Mobile Apps (Flutter / React Native)',
      'WordPress & Shopify Development',
    ],
  },
  {
    heading: 'Cloud, DevOps & Security',
    links: [
      'AWS Cloud Practitioner',
      'Azure Fundamentals',
      'DevOps (CI/CD, Docker, Kubernetes)',
      'Ethical Hacking',
      'Cybersecurity Fundamentals',
      'Network Security & Pentesting',
    ],
  },
  {
    heading: 'Digital skills & freelancing',
    links: [
      'Digital Marketing (SEO, Social, Ads)',
      'Amazon VA & Product Hunting',
      'Shopify Dropshipping',
      'Freelancing (Upwork, Fiverr)',
      'Graphic Design & Video Editing',
    ],
  },
  {
    heading: 'Business & productivity',
    links: [
      'MS Office & Advanced Excel',
      'Business Communication',
      'Startup & Online Business',
      'Automation & No‑Code Tools',
    ],
  },
  {
    heading: 'Blockchain, Web3 & games',
    links: [
      'Blockchain Fundamentals',
      'Crypto & Trading Basics',
      'Smart Contracts (Solidity)',
      'Web3 Development',
      'Unity & Unreal Game Dev',
    ],
  },
]

const Footer = () => {
  return (
    <footer className="bg-[#1c1d1f] text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-sm font-semibold text-white">
          Explore top skills and certifications
        </h2>

        <div className="mt-6 grid gap-8 md:grid-cols-3 lg:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.heading}>
              <h3 className="text-sm font-semibold text-white">{section.heading}</h3>
              <ul className="mt-3 space-y-1.5">
                {section.links.map((label) => (
                  <li key={label}>
                    <Link
                      to="/courses"
                      className="text-sm text-gray-400 transition hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 border-t border-gray-700 pt-8 md:grid-cols-4">
          <div className="space-y-2 text-sm text-gray-400">
            <h3 className="text-sm font-semibold text-white">About Learnova</h3>
            <Link to="/" className="block hover:text-white">
              About
            </Link>
            <Link to="/" className="block hover:text-white">
              Contact us
            </Link>
            <Link to="/" className="block hover:text-white">
              Blog
            </Link>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <h3 className="text-sm font-semibold text-white">Discover</h3>
            <Link to="/courses" className="block hover:text-white">
              All courses
            </Link>
            <Link to="/courses" className="block hover:text-white">
              Career paths
            </Link>
            <Link to="/courses" className="block hover:text-white">
              Certificates
            </Link>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <h3 className="text-sm font-semibold text-white">For teams</h3>
            <Link to="/courses" className="block hover:text-white">
              Learnova for Business
            </Link>
            <Link to="/courses" className="block hover:text-white">
              Request a demo
            </Link>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <h3 className="text-sm font-semibold text-white">Legal & accessibility</h3>
            <Link to="/" className="block hover:text-white">
              Terms
            </Link>
            <Link to="/" className="block hover:text-white">
              Privacy policy
            </Link>
            <Link to="/" className="block hover:text-white">
              Cookie settings
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-6 text-sm text-gray-400 sm:flex-row">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Learnova" className="h-7 w-7" />
            <span>© {new Date().getFullYear()} Learnova, Inc.</span>
          </div>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white">
              Sitemap
            </Link>
            <Link to="/" className="hover:text-white">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
