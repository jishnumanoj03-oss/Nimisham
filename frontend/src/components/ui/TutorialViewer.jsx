import { useState, useEffect } from 'react';
import { Share2, Bookmark, Clock, Eye } from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';
import DifficultyBadge from './DifficultyBadge';

const TutorialViewer = ({ tutorial }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  // Scroll progress and TOC tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(scroll);

      // Simple intersection observer alternative for TOC highlighting
      const sections = tutorial.sections?.map(s => document.getElementById(`section-${s.order}`)) || [];
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.getBoundingClientRect().top <= 100) {
          setActiveSection(`section-${tutorial.sections[i].order}`);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tutorial.sections]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-bg-elevated z-50">
        <div 
          className="h-full bg-accent transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col lg:flex-row gap-12 items-start relative">
        {/* Main Content Area */}
        <article className="flex-1 w-full lg:max-w-[800px]">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-sm font-medium text-accent uppercase tracking-wider">{tutorial.category}</span>
              <span className="text-text-muted">•</span>
              <DifficultyBadge level={tutorial.difficultyLevel} />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-text-primary leading-tight mb-6">
              {tutorial.title}
            </h1>
            
            {tutorial.subtitle && (
              <p className="text-xl md:text-2xl text-text-secondary font-light mb-8">
                {tutorial.subtitle}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-border">
              <div className="flex items-center gap-4">
                <Avatar src={tutorial.creator?.avatar} alt={tutorial.creator?.name} size="md" />
                <div>
                  <div className="text-text-primary font-medium">{tutorial.creator?.name}</div>
                  <div className="text-text-muted text-sm flex items-center gap-3">
                    <span>{new Date(tutorial.publishedAt || tutorial.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center"><Clock size={14} className="mr-1 inline" /> {tutorial.estimatedReadTime} min read</span>
                    <span className="flex items-center"><Eye size={14} className="mr-1 inline" /> {tutorial.views} views</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" icon={Share2}>Share</Button>
                <Button variant="outline" size="sm" icon={Bookmark}>Save</Button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {tutorial.featuredImage?.url && (
            <figure className="mb-12">
              <img 
                src={tutorial.featuredImage.url} 
                alt={tutorial.title}
                className="w-full rounded-2xl object-cover shadow-lg"
              />
            </figure>
          )}

          {/* Sections */}
          <div className="prose prose-invert prose-lg max-w-none text-text-secondary">
            {/* Note: In a real app, use a proper Markdown/HTML parser like react-markdown or html-react-parser with DOMpurify */}
            {tutorial.sections?.map((section) => (
              <section key={section._id} id={`section-${section.order}`} className="mb-12 scroll-mt-24">
                <h2 className="text-3xl font-serif text-text-primary mb-6">{section.title}</h2>
                <div 
                  className="whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }} 
                />
              </section>
            ))}
          </div>

          {/* Tags & Resources Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2 mb-8">
              {tutorial.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-bg-elevated border border-border rounded-md text-sm text-text-secondary">
                  #{tag}
                </span>
              ))}
            </div>
            {/* Author Bio Box */}
            <div className="bg-bg-elevated p-6 rounded-xl border border-border flex flex-col sm:flex-row gap-6 items-start">
              <Avatar src={tutorial.creator?.avatar} size="lg" className="w-20 h-20" />
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-2">Written by {tutorial.creator?.name}</h3>
                <p className="text-text-muted mb-4">{tutorial.creator?.bio || 'Creative enthusiast sharing knowledge on Nimisham.'}</p>
                <Button variant="outline" size="sm">View Profile</Button>
              </div>
            </div>
          </footer>
        </article>

        {/* Sidebar (TOC) */}
        <aside className="hidden lg:block w-[300px] shrink-0 sticky top-24 self-start">
          <div className="bg-bg-elevated/50 backdrop-blur border border-border p-6 rounded-xl">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Table of Contents</h4>
            <nav className="space-y-3">
              {tutorial.sections?.map(section => (
                <a 
                  key={section.order}
                  href={`#section-${section.order}`}
                  onClick={(e) => scrollToSection(e, `section-${section.order}`)}
                  className={`block text-sm transition-colors ${
                    activeSection === `section-${section.order}` 
                      ? 'text-accent font-medium' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TutorialViewer;
