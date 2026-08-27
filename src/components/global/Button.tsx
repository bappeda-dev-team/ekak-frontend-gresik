'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingButtonClip2 } from "./Loading";
import { TbPrinter } from "react-icons/tb";
import { toast } from 'react-toastify';

interface button {
    onClick?: () => void;
    children: React.ReactNode;
    type?: 'reset' | 'submit' | 'button';
    className?: string;
    halaman_url?: string;
    disabled?: boolean;
}
interface ButtonCetak {
    text: string;
    jenis: "opd" | "pemda";
    disabled?: boolean;
    tahun: number;
    kode_opd?: string;
    pokin_id?: number;
}

export const ButtonCetak: React.FC<ButtonCetak> = ({ jenis, disabled, tahun, kode_opd, pokin_id, text }) => {

    const [Loading, setLoading] = useState<boolean>(false);

    const useCetak = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_CETAK;
        const bodyPemda = {
            pokin_id: pokin_id,
        }
        const bodyOpd = {
            kode_opd: kode_opd,
            tahun: tahun,
        }
        const getBody = () => {
            if (jenis === "opd") return bodyOpd;
            if (jenis === "pemda") return bodyPemda;
            return {};
        };
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/pokin/${jenis}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(getBody())
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error("Generate PDF gagal");
            }

            const pdfUrl = result.data.startsWith("http")
                ? result.data
                : `${API_URL}${result.data}`;

            window.open(pdfUrl, "_blank", "noopener,noreferrer");

        } catch (err) {
            toast.error("❌ Gagal membuat dokumen. Silakan coba beberapa saat lagi.")
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            className={`px-3 flex gap-1 justify-center items-center py-1 bg-gradient-to-r border-2 border-[#60241E] hover:bg-[#60241E] text-[#60241E] hover:text-white rounded-lg`}
            disabled={disabled || Loading}
            type="button"
            onClick={useCetak}
        >
            {Loading ? (
                <>
                    <LoadingButtonClip2 />
                    Menyiapkan...
                </>
            ) : (
                <>
                    <TbPrinter />
                    {text ?? "Cetak"}
                </>
            )}
        </button>
    )
}

export const ButtonSky: React.FC<button> = ({ children, type, className, halaman_url, onClick, disabled }) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if (halaman_url) {
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return (
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r from-[#08C2FF] to-[#006BFF] hover:from-[#0584AD] hover:to-[#014CB2] text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ?
                (
                    <>
                        <LoadingButtonClip2 />
                        {children}
                    </>
                )
                :
                (children)
            }
        </button>
    )
}
export const ButtonSkyBorder: React.FC<button> = ({ children, type, className, halaman_url, onClick, disabled }) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if (halaman_url) {
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return (
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#3072D6] hover:bg-[#3072D6] text-[#3072D6] hover:text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ?
                (
                    <>
                        <LoadingButtonClip2 />
                        {children}
                    </>
                )
                :
                (children)
            }
        </button>
    )
}
export const ButtonGreen: React.FC<button> = ({ children, type, className, halaman_url, onClick, disabled }) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if (halaman_url) {
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return (
        <button
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r from-[#1CE978] to-[#11B935] hover:from-[#1EB281] hover:to-[#0D7E5C] text-white rounded-lg ${className}`}
        >
            {Loading ?
                (
                    <>
                        <LoadingButtonClip2 />
                        {children}
                    </>
                )
                :
                (children)
            }
        </button>
    )
}
export const ButtonBlack: React.FC<button> = ({ children, type, className, halaman_url, onClick, disabled }) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if (halaman_url) {
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return (
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r from-[#1C201A] to-[#434848] hover:from-[#3A4238] hover:to-[#676C6F] text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ?
                (
                    <>
                        <LoadingButtonClip2 />
                        {children}
                    </>
                )
                :
                (children)
            }
        </button>
    )
}
export const ButtonGreenBorder: React.FC<button> = ({ children, type, className, halaman_url, onClick, disabled }) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if (halaman_url) {
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return (
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#00A607] hover:bg-[#00A607] text-[#00A607] hover:text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ?
                (
                    <>
                        <LoadingButtonClip2 />
                        {children}
                    </>
                )
                :
                (children)
            }
        </button>
    )
}
export const ButtonBlackBorder: React.FC<button> = ({ children, type, className, halaman_url, onClick, disabled }) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if (halaman_url) {
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return (
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#1C201A] hover:bg-[#1C201A] text-[#1C201A] hover:text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ?
                (
                    <>
                        <LoadingButtonClip2 />
                        {children}
                    </>
                )
                :
                (children)
            }
        </button>
    )
}
export const ButtonRed: React.FC<button> = ({ children, type, className, halaman_url, onClick, disabled }) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if (halaman_url) {
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return (
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r from-[#DA415B] to-[#BC163C] hover:from-[#B7384D] hover:to-[#951230] text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ?
                (
                    <>
                        <LoadingButtonClip2 />
                        {children}
                    </>
                )
                :
                (children)
            }
        </button>
    )
}
export const ButtonRedBorder: React.FC<button> = ({ children, type, className, halaman_url, onClick, disabled }) => {

    const router = useRouter();
    const [Loading, setLoading] = useState<boolean>(false);
    const pindahHalaman = async () => {
        if (halaman_url) {
            setLoading(true);
            router.push(halaman_url);
        }
    }

    return (
        <button
            className={`px-3 flex justify-center items-center py-1 bg-gradient-to-r border-2 border-[#D20606] text-[#D20606] hover:bg-[#D20606] hover:text-white rounded-lg ${className}`}
            disabled={disabled || Loading}
            type={type}
            onClick={onClick || pindahHalaman}
        >
            {Loading ?
                (
                    <>
                        <LoadingButtonClip2 />
                        {children}
                    </>
                )
                :
                (children)
            }
        </button>
    )
}