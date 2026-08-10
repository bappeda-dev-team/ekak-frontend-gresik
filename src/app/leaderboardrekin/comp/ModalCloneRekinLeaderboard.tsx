'use client'

import React, { useState } from "react";
import { TbDeviceFloppy, TbX, TbLayersSelected } from "react-icons/tb";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import Select from 'react-select';
import { OptionTypeString } from "@/types";
import { useBrandingContext } from "@/context/BrandingContext";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    username: string;
}

interface FormValue {
    kode_opd: string;
    tahun_sumber: string;
    tahun_tujuan: OptionTypeString | null;
    updated_by: string; // username user yg login
}

export const ModalCLoneRekinLeaderboard: React.FC<modal> = ({ isOpen, onClose, kode_opd, nama_opd, tahun, username }) => {

    const [Proses, setProses] = useState<boolean>(false);
    const { branding } = useBrandingContext();
    const token = getToken();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            kode_opd: kode_opd || "",
            tahun_sumber: tahun || "",
            tahun_tujuan: null,
            updated_by: '',
        }
    });

    const handleClose = () => {
        onClose();
        reset();
    }

    const tahunOption = [
        { label: "2019", value: "2019" },
        { label: "2020", value: "2020" },
        { label: "2021", value: "2021" },
        { label: "2022", value: "2022" },
        { label: "2023", value: "2023" },
        { label: "2024", value: "2024" },
        { label: "2025", value: "2025" },
        { label: "2026", value: "2026" },
        { label: "2027", value: "2027" },
        { label: "2028", value: "2028" },
        { label: "2029", value: "2029" },
        { label: "2030", value: "2030" },
    ];

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const payload = {
            //key : value
            kode_opd: kode_opd,
            tahun_sumber: tahun,
            tahun_tujuan: data?.tahun_tujuan?.value,
            updated_by: username,
        };
        if (tahun === data.tahun_tujuan?.value) {
            AlertNotification("Tahun Sama", "Tahun asli dengan tahun tujuan clone tidak boleh sama", "warning", 2000);
        } else {
            try {
                setProses(true);
                const response = await fetch(`${branding?.api_perencanaan}/rencana_kinerja/clone_by_kode_opd`, {
                    method: "POST",
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (result.code === 200) {
                    AlertNotification("Berhasil", `Berhasil clone rencana kinerja ${kode_opd} ke tahun ${data?.tahun_tujuan?.value}`, "success", 3000);
                    handleClose();
                } else {
                    AlertNotification("Gagal", `${result.data || "terdapat kesalahan pada backend / database server, cek koneksi internet atau hubungi tim developer"}`, "error", 2000);
                    console.log(result);
                }
            } catch (err) {
                AlertNotification("Error", "terdapat kesalahan pada backend / database server, cek koneksi internet atau hubungi tim developer", "error", 2000);
                console.error(err);
            } finally {
                setProses(false);
            }
        }
    }

    if (!isOpen) {
        return null;
    } else {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 max-h-[80%] text-start overflow-auto`}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-max-[500px] flex items-center gap-1 justify-center py-2 mb-2 border-b-2 border-gray-300 text-center uppercase font-bold">
                            Clone Semua Rencana Kinerja di OPD {nama_opd || "tidak diketahui"}
                        </div>
                        <div className="flex flex-col justify-center pr-2 pb-5">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2 flex items-center gap-1">
                                Tahun Tujuan Clone {errors.tahun_tujuan && <p className="text-red-500">{errors.tahun_tujuan.message}</p>}
                            </label>
                            <Controller
                                name="tahun_tujuan"
                                control={control}
                                rules={{ required: "wajib terisi" }}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Tahun Tujuan Clone"
                                            options={tahunOption}
                                            isSearchable
                                            isClearable
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                    textAlign: 'start',
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base, zIndex: 9999
                                                })
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div className="mt-3">
                            <h1 className="italic font-light text-sm">*semua rencana kinerja yang sudah berhasil di clone dapat disambungkan dengan pohon yang berbeda dengan tahun {tahun || "sekarang"}</h1>
                        </div>
                        <div className="flex flex-col gap-1 mt-3">
                            <ButtonSky type="submit" className="w-full" disabled={Proses}>
                                {Proses ?
                                    <div className="flex items-center gap-1">
                                        <LoadingButtonClip />
                                        <span>Cloning</span>
                                    </div>
                                    :
                                    <div className="flex items-center gap-1">
                                        <TbDeviceFloppy />
                                        <span>Clone</span>
                                    </div>
                                }
                            </ButtonSky>
                            <ButtonRed className="flex items-center gap-1 w-full" onClick={handleClose} disabled={Proses}>
                                <TbX />
                                Batal
                            </ButtonRed>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}