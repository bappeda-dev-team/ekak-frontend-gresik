import { WebResponse, Data } from "./types"

const API_URL_TAGGING =
    process.env.NEXT_PUBLIC_API_URL_TAGGING || "http://localhost:8080";

async function request<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL_TAGGING}${path}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    const result: WebResponse<T> = await response.json();

    return result.data;
}

export const api = {
    laporan: {
        tagging_pokin(namaTagging: string, tahun: number) {
            return request<Data>(`/laporan/tagging_pokin?nama_tagging=${encodeURIComponent(namaTagging)}&tahun=${tahun}`)
        },
    },
};
