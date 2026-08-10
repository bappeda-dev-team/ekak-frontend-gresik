'use client'

import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder, ButtonGreen } from "@/components/global/Button";
import { LoadingButtonClip } from "@/components/global/Loading";
import { TbCirclePlus, TbCircleX, TbDeviceFloppy, TbX } from "react-icons/tb";
import { AlertNotification } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";
import { RB, IndikatorRB, TargetRB } from "../type";
import Select from 'react-select';

interface OptionTypeString {
    value: string;
    label: string;
}
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    jenis: "tambah" | "edit";
    tahun: number;
    Data: RB | null;
}

interface FormValue {
    jenis_rb: OptionTypeString | null,
    kegiatan_utama: string,
    keterangan: string,
    tahun_baseline: number,
    tahun_next: number,
    indikator: Indikator[]
}

interface Indikator {
    indikator: string,
    target: [
        {
            tahun_baseline: number,
            target_baseline: string,
            realisasi_baseline: string,
            satuan_baseline: string
        },
        {
            tahun_next: number,
            target_next: string,
            satuan_next: string
        }
    ]
}


export const ModalMasterRb: React.FC<ModalProps> = ({ Data, isOpen, onClose, onSuccess, jenis, tahun }) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            jenis_rb: Data?.jenis_rb ? {
                value: Data?.jenis_rb,
                label: Data?.jenis_rb
            } : null,
            kegiatan_utama: Data?.kegiatan_utama,
            keterangan: Data?.keterangan,
            tahun_baseline: Data?.tahun_baseline,
            tahun_next: Data?.tahun_next,
            indikator: Data?.indikator.map((i: IndikatorRB) => ({
                indikator: i.indikator,
                target: [
                    {
                        tahun_baseline: i.target[0].tahun_baseline,
                        target_baseline: i.target[0].target_baseline,
                        realisasi_baseline: i.target[0].realisasi_baseline,
                        satuan_baseline: i.target[0].satuan_baseline
                    },
                    {
                        tahun_next: i.target[0].tahun_next,
                        target_next: i.target[0].target_next,
                        satuan_next: i.target[0].satuan_next
                    }
                ]
            }))
        }
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();
    const { branding } = useBrandingContext();

    const handleClose = () => {
        onClose();
        reset();
    }

    const OptionJenisRb = [
        {value: "GENERAL", label: "GENERAL"},
        {value: "TEMATIK", label: "TEMATIK"}
    ]

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const payload = {
            jenis_rb: data.jenis_rb?.value,
            kegiatan_utama: data.kegiatan_utama,
            keterangan: data.keterangan,
            tahun_baseline: tahun - 1,
            tahun_next: tahun,
            indikator: (data.indikator || []).map((ind) => ({
                indikator: ind.indikator,
                target: [
                    {
                        tahun_baseline: tahun - 1,
                        target_baseline: ind.target[0].target_baseline,
                        realisasi_baseline: ind.target[0].realisasi_baseline,
                        satuan_baseline: ind.target[0].satuan_baseline,
                    },
                    {
                        tahun_next: tahun,
                        target_next: ind.target[1].target_next,
                        satuan_next: ind.target[1].satuan_next,
                    }
                ],
            })),
        };

        // console.log(payload);
        try {
            let url = "";
            if (jenis === "edit") {
                url = `datamaster/rb/${Data?.id}/update`;
            } else {
                url = `datamaster/rb/create`;
            }
            setProses(true);
            const response = await fetch(`${branding?.api_perencanaan}/${url}`, {
                method: jenis === 'edit' ? "PUT" : "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "Berhasil menambahkan Master RB", "success", 1000);
                onClose();
                onSuccess();
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
                console.log(result);
            }
        } catch (err) {
            console.log(err);
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    if (!isOpen) {
        return null;
    } else {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[90%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{jenis} Master RB tahun {tahun - 1}</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <Controller
                            name={`jenis_rb`}
                            control={control}
                            render={({ field }) => (
                                <>
                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                        Jenis RB :
                                    </label>
                                    <Select
                                        id="jenis_rb"
                                        {...field}
                                        placeholder="Masukkan Jenis RB"
                                        options={OptionJenisRb}
                                        isSearchable
                                        isClearable
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                            })
                                        }}
                                    />
                                    {errors.jenis_rb ?
                                        <h1 className="text-red-500">
                                            {errors.jenis_rb.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Jenis RB Harus Dipilih</h1>
                                    }
                                </>
                            )}
                        />
                        <Controller
                            name={`kegiatan_utama`}
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col py-3">
                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                        Kegiatan Utama :
                                    </label>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder={`Masukkan Kegiatan Utama`}
                                    />
                                </div>
                            )}
                        />
                        <label className="uppercase text-base font-bold text-gray-700 my-2">
                            indikator rencana kinerja :
                        </label>
                        {fields.map((field, index) => (
                            <div key={index} className="flex flex-col bg-gray-200 my-2 py-2 px-2 rounded-lg">
                                <Controller
                                    name={`indikator.${index}.indikator`}
                                    control={control}
                                    defaultValue={field.indikator}
                                    render={({ field }) => (
                                        <div className="flex flex-col py-3">
                                            <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                Nama Indikator ke - {index + 1} :
                                            </label>
                                            <input
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                placeholder={`Masukkan nama indikator ${index + 1}`}
                                            />
                                        </div>
                                    )}
                                />
                                <div className="flex gap-1 w-full">
                                    <div className="flex flex-col flex-wrap w-full border border-emerald-500 rounded-lg  pt-4 mt-2 px-2">
                                        <h4 className="text-sm font-semibold text-emerald-500">Target Baseline {tahun}</h4>
                                        <Controller
                                            name={`indikator.${index}.target.0.target_baseline`}
                                            control={control}
                                            defaultValue={field.target[0].target_baseline}
                                            render={({ field: controllerField }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">Target Baseline:</label>
                                                    <input
                                                        {...controllerField}
                                                        type="text"
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder="Masukkan target baseline"
                                                    />
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name={`indikator.${index}.target.0.realisasi_baseline`}
                                            control={control}
                                            defaultValue={field.target[0].realisasi_baseline}
                                            render={({ field: controllerField }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">Realisasi Baseline:</label>
                                                    <input
                                                        {...controllerField}
                                                        type="text"
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder="Masukkan realisasi baseline"
                                                    />
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name={`indikator.${index}.target.0.satuan_baseline`}
                                            control={control}
                                            defaultValue={field.target[0].satuan_baseline}
                                            render={({ field: controllerField }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">Satuan Baseline:</label>
                                                    <input
                                                        {...controllerField}
                                                        type="text"
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder="Masukkan satuan baseline"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-col flex-wrap w-full border border-blue-500 rounded-lg pt-4 mt-2 px-2">
                                        <h4 className="text-sm font-semibold text-blue-500">Target Tahun Berikutnya {tahun + 1}</h4>
                                        <Controller
                                            name={`indikator.${index}.target.1.target_next`}
                                            control={control}
                                            defaultValue={field.target[1].target_next}
                                            render={({ field: controllerField }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">Target Next:</label>
                                                    <input
                                                        {...controllerField}
                                                        type="text"
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder="Masukkan target tahun berikutnya"
                                                    />
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name={`indikator.${index}.target.1.satuan_next`}
                                            control={control}
                                            defaultValue={field.target[1].satuan_next}
                                            render={({ field: controllerField }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">Satuan Next:</label>
                                                    <input
                                                        {...controllerField}
                                                        type="text"
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder="Masukkan satuan tahun berikutnya"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                                {index >= 0 && (
                                    <ButtonRedBorder
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="w-[200px] mt-3 flex items-center gap-1"
                                    >
                                        <TbCircleX />
                                        Hapus
                                    </ButtonRedBorder>
                                )}
                            </div>
                        ))}
                        <ButtonSkyBorder
                            className="mb-3 flex items-center gap-1"
                            type="button"
                            disabled={Proses}
                            onClick={() => {
                                append({
                                    indikator: "", target: [
                                        { tahun_baseline: 0, target_baseline: "", realisasi_baseline: "", satuan_baseline: "" },
                                        { tahun_next: 0, target_next: "", satuan_next: "" }
                                    ]
                                });
                            }}
                        >
                            <TbCirclePlus />
                            Tambah Indikator
                        </ButtonSkyBorder>
                        <Controller
                            name={`keterangan`}
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col py-3">
                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                        Keterangan :
                                    </label>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder={`Masukkan Keterangan`}
                                    />
                                </div>
                            )}
                        />
                        <ButtonGreen type="submit" className="my-4" disabled={Proses}>
                            {Proses ?
                                <span className="flex items-center gap-1">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                <span className="flex items-center gap-1">
                                    <TbDeviceFloppy />
                                    Simpan
                                </span>

                            }
                        </ButtonGreen>
                        <ButtonRed 
                            className="flex items-center gap-1"
                            type="button" 
                            onClick={handleClose} 
                            disabled={Proses}
                        >
                            <TbX />
                            Kembali
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}