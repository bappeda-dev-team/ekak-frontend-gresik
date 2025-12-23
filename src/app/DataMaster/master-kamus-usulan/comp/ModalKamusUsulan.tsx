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
    Data: KamusUsulan | null;
}
interface FormValue {
    nama_kamus_usulan: string;
    kode_kamus_usulan: string;
}
interface KamusUsulan {
    id: number,
    nama_kamus_usulan: string;
    kode_kamus_usulan: string;
}

export const ModalKamusUsulan: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data }) => {

    const { control, handleSubmit, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            nama_kamus_usulan: Data?.nama_kamus_usulan,
            kode_kamus_usulan: Data?.kode_kamus_usulan,
        }
    });
    const [Proses, setProses] = useState<boolean>(false);

    const { branding } = useBrandingContext();
    const token = getToken();

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            nama_kamus_usulan: data.nama_kamus_usulan,
            kode_kamus_usulan: data.kode_kamus_usulan,
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
                        <h1 className="text-xl uppercase">{jenis} Kamus Usulan</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Nama Kamus Usulan: {errors.nama_kamus_usulan && "wajib diisi"}
                            </label>
                            <Controller
                                name="nama_kamus_usulan"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_kamus_usulan"
                                        placeholder="masukkan nama kamus usulan"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Kode Kamus Usulan: {errors.kode_kamus_usulan && "wajib diisi"}
                            </label>
                            <Controller
                                name="kode_kamus_usulan"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="kode_kamus_usulan"
                                        type="text"
                                        placeholder="masukkan kode kamus usulan"
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