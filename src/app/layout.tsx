import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header'; import Footer from '@/components/Footer'; import CookieBanner from '@/components/CookieBanner';
const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://diamond-cleaning.example';
export const metadata: Metadata = { title: 'DIAMOND · Cleaning systems', description: 'Präzise Reinigungslösungen für Alltag und Gewerbe.', metadataBase: new URL(base), openGraph:{title:'DIAMOND',description:'Thorough. Reliable. Clean.',images:['/diamond-logo.svg']}, alternates:{languages:{de:`${base}/de`,en:`${base}/en`}} };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="de"><body><Header/><main>{children}</main><Footer/><CookieBanner/></body></html>}