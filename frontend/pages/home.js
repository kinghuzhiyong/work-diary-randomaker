import styles from '../styles/home.module.css'
import Portal from '../components/Portal/portal.js'
import Link from 'next/link'
import copy from 'copy-to-clipboard';
import Dialog from '@/components/dialog/dialog';
import cookie from 'react-cookies'
import { useState } from 'react';
import { getPresetList, fetchPresetList } from '../lib/fetch';
import { createPortal } from 'react-dom';
import { generateIndependentList, generateNotIndependentList } from '../lib/random';
import { WithAuth } from '../components/high-oder.js'
import { updatePresetList } from '../lib/update'
import { useRouter } from 'next/router';


function Home({ presetListData }) {
    // console.log(presetListData)
    // 根据预设列表生成渲染的列表
    const [newPresetListData, setNewPresetListData] = useState(presetListData.result);

    // 生成的设置，目前是数据是否独立互斥
    const [config, setConfig] = useState(
        {
            ifIndependent: false
        }
    )

    // 点击预设日志值时，改变其样式，在禁用和激活状态之间切换，让生成日志时不使用它
    function handlePresetClick(e) {
        let before = [...newPresetListData];
        for (let i = 0; i < before.length; i++) {
            if (before[i].id == parseInt(e.target.id)) {
                let countArr = before.filter(item => !item.isDisable);
                if (before[i].isDisable == false && countArr.length <= 3) {
                    alert("请不要取消所有的预设日志")
                    return;
                } else {
                    before[i] = (() => {
                        before[i].isDisable = before[i].isDisable ? false : true;
                        return before[i];
                    })();
                    break;
                }
            }
        }
        setNewPresetListData(before);
        // 更新预设列表的状态
        updatePresetList(before);
    }

    // 处理点击配置的多选框
    // 看起来调用 onClick 会默认传入一个指向当前的对象
    function handleCheckboxClick(e) {
        let temp = config;
        console.log(newPresetListData);
        let tempArr = newPresetListData.filter(item => !item.isDisable);
        if (e.target.id == "ifIndependent") {
            if (tempArr.length < 15) {
                alert("数据不足, 无法生成互斥的数据");
                e.target.checked = false;
                return;
            }
        }
        temp[e.target.id] = e.target.checked;
        setConfig(temp);
    }

    return (
        <main>
            <Navigator />
            <Preset newPresetListData={newPresetListData} handlePresetClick={handlePresetClick} />
            <GenerateDiary presetListData={newPresetListData} config={config} handleCheckboxClick={handleCheckboxClick} />
        </main>
    );
}

// 导航栏
function Navigator() {
    // 调用登出接口
    function logout() {
        cookie.remove("user", { path: "/" });
    }

    return (
        <div className={styles.navigator}>
            <ul className={styles.flexBox}>
                <li className={styles.li}>
                    <Link href="/" className={styles.link} onClick={logout}>Logout</Link>
                </li>
            </ul>
        </div>
    );
}

// 预设模块 - start
function Preset({ newPresetListData, handlePresetClick }) {
    // 添加一条数据
    async function addOnePreset(value) {
        const axios = require('axios');
        axios.post(
            'http://0.0.0.0:8000/add_one_preset',
            {
                detail: value
            })
            .then(res => {
                if (res.data.status == 0) {
                    console.log(res.data.msg)
                } else if (res.data.status == 1) {
                    console.log(res.data.msg)
                    window.location.reload()  // 强制刷新页面
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <div className={styles.presetBox}>
            <PresetAndButton addOnePreset={addOnePreset} />
            <PresetTextList newPresetListData={newPresetListData} handlePresetClick={handlePresetClick} />
        </div>
    );
}

function PresetAndButton({ addOnePreset }) {
    return (
        <div className={styles.gridBox}>
            <h2 className={styles.title}>预设</h2>
            <Portal addOnePreset={addOnePreset} />
        </div>
    );
}

function PresetTextList({ newPresetListData, handlePresetClick }) {
    // console.log(newPresetListData)
    return (
        <div className={styles.textAreaBox}>
            <ul className={styles.textAreaUl}>
                {
                    newPresetListData.map(({ id, detail, isDisable }) => {
                        let result = (isDisable ?
                            (<li onClick={handlePresetClick} className={styles.disabledTextAreaLi} key={id} id={id}>{detail}</li>)
                            :
                            (<li onClick={handlePresetClick} className={styles.textAreaLi} key={id} id={id}>{detail}</li>));
                        return result;
                    })
                }
            </ul>
        </div>
    )
}
// 预设模块 - end

// 随机处理模块 - start
function GenerateDiary({ presetListData, config, handleCheckboxClick }) {
    const [isGenerated, setIsGenerated] = useState(false);
    const [generationInfo, setGenerationInfo] = useState([]);

    // 生成内容
    function handleGeneration() {
        console.log(presetListData[0]);
        // 将被 disable 掉的过滤掉
        let processedList = presetListData.filter(item => !item.isDisable);
        // 生成随机后日志列表
        let result = config.ifIndependent ? generateIndependentList(processedList) : generateNotIndependentList(processedList);
        setIsGenerated(true);
        setGenerationInfo(result);
    }

    return (
        <div className={styles.generatorContainer}>
            <h2 className={styles.title1}>日志生成</h2>
            <GenerateConfig handleGeneration={handleGeneration} handleCheckboxClick={handleCheckboxClick} />
            {isGenerated ? <GeneratedInfo result={generationInfo} /> : <>等待生成!</>}
        </div>
    );
}

function GenerateConfig({ handleCheckboxClick, handleGeneration }) {
    return (
        <div className={styles.generatorGridBox}>
            <button className={styles.button} onClick={handleGeneration}>
                <span className={styles.buttonspan}>开始生成</span>
            </button>
            <form className={styles.checkBoxContainer}>
                <input id="ifIndependent" type="checkbox" onChange={handleCheckboxClick} className={styles.checkBox} /><label htmlFor="ifIndependent" className={styles.checkBoxLabel}>避免重复</label>
            </form>
        </div>
    );
}

function GeneratedInfo({ result }) {

    // 处理弹框的逻辑
    const [showModal, setShowModal] = useState(false);

    function handleCopy(text) {
        setShowModal(true);
        copy(text);
        // 笔记 - 定时器，指定时间后执行代码
        setTimeout(() => setShowModal(false), 2000);
    }
    return (
        <div>
            <ul className={styles.listContainer}>
                {result.map(({ date, diary }) => (
                    <li key={date}>
                        <div className={styles.dateAndCopyButtonContainer}>
                            <h3>星期 {date}</h3>
                            <button className={styles.copyButton} onClick={() => handleCopy(diary.join("\n"))}>Copy</button>
                        </div>
                        <textarea className={styles.textareaStyle} cols="20" rows="10" value={diary.join("\n")} readOnly></textarea>
                    </li>
                ))}
            </ul>
            {showModal && createPortal(
                <Dialog msg={"复制成功"} />,
                document.body
            )}
        </div>
    );
}
// 随机处理模块 - end

// 渲染 preset 列表的数据
export async function getServerSideProps() {
    const presetListData = await getPresetList();  // 调用获取数据的函数
    return {
        props: {
            presetListData,  // 发送数据
        },
    };
}

export default WithAuth(Home);
