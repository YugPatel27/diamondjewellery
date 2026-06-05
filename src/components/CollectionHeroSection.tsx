import { Link } from "react-router-dom";
import { ArrowRight } from "@/components/Icons";

interface HeroMetric {
  label: string;
  value: string;
}

interface CollectionHeroSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: React.ReactNode;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  metrics?: HeroMetric[];
}

const CollectionHeroSection = ({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  icon,
  primaryCta,
  secondaryCta,
  metrics = [],
}: CollectionHeroSectionProps) => {
  return (
    <section className="px-4 pb-8 pt-5 sm:px-6 sm:pb-10 sm:pt-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] relative group h-[60vh] sm:h-[70vh]">
        {/* Background Image with Cinematic Zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-&lsqb;10000ms&rsqb; ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="shine-sweep-loop opacity-10"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center px-8 sm:px-16 lg:px-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-4 text-accent">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10 backdrop-blur-md shadow-[0_0_20px_rgba(212,155,23,0.3)]">
                {icon}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/90">{eyebrow}</span>
            </div>

            <h1 className="font-heading text-4xl font-light tracking-tight text-white sm:text-5xl xl:text-7xl mb-6 leading-tight">
              {title}
            </h1>
            
            <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8 mb-10 font-light">
              {description}
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to={primaryCta.href} className="btn-gold !bg-accent !text-white hover:!bg-accent/90 border-none px-8 py-3">
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {secondaryCta ? (
                <Link to={secondaryCta.href} className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/60 px-8 py-3 backdrop-blur-sm">
                  {secondaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>

            {metrics.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 max-w-lg">
                {metrics.map((metric) => (
                  <div
                    key={`${metric.label}-${metric.value}`}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-4 shadow-xl"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/80">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-sm font-bold text-white sm:text-base">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>

  );
};

export default CollectionHeroSection;
