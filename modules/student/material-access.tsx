"use client";
import { useEffect } from "react";
import { recordMaterialAccess } from "./material-access-action";
export function MaterialAccess({id}:{id:number}){useEffect(()=>{void recordMaterialAccess(id);},[id]);return <p className="muted">Pembukaan halaman materi ini dicatat sebagai aktivitas belajar.</p>;}
