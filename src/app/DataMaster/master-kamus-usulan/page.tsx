'use client'

import { FiHome } from "react-icons/fi";
import { TbCirclePlus } from "react-icons/tb";
import { ButtonSky } from "@/components/global/Button";
import Table from "./comp/Table";

const MasterKamusUsulan = () => {
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

export default MasterKamusUsulan;