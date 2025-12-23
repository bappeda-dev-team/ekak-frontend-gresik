'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification } from "@/components/global/Alert";
import { LoadingButtonClip } from "@/components/global/Loading";
import { OptionTypeString, OptionType } from "@/types";
import { useBrandingContext } from "@/context/BrandingContext";

interface FormValue {
    kecamatan: OptionTypeString | null;
    kelurahan: OptionTypeString | null;
    nip_pengusul: string;
    id_kamus_usulan: OptionType | null;
    jumlah: string;
    satuan: string;
    alamat: string;
    uraian: string;
    usulan: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    jenis: "tambah" | "edit";
    Data: any;
}

export const ModalPokirDewan: React.FC<modal> = ({ isOpen, onClose, jenis, Data }) => {

    const { control, handleSubmit, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            kecamatan: null,
            kelurahan: null,
            nip_pengusul: Data.nip_pengusul,
            id_kamus_usulan: null,
            jumlah: Data.jumlah,
            satuan: Data.satuan,
            alamat: Data.alamat,
            uraian: Data.uraian,
            usulan: Data.usulan,
        }
    });
    const [PeraturanTerkait, setPeraturanTerkait] = useState<string>('');
    const [Proses, setProses] = useState<boolean>(false);

    const { branding } = useBrandingContext();
    const token = getToken();

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            kecamatan: data.kecamatan?.value,
            kelurahan: data.kelurahan?.value,
            nip_pengusul: branding?.user.nip,
            id_kamus_usulan: data.id_kamus_usulan?.value,
            jumlah: data.jumlah,
            satuan: data.satuan,
            alamat: data.alamat,
            uraian: data.uraian,
            usulan: data.usulan,
        };
        console.log(formData);
        // try {
        //     setProses(true);
        //     const response = await fetch(`${API_URL}/dasar_hukum/create`, {
        //         method: "POST",
        //         headers: {
        //             Authorization: `${token}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(formData),
        //     });
        //     if (response.ok) {
        //         AlertNotification("Berhasil", "Berhasil menambahkan dasar hukum", "success", 1000);
        //         onClose();
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
                        <h1 className="text-xl uppercase">{jenis} Pokok Pikiran</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Jumlah:
                            </label>
                            <Controller
                                name="jumlah"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        id="jumlah"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan jumlah"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Satuan:
                            </label>
                            <Controller
                                name="satuan"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        id="satuan"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan satuan"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Alamat:
                            </label>
                            <Controller
                                name="alamat"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        id="alamat"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan alamat"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Uraian:
                            </label>
                            <Controller
                                name="uraian"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        id="uraian"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan uraian"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Usulan:
                            </label>
                            <Controller
                                name="usulan"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        id="usulan"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan usulan"
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