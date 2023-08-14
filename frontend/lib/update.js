import axios from 'axios'

export function updatePresetList(data) {
    // console.log(data);
    axios.patch(
        'http://0.0.0.0:8000/update_preset_list',
        {
            presetList: data
        })
        .then(res => {
            console.log("更新预设列表成功");
        })
        .catch(err => {
            console.log(err);
        });
}