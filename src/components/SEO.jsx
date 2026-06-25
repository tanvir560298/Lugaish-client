import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://lugaish.vercel.app').replace(/\/$/, '');

const DEFAULT_SEO = {
  title: 'Lugaish | AI-Powered Arabic & English Learning Platform',
  description: 'Learn English and Arabic with AI-powered language learning, daily lessons, guided practice, progress tracking, and weekly interview preparation.',
  keywords: 'AI-powered language learning, AI English learning, AI Arabic learning, learn English, learn Arabic, English speaking course, Arabic course, Lugaish',
  image: `${SITE_URL}/og-image.svg`,
};

const ROUTE_SEO = {
  '/': DEFAULT_SEO,
  '/signup': {
    title: 'Sign Up for Lugaish | Start AI-Powered English and Arabic Learning',
    description: 'Create your Lugaish account with Google and start AI-assisted daily English or Arabic lessons.',
    keywords: 'Lugaish signup, AI English learning signup, AI Arabic learning signup',
  },
  '/login': {
    title: 'Sign In to Lugaish | Continue Your Language Lessons',
    description: 'Sign in to Lugaish and continue your AI-assisted English or Arabic learning progress.',
    keywords: 'Lugaish login, AI language learning login',
  },
  '/pricing': {
    title: 'Lugaish Plans | AI-Powered English and Arabic Learning Courses',
    description: 'Explore Lugaish course plans for AI-assisted English speaking and Arabic fluency practice.',
    keywords: 'AI English course plans, AI Arabic course plans, language learning pricing',
  },
  '/architects': {
    title: 'Lugaish Architects | Language Learning Team',
    description: 'Meet the team shaping Lugaish lessons, learning journeys, and language practice experiences.',
    keywords: 'Lugaish team, language learning team',
  },
};

function setMeta(name, content, attribute = 'name') {
  if (!content) return;

  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function setLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

function setStructuredData(data) {
  const id = 'lugaish-structured-data';
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement('script');
    element.id = id;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

function getSeoForPath(pathname) {
  if (pathname.startsWith('/course/english')) {
    return {
      title: 'AI English Speaking Course | Lugaish',
      description: 'Build English speaking confidence with AI-guided practice, daily lessons, interview preparation, and progress tracking on Lugaish.',
      keywords: 'AI English learning, English speaking course, learn English online, daily English lessons',
    };
  }

  if (pathname.startsWith('/course/arabic')) {
    return {
      title: 'AI Arabic Learning Course | Lugaish',
      description: 'Learn Arabic through AI-assisted practice, focused daily lessons, pronunciation support, and structured progress on Lugaish.',
      keywords: 'AI Arabic learning, Arabic course, learn Arabic online, daily Arabic lessons',
    };
  }

  return ROUTE_SEO[pathname] ?? DEFAULT_SEO;
}

export function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = { ...DEFAULT_SEO, ...getSeoForPath(pathname) };
    const canonicalPath = pathname === '/' ? '' : pathname;
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;

    document.title = seo.title;
    setMeta('description', seo.description);
    setMeta('keywords', seo.keywords);
    setMeta('robots', 'index, follow');
    setMeta('theme-color', '#020617');
    setLink('canonical', canonicalUrl);

    setMeta('og:type', 'website', 'property');
    setMeta('og:site_name', 'Lugaish', 'property');
    setMeta('og:title', seo.title, 'property');
    setMeta('og:description', seo.description, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:image', seo.image, 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', seo.title);
    setMeta('twitter:description', seo.description);
    setMeta('twitter:image', seo.image);

    setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Lugaish',
      url: SITE_URL,
      description: DEFAULT_SEO.description,
      sameAs: [],
      offers: {
        '@type': 'Offer',
        category: 'Language learning',
        availability: 'https://schema.org/InStock',
      },
      teaches: ['AI-assisted English speaking', 'AI-assisted Arabic language'],
    });
  }, [pathname]);

  return null;
}
