import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Heart, LockKeyhole, Package, Tag, UserRound, Zap } from "lucide-react";
import { toast } from "sonner";
import { ShoppingShell } from "@/components/shopping-reference";
import { Tile } from "@/components/live-ui";
import { liveHead } from "@/lib/live-head";

export const Route = createFileRoute("/login")({ head: () => liveHead("Login", "Log in to Baby Choice to save your wishlist, check out faster and track orders."), component: Login });

function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState(""); const [pw, setPw] = useState(""); const [show, setShow] = useState(false); const [keep, setKeep] = useState(true);
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (!id.trim() || !pw) { toast.error("Please enter your phone/email and password"); return; } toast.success("Welcome back!"); navigate({ to: "/account" }); };
  return <ShoppingShell crumb="Login" className="lv" active="Account">
    <h1 className="lv-title">Welcome Back!</h1><p className="lv-sub">Login to continue shopping for your little one.</p>
    <form className="lv-card" onSubmit={submit}>
      <span className="lv-label">Phone Number or Email</span><label className="lv-input"><UserRound /><input value={id} onChange={e => setId(e.target.value)} placeholder="Enter phone number or email" aria-label="Phone Number or Email" /></label>
      <span className="lv-label">Password</span><label className="lv-input"><LockKeyhole /><input type={show ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter password" aria-label="Password" /><button type="button" className="lv-plain" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(v => !v)}>{show ? <EyeOff /> : <Eye />}</button></label>
      <div className="lv-row"><label className="lv-check"><input type="checkbox" checked={keep} onChange={e => setKeep(e.target.checked)} />Keep me logged in</label><button type="button" className="lv-link" onClick={() => toast("Password reset link will be sent to your phone/email.")}>Forgot Password?</button></div>
      <button type="submit" className="lv-btn wide">Login<ArrowRight /></button>
      <p className="lv-or">Or login with</p>
      <div className="lv-grid3">{["Google", "Facebook", "Apple"].map(n => <button type="button" key={n} className="lv-btn ghost" onClick={() => { toast.success(`Logged in with ${n}`); navigate({ to: "/account" }); }}>{n}</button>)}</div>
      <p className="lv-or">New to Baby Choice? <button type="button" className="lv-link" onClick={() => { toast.success("Account created"); navigate({ to: "/account" }); }}>Create Account →</button></p>
    </form>
    <div className="lv-grid4"><Tile icon={<Heart />} title="Save Your Wishlist" to="/wishlist" /><Tile icon={<Zap />} title="Quick Checkout" to="/checkout" /><Tile icon={<Package />} title="Track Your Orders" to="/order-confirmed" /><Tile icon={<Tag />} title="Exclusive Offers" to="/offers" /></div>
  </ShoppingShell>;
}
