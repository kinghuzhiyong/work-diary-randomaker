import useSWR from "swr";
import { fetcher } from './fetchers'

export async function getPresetList() {
    console.log("获取预设列表")
    const res = await fetch(
        'http://0.0.0.0:8000/get_preset_list',
        {
            method: 'get'
        }
    )
    let result = await res.json()
    return result
}
