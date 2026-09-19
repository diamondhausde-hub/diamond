import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header'; import Footer from '@/components/Footer'; import CookieBanner from '@/components/CookieBanner';
export const metadata: Metadata = { title: 'DIAMOND · Cleaning systems', description: 'Präzise Reinigungslösungen für Alltag und Gewerbe.', metadataBase: new URL('https://diamond-cleaning.example'), openGraph:{title:'DIAMOND',description:'Thorough. Reliable. Clean.',images:['/diamond-logo.svg']}, alternates:{languages:{de:'https://diamond-cleaning.example/de',en:'https://diamond-cleaning.example/en'}} };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="de"><body><Header/><main>{children}</main><Footer/><CookieBanner/></body></html>}
