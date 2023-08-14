import { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './portal.module.css'

export default function PortalExample({ addOnePreset }) {
    const [showModal, setShowModal] = useState(false);
    const [text, setText] = useState("");

    function handleOnSubmit() {
        if (text == "") {
            alert("请输入内容~");
            return;
        }
        setShowModal(false);
        addOnePreset(text);
    }

    // 在 input 框改变时修改 text 的值
    function handleTextChange(event) {
        setText(event.target.value);
    }

    return (
        <>
            <button onClick={() => setShowModal(true)} className={styles.addButton}>
                新增
            </button>
            {showModal && createPortal(
                <ModalContent onSubmit={handleOnSubmit} detail={text} handleTextChange={handleTextChange} setShowModal={setShowModal} />,
                document.body
            )}
        </>
    );
}

function ModalContent({ onSubmit, detail, handleTextChange, setShowModal }) {
    return (
        <div className={styles.dialog}>
            <div className={styles.infoContainer}>
                <div className={styles.flexBox}>
                    <div>请输入预设日志内容:</div>
                    <input type="text" onChange={handleTextChange} value={detail} />
                    <button onClick={onSubmit}>提交</button>
                    <button onClick={() => setShowModal(false)}>取消</button>
                </div>
            </div>
        </div>
    );
}
