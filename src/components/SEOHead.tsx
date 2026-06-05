import { useEffect } from 'react';

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string[];
  faqItems?: Array<{ q: string; a: string }>;
  price?: number;
  breadcrumbs?: BreadcrumbItem[];
}

export const SEOHead = ({
  title,
  description,
  canonical,
  ogImage = "https://diamondjewels.com/og-image.jpg",
  ogType = "website",
  keywords = [],
  faqItems = [],
  price,
  breadcrumbs = [],
}: SEOHeadProps) => {
  useEffect(() => {
    // ── Title (use exactly as provided — no extra suffix) ────────
    document.title = title;

    // ── Meta tag helper ──────────────────────────────────────────
    const updateMeta = (name: string, content: string, isProperty = false) => {
      let el = document.querySelector(
        `meta[${isProperty ? 'property' : 'name'}="${name}"]`
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(isProperty ? 'property' : 'name', name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // ── Core meta ────────────────────────────────────────────────
    updateMeta('description', description);
    if (keywords.length) updateMeta('keywords', keywords.join(', '));
    updateMeta('theme-color', '#D49B17');
    updateMeta('robots', 'index,follow,max-image-preview:large');
    updateMeta('referrer', 'strict-origin-when-cross-origin');

    // ── Open Graph ───────────────────────────────────────────────
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:image:width', '1200', true);
    updateMeta('og:image:height', '630', true);
    updateMeta('og:type', ogType, true);
    updateMeta('og:url', window.location.href, true);
    updateMeta('og:site_name', 'Diamond Jewels', true);
    updateMeta('og:locale', 'en_GB', true);

    // ── Twitter Card ─────────────────────────────────────────────
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', ogImage);
    updateMeta('twitter:site', '@diamondjewels');

    // ── Canonical ────────────────────────────────────────────────
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // ── Structured Data Graph ────────────────────────────────────
    const graph: Record<string, unknown>[] = [];

    // 1. WebSite schema — enables Google Sitelinks Search Box
    graph.push({
      "@type": "WebSite",
      "@id": "https://diamondjewels.com/#website",
      "name": "Diamond Jewels",
      "url": "https://diamondjewels.com",
      "description": "Premium fine jewellery and certified diamonds",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://diamondjewels.com/?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    });

    // 2. LocalBusiness / JewelryStore schema
    graph.push({
      "@type": ["Organization", "LocalBusiness", "JewelryStore"],
      "@id": "https://diamondjewels.com/#organization",
      "name": "Diamond Jewels",
      "url": "https://diamondjewels.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://diamondjewels.com/logo.png",
        "width": 512,
        "height": 512
      },
      "image": "https://diamondjewels.com/og-image.jpg",
      "description": "Premium fine jewellery and certified diamonds – engagement rings, wedding bands, necklaces and bespoke designs.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Luxury Avenue, Jewel District",
        "addressLocality": "London",
        "postalCode": "W1A 1AA",
        "addressCountry": "GB"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 51.5074,
        "longitude": -0.1278
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "contact@diamondjewels.com",
        "availableLanguage": ["English"]
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "10:00",
          "closes": "20:00"
        }
      ],
      "priceRange": "£££",
      "sameAs": [
        "https://www.instagram.com/diamondjewels",
        "https://www.facebook.com/diamondjewels",
        "https://twitter.com/diamondjewels"
      ]
    });

    // 3. BreadcrumbList — improves sitelinks and click-through rates
    if (breadcrumbs.length > 0) {
      graph.push({
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://diamondjewels.com/"
          },
          ...breadcrumbs.map((crumb, idx) => ({
            "@type": "ListItem",
            "position": idx + 2,
            "name": crumb.name,
            "item": crumb.item
          }))
        ]
      });
    }

    // 4. FAQPage — enables rich accordion snippets in SERPs
    if (faqItems.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      });
    }

    // 5. Product — enables Google Shopping & product rich results
    if (ogType === "product") {
      const productName = title.replace(/ \| Diamond Jewels$/i, '').trim();
      graph.push({
        "@type": "Product",
        "name": productName,
        "description": description,
        "image": ogImage,
        "brand": {
          "@type": "Brand",
          "name": "Diamond Jewels"
        },
        "offers": {
          "@type": "Offer",
          "url": window.location.href,
          "priceCurrency": "INR",
          "price": price ? price.toString() : "18000",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Diamond Jewels"
          }
        }
      });
    }

    // ── Inject / update the single LD+JSON script tag ────────────
    let scriptTag = document.querySelector(
      'script[data-schema="ld-json"]'
    ) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.setAttribute('data-schema', 'ld-json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph
    });

  }, [title, description, keywords, canonical, ogImage, ogType, faqItems, price, breadcrumbs]);

  return null;
};
