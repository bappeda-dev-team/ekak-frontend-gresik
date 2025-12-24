'use client'

import { FiHome } from "react-icons/fi";
import { useBrandingContext } from "@/context/BrandingContext";
import Table from "./comp/Table";
import { IsLoadingBranding } from "@/components/global/Loading";

const LaporanPokir = () => {

    const {LoadingBranding, branding} = useBrandingContext();
    
    if(LoadingBranding){
        return <IsLoadingBranding />
    } else {
        return(
            <>
                <div className="flex items-center">
                    <a href="/" className="mr-1"><FiHome /></a>
                    <p className="mr-1">/ Laporan</p>
                    <p className="mr-1">/ Laporan Pokir</p>
                </div>
                <div className="mt-3 rounded-xl shadow-lg border">
                    <div className="flex items-center justify-between border-b px-5 py-5">
                        <div className="flex flex-col items-end">
                            <h1 className="uppercase font-bold">Laporan Pokir</h1>
                        </div>
                    </div>
                    <Table />
                </div>
            </>
        )
    }
}

export default LaporanPokir;