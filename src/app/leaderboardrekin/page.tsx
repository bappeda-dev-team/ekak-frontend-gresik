'use client'

import { useState, useEffect } from "react";
import { ButtonBlackBorder } from "@/components/global/Button";
import { FiHome } from "react-icons/fi";
import { Table } from "./comp/Table";
import { useBrandingContext } from "@/context/BrandingContext";
import { IsLoadingBranding } from "@/components/global/Loading";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { TbRefresh } from "react-icons/tb";
import { getUser } from "@/components/lib/Cookie";

const ControlPokin = () => {

    const { branding, LoadingBranding } = useBrandingContext();
    const [User, setUser] = useState<any>(null);

    useEffect(() => {
        const get_user = getUser();
        if(get_user){
            setUser(get_user.user);
        }
    }, [])

    if (branding?.tahun?.value === undefined || branding?.tahun?.value === null) {
        return (
            <TahunNull />
        )
    } else if(LoadingBranding) {
        return <IsLoadingBranding />
    } else if(branding?.user === null) {
        return(
            <div className="flex items-center gap-1">
                <h1>Reload Halaman</h1>
                <ButtonBlackBorder>
                    <TbRefresh />
                    Reload
                </ButtonBlackBorder>
            </div>
        )
    } else {
        return (
            <>
                <div className="flex items-center">
                    <a href="/" className="mr-1"><FiHome /></a>
                    <p className="mr-1">/ Laporan</p>
                    <p>/ Control Pokin</p>
                </div>
                <div className="mt-3 rounded-xl shadow-lg border">
                    <div className="flex flex-wrap items-center justify-between border-b px-5 py-5">
                        <h1 className="font-bold text-lg uppercase">Leaderboard Rekin {branding?.tahun?.label}</h1>
                    </div>
                    <div className="flex m-2">
                        <Table tahun={branding?.tahun?.value} user={User}/>
                    </div>
                </div>
            </>
        )
    }

}

export default ControlPokin;