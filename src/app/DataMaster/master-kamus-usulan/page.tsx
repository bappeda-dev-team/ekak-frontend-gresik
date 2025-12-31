'use client'

import { FiHome } from "react-icons/fi";
import { useBrandingContext } from "@/context/BrandingContext";
import Table from "./comp/Table";
import { IsLoadingBranding } from "@/components/global/Loading";
import { TahunNull } from "@/components/global/OpdTahunNull";

const MasterKamusUsulan = () => {

    const {LoadingBranding, branding} = useBrandingContext();
    
    if(LoadingBranding){
        return <IsLoadingBranding />
    } else {
        if(branding?.tahun?.value === undefined || branding?.tahun?.value === null){
            return <TahunNull />
        } else {
            return (
                <>
                    <div className="flex items-center">
                        <a href="/" className="mr-1"><FiHome /></a>
                        <p className="mr-1">/ Data Master</p>
                        <p className="mr-1">/ Master Kamus Usulan</p>
                    </div>
                    <Table />
                </>
            )
        }
    }
}

export default MasterKamusUsulan;