'use client'; import {useState} from 'react';
export default function ProductDetailActions(){const[added,setAdded]=useState(false);return <button onClick={()=>setAdded(true)} className="mt-5 w-full bg-diamond py-4 text-sm font-bold text-white hover:bg-blue-900">{added?'Hinzugefügt':'In Anfragekorb'}</button>;}
