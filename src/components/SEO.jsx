import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { upcomingCourses } from '../data/upcomingCourses.js';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://lugaish.vercel.app').replace(/\/$/, '');

const DEFAULT_SEO = {
  title: 'Lugaish | Learn Web Development. Build Your Next Chapter.',
  description: 'Learn web development in Bangla with free HTML video lessons. Build your first website and explore upcoming C programming, Arabic, video editing and English courses.',
  keywords: 'web development Bangla, HTML course, free web development course, learn HTML, Lugaish',
  image: `${SITE_URL}/og-image.svg`,
};

const ROUTE_SEO = {
  '/': DEFAULT_SEO,
  '/study-room': {
    title: 'Study Room | Lugaish',
    description: 'Your free personal study desk with a focus timer, private notebook, PDF reader and study checklist. No course enrollment needed.',
  },
  '/classroom': {
    title: 'Classroom | Lugaish',
    description: 'Watch free lessons or bring your own YouTube learning video. Take notes and make time to learn, without course enrollment.',
  },
  '/learn': {
    title: 'Courses | Lugaish',
    description: 'Start our free Web Development course in Bangla and preview four upcoming courses.',
  },
  '/learn/web-development/html': {
    title: 'Web Development — HTML in Bangla | Lugaish',
    description: 'Seven beginner HTML video lessons in Bangla, from your first tag to a portfolio website.',
  },
  '/signup': {
    title: 'Join Lugaish | Your Learning Campus',
    description: 'Create your Lugaish account with Google for your learning profile and study tools.',
    keywords: 'Lugaish signup, AI English learning signup, AI Arabic learning signup',
  },
  '/login': {
    title: 'Sign In to Lugaish | Your Learning Campus',
    description: 'Sign in to Lugaish and return to your learning profile, study plans and campus.',
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
  if (pathname.startsWith('/upcoming/')) {
    const course = upcomingCourses.find(item => pathname === `/upcoming/${item.id}`);
    if (course) return { title: `${course.title} — Coming Soon | Lugaish`, description: course.description };
  }
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
      founder: {
        '@type': 'Person',
        name: 'Tanvir Ahmad',
        jobTitle: 'Web Developer',
      },
      author: {
        '@type': 'Person',
        name: 'Tanvir Ahmad',
      },
      sameAs: [],
      offers: {
        '@type': 'Offer',
        category: 'Web development',
        availability: 'https://schema.org/InStock',
      },
      teaches: ['Web development', 'HTML'],
    });
  }, [pathname]);

  return null;
}
