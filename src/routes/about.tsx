import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Heart, Mail, MapPin, MessageCircle, Phone, Send, ShieldCheck, Truck, Users } from "lucide-react";
import { toast } from "sonner";
import { ShoppingShell } from "@/components/shopping-reference";
import { LvBanner, Tile } from "@/components/live-ui";
import { liveHead } from "@/lib/live-head";
import hero from "@/assets/hero.png.asset.json";

export const Route = createFileRoute("/about")({ head: () => liveHead("About & Contact", "About Baby Choice — everything for your little one. Contact us in Dhanmondi, Dhaka."), component: About });

function About() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (!f.name.trim() || !/^\S+@\S+\.\S+$/.test(f.email) || !f.message.trim()) { toast.error("Please enter your name, a valid email and a message"); return; } toast.success("Message sent! We'll reply soon."); setF({ name: "", email: "", message: "" }); };
  return <ShoppingShell crumb="About & Contact" className="lv">
    <h1 className="lv-title">About Baby Choice</h1>
    <LvBanner title="Everything for Your Little One" text="Safe, original baby products from trusted brands — delivered with love across Bangladesh." image={hero.url} tone="wide" />
    <div className="lv-grid4"><Tile icon={<ShieldCheck />} title="Safe Products" /><Tile icon={<Heart />} title="Trusted Brand" /><Tile icon={<Truck />} title="Fast Delivery" /><Tile icon={<Users />} title="Customer First" /></div>
    <h2 className="lv-h2">Contact Information</h2>
    <div className="lv-grid2"><Tile icon={<Phone />} title="Call Us" text="+880 1712 345678" href="tel:+8801712345678" /><Tile icon={<MessageCircle />} title="WhatsApp" text="+880 1712 345678" href="https://wa.me/8801712345678" /><Tile icon={<Mail />} title="Email Us" text="support@babychoice.com" href="mailto:support@babychoice.com" /><Tile icon={<MapPin />} title="Our Address" text="House 25, Road 10, Dhanmondi, Dhaka 1209, Bangladesh" href="https://maps.google.com/?q=Road+10+Dhanmondi+Dhaka" /></div>
    <h2 className="lv-h2">Visit Our Store</h2>
    <div className="lv-card"><iframe title="Baby Choice store map" className="lv-map" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=90.370%2C23.740%2C90.385%2C23.750&layer=mapnik&marker=23.745%2C90.377" /><a className="lv-btn wide" href="https://maps.google.com/?q=Road+10+Dhanmondi+Dhaka" target="_blank" rel="noreferrer"><MapPin />Get Directions</a></div>
    <h2 className="lv-h2">Send Us a Message</h2>
    <form className="lv-card" onSubmit={submit}>
      <span className="lv-label">Your Name</span><label className="lv-input"><input value={f.name} maxLength={80} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Enter your name" aria-label="Your Name" /></label>
      <span className="lv-label">Your Email</span><label className="lv-input"><input type="email" value={f.email} maxLength={120} onChange={e => setF({ ...f, email: e.target.value })} placeholder="Enter your email" aria-label="Your Email" /></label>
      <span className="lv-label">Your Message</span><label className="lv-input area"><textarea rows={4} value={f.message} maxLength={500} onChange={e => setF({ ...f, message: e.target.value })} placeholder="Write your message..." aria-label="Your Message" /></label>
      <button type="submit" className="lv-btn wide"><Send />Send Message</button>
    </form>
  </ShoppingShell>;
}
