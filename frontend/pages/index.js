import styles from '../styles/index.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router';
import { fetcher } from '../lib/fetchers'
import useSWR from "swr";
import cookie from 'react-cookies'

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    // cookie.save("user", result, {path: "/", maxAge: 10,});

    function handleUsernameChange(event) {
        setUsername(event.target.value)
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value)
    }

    function handleLoginClick() {
        const axios = require('axios');

        axios.post(
            'http://0.0.0.0:8000/login',
            {
                username: username,
                password: password
            })
            .then(res => {
                if (res.data == null) {
                    console.log("账号或密码错误~")
                } else {
                    console.log(res.data);
                    // 笔记 - 设置 cookie
                    cookie.save("user", JSON.stringify(res.data.username), { path: "/", maxAge: 3600 });
                    // 页面跳转
                    router.push("/home");

                    // 笔记 - 页面之间传递参数
                    // router.push(`/home?username=${res.data.username}`);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <div className={styles.box}>
            <h1 className={styles.formTitle}>请登录~</h1>
            <form className={styles.formContainer}>
                <label>Username</label>
                <input className={styles.inputStyle} onChange={handleUsernameChange} value={username} type="text" placeholder="Enter your username" required />
                <label id="email-label">Password</label>
                <input className={styles.inputStyle} onChange={handlePasswordChange} value={password} type="password" placeholder="Enter your password" required />
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </form>
            <button className={styles.submitButton} onClick={handleLoginClick}>Sign In</button>
        </div>
    )
}
