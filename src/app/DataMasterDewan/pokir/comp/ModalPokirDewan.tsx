'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { getToken, getUser } from "@/components/lib/Cookie";
import { AlertNotification } from "@/components/global/Alert";
import Select from 'react-select';
import { LoadingButtonClip } from "@/components/global/Loading";
import { OptionTypeString, OptionType } from "@/types";
import { useBrandingContext } from "@/context/BrandingContext";

interface UsulanPokir {
    id: string;
    usulan: string;
    alamat: string;
    uraian: string;
    tahun: string;
    rencana_kinerja_id: string;
    kode_opd: string;
    nama_opd: string;
    status: string;
    id_kamus_usulan: number;
    nama_kamus_usulan: string;
    nip_pengusul: string;
    jumlah: string;
    satuan: string;
    kecamatan: string;
    kelurahan: string;
    rt: string;
    rw: string;
}
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
    rt: string;
    rw: string;
    tahun: string;
}
interface KamusUsulan {
    id: number,
    nama_kamus_usulan: string;
    kode_kamus_usulan: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    jenis: "tambah" | "edit";
    Data: UsulanPokir | null;
}

export const ModalPokirDewan: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data }) => {

    const [Proses, setProses] = useState<boolean>(false);
    
    const [OptionKamus, setOptionKamus] = useState<OptionType[]>([]);
    const [LoadingKamus, setLoadingKamus] = useState<boolean>(false);
    
    const [OptionKecamatan, setOptionKecamatan] = useState<OptionTypeString[]>([]);
    const [Kecamatan, setKecamatan] = useState<OptionTypeString | null>(null);

    const [OptionKelurahan, setOptionKelurahan] = useState<OptionTypeString[]>([]);

    const [LoadingKecamatan, setLoadingKecamatan] = useState<boolean>(false);
    const [LoadingKelurahan, setLoadingKelurahan] = useState<boolean>(false);
    
    const { branding } = useBrandingContext();
    const token = getToken();
    
    const { control, reset, handleSubmit, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            kecamatan: null,
            kelurahan: null,
            nip_pengusul: Data?.nip_pengusul ?? "",
            id_kamus_usulan: null,
            jumlah: Data?.jumlah,
            satuan: Data?.satuan,
            alamat: Data?.alamat,
            uraian: Data?.uraian,
            usulan: Data?.usulan,
            rt: Data?.rt,
            rw: Data?.rw,
            tahun: String(branding?.tahun?.value),
        }
    });

    const fetchKamusUsulan = async () => {
        try {
            setLoadingKamus(true)
            const response = await fetch(`${branding?.api_perencanaan}/kamus_usulan/findall`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const data = result.data;
            if (result.code === 200) {
                if (data === null) {
                    setOptionKamus([]);
                } else {
                    const option = data.map((item: KamusUsulan, index: number) => ({
                        label: item.nama_kamus_usulan,
                        value: item.id,
                    }))
                    setOptionKamus(option);
                }
            } else {
                AlertNotification("Gagal", "gagal mendapatkan data dropdown kamus usulan", "error", 3000, true);
                console.log(result);
            }
        } catch (err) {
            AlertNotification("Gagal", "gagal mendapatkan data dropdown kamus usulan", "error", 3000, true);
            console.error(err)
        } finally {
            setLoadingKamus(false);
        }
    }

    const fetchKelurahan = async (kode: string) => {
        try {
            setLoadingKelurahan(true);
            const response = await fetch(`${branding?.api_perencanaan}/kecamatan?kode_kecamatan=${kode}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const data = result.data;
            if (result.code === 200) {
                if (data === null) {
                    setOptionKelurahan([]);
                } else {
                    const option = data.map((item: any, index: number) => ({
                        label: item.nama_kelurahan,
                        value: item.kode_kelurahan,
                    }))
                    setOptionKelurahan(option);
                }
            } else {
                AlertNotification("Gagal", "gagal mendapatkan data kecamatan", "error", 3000, true);
                console.log(result);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingKelurahan(false);
        }
    }

    useEffect(() => {
        const fetchKecamatan = async () => {
            try {
                setLoadingKecamatan(true);
                const response = await fetch(`${branding?.api_perencanaan}/findkecamatan/dewan-1`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (result.code === 200) {
                    if (data === null) {
                        setOptionKecamatan([]);
                    } else {
                        const option = data.map((item: any, index: number) => ({
                            label: item.nama_kecamatan,
                            value: item.kode_kecamatan,
                        }))
                        setOptionKecamatan(option);
                    }
                } else {
                    AlertNotification("Gagal", "gagal mendapatkan data kecamatan", "error", 3000, true);
                    console.log(result);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoadingKecamatan(false);
            }
        }
        fetchKecamatan();
    }, [branding])

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            kecamatan: Kecamatan?.label,
            kelurahan: data.kelurahan?.label,
            nip_pengusul: branding?.user.nip,
            id_kamus_usulan: data.id_kamus_usulan?.value,
            jumlah: data.jumlah,
            satuan: data.satuan,
            alamat: data.alamat,
            uraian: data.uraian,
            usulan: data.usulan,
            rt: data.rt,
            rw: data.rw,
            tahun: String(branding?.tahun?.value),
        };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/usulan_pokok_pikiran/create`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil menambahkan dasar hukum", "success", 1000);
                onClose();
                onSuccess();
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b text-center">
                        <h1 className="text-xl uppercase">{jenis} Pokok Pikiran Dewan</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Kamus Usulan:
                            </label>
                            <Controller
                                name="id_kamus_usulan"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="id_kamus_usulan"
                                        placeholder="pilih kamus usulan"
                                        options={OptionKamus}
                                        isLoading={LoadingKamus}
                                        onMenuOpen={() => {
                                            if (OptionKamus.length === 0) {
                                                fetchKamusUsulan();
                                            }
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                            }),
                                            menuPortal: (base) => ({
                                                ...base, zIndex: 9999
                                            })
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Kecamatan:
                            </label>
                            <Controller
                                name="kecamatan"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="kecamatan"
                                        placeholder="pilih Kecamatan"
                                        isLoading={LoadingKecamatan}
                                        options={OptionKecamatan}
                                        onChange={(option) => {
                                            setKecamatan(option)
                                        }}
                                        value={Kecamatan}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                            }),
                                            menuPortal: (base) => ({
                                                ...base, zIndex: 9999
                                            })
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Kelurahan:
                            </label>
                            <Controller
                                name="kelurahan"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="kelurahan"
                                        placeholder="pilih kelurahan"
                                        options={OptionKelurahan}
                                        isLoading={LoadingKelurahan}
                                        onMenuOpen={() => {
                                            if (Kecamatan) {
                                                fetchKelurahan(Kecamatan.value)
                                            }
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                            }),
                                            menuPortal: (base) => ({
                                                ...base, zIndex: 9999
                                            })
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Jumlah:
                            </label>
                            <Controller
                                name="jumlah"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="jumlah"
                                        type="text"
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
                                    <input
                                        {...field}
                                        id="satuan"
                                        type="text"
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
                        <div className="flex items-center gap-1 w-full">
                            <div className="flex flex-col py-3 w-full">
                                <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                    rt:
                                </label>
                                <Controller
                                    name="rt"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            id="rt"
                                            type="text"
                                            className="border px-4 py-2 rounded-lg"
                                            placeholder="masukkan rt"
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex flex-col py-3 w-full">
                                <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                    rw:
                                </label>
                                <Controller
                                    name="rw"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            id="rw"
                                            type="text"
                                            className="border px-4 py-2 rounded-lg"
                                            placeholder="masukkan rw"
                                        />
                                    )}
                                />
                            </div>
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
                        <ButtonRed className="w-full my-3" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}