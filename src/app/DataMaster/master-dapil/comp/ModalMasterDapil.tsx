'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification } from "@/components/global/Alert";
import { LoadingButtonClip } from "@/components/global/Loading";
import { useBrandingContext } from "@/context/BrandingContext";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    jenis: "tambah" | "edit";
    Data: Dapil | null;
}
interface FormValue {
    nama_dapil: string;
    kode_dapil: string;
    kode_kecamatan: string;
    nama_kecamatan: string;
}
interface Dapil {
    id: number;
    kode_dapil: string;
    nama_dapil: string;
    kode_kecamatan: string;
    nama_kecamatan: string;
}

export const ModalMasterDapil: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data }) => {

    const { control, handleSubmit, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            nama_dapil: Data?.nama_dapil,
            kode_dapil: Data?.kode_dapil,
            kode_kecamatan: Data?.kode_kecamatan,
            nama_kecamatan: Data?.nama_kecamatan,
        }
    });
    const [Proses, setProses] = useState<boolean>(false);

    const { branding } = useBrandingContext();
    const token = getToken();

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            nama_dapil: data.nama_dapil,
            kode_dapil: data.kode_dapil,
            kode_kecamatan: data.kode_kecamatan,
            nama_kecamatan: data.nama_kecamatan,
        };
        console.log(formData);
        // try {
        //     setProses(true);
        //     const response = await fetch(`${API_URL}/`, {
        //         method: "POST",
        //         headers: {
        //             Authorization: `${token}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(formData),
        //     });
        //     if (response.ok) {
        //         AlertNotification("Berhasil", "Berhasil menyimpan kamus usulan", "success", 1000);
        //         onClose();
        //          onSuccess();
        //     } else {
        //         AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
        //     }
        // } catch (err) {
        //     AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        // } finally {
        //     setProses(false);
        // }
    };

    if (!isOpen) {
        return null;
    } else {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={onClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 text-start`}>
                    <div className="w-max-[500px] py-2 border-b text-center">
                        <h1 className="text-xl uppercase">{jenis} Master Dapil</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Nama Dapil: {errors.nama_dapil && "wajib diisi"}
                            </label>
                            <Controller
                                name="nama_dapil"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_dapil"
                                        type="text"
                                        placeholder="masukkan nama Dapil"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Kode Dapil: {errors.kode_dapil && "wajib diisi"}
                            </label>
                            <Controller
                                name="kode_dapil"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="kode_dapil"
                                        type="text"
                                        placeholder="masukkan kode Dapil"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Kode Kecamatan: {errors.kode_kecamatan && "wajib diisi"}
                            </label>
                            <Controller
                                name="kode_kecamatan"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="kode_kecamatan"
                                        type="text"
                                        placeholder="masukkan kode Kecamatan"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Nama Kecamatan: {errors.kode_kecamatan && "wajib diisi"}
                            </label>
                            <Controller
                                name="kode_kecamatan"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="kode_kecamatan"
                                        type="text"
                                        placeholder="masukkan Nama Kecamatan"
                                    />
                                )}
                            />
                        </div>
                        <ButtonSky className="w-full my-3" type="submit" disabled={Proses}>
                            {Proses ?
                                <span className="flex">
                                    <LoadingButtonClip />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full my-3" onClick={onClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}