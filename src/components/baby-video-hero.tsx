import { useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import video from '@/assets/home/baby-hero.mp4.asset.json';
import webm from '@/assets/home/baby-hero.webm.asset.json';
import poster from '@/assets/home/baby-hero-poster.jpg.asset.json';
import '@/styles/baby-video-hero.css';

export function BabyVideoHero() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const resume = () => { if (!document.hidden) { element.muted = true; void element.play().catch(() => {}); } };
    resume();
    document.addEventListener('visibilitychange', resume);
    return () => document.removeEventListener('visibilitychange', resume);
  }, []);
  return <div className="bvh" aria-label="Everything for your little one">
    <video ref={ref} className="bvh-video" poster={poster.url} autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-hidden="true"><source src={webm.url} type="video/webm"/><source src={video.url} type="video/mp4"/></video>
    <div className="bvh-copy">
      <span className="bvh-tag">PLAY • LEARN • GROW</span>
      <p className="bvh-title"><span>Everything</span><span>for your</span><span className="bvh-pink">little one</span></p>
      <svg className="bvh-heart" viewBox="0 0 80 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" aria-hidden="true"><path d="M29 52 10 30C-1 13 20 4 26 24 35 2 55 16 45 29Z M54 9l7-8 M62 23l11-4 M63 37l10 5"/></svg>
      <p className="bvh-description">Premium baby products for<br/>a happier, healthier tomorrow</p>
      <Button asChild variant="ghost" className="bvh-shop"><Link to="/categories">Shop Now <ArrowRight aria-hidden="true"/></Link></Button>
      <svg className="bvh-rays" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" aria-hidden="true"><path d="M10 30 15 6 M35 39 50 19 M51 57 72 50"/></svg>
      <div className="bvh-badge"><span>Up to</span><b>30%</b><span>OFF</span></div>
    </div>
  </div>;
}