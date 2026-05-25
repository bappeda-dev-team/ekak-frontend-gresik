'use client'

import { ButtonRed } from "@/components/global/Button";
import { TbX, TbPrinter } from "react-icons/tb";
import { PDFViewer } from "@react-pdf/renderer";
import { Pokin } from "../type";
import DocumentLeaderboardRekin from "./Document-Leaderboard-Rekin";

interface Modal {
    isOpen: boolean;
    onClose: () => void;
    Data: Pokin[];
    tahun: number;
}

const ModalCetakLeaderboardRekin: React.FC<Modal> = ({ isOpen, onClose, Data, tahun }) => {

    if (!isOpen) {
        return null;
    } else {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={onClose}></div>
                <div className={`bg-white rounded-lg z-10 w-[70%] min-h-[98%] max-h-[98%] text-start overflow-y-hidden`}>
                    <div className="flex items-center justify-between gap-1 bg-orange-700 p-3">
                        <h1 className="flex items-center gap-1 uppercase text-center font-bold text-white">
                            <TbPrinter />
                            Cetak Leaderboard Rekin
                        </h1>
                        <div className="flex items-center gap-1 border border-white rounded-lg">
                            <ButtonRed onClick={onClose}>
                                <TbX />
                            </ButtonRed>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '100vh' }}>
                        <PDFViewer width="100%" height="100%">
                            <DocumentLeaderboardRekin 
                                Data={Data}
                                tahun={tahun}
                            />
                        </PDFViewer>
                    </div>
                </div>
            </div>
        )
    }
}

export default ModalCetakLeaderboardRekin;