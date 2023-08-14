import { useRouter } from 'next/router';
import { useEffect } from 'react';
import cookie from 'react-cookies'


const checkAuth = () => {
    const value = cookie.load("user");
    return value == undefined ? false : true
};

// 笔记 - 使用高阶函数检测用户登录状态
// 目前的策略是使用高阶函数包裹我们的组件，来检测用户的登录状态
const WithAuth = (WrappedComponent) => {
    const HocComponent = (props) => {
        // 获取 nextjs 路由的查询参数
        const router = useRouter();
        // const { username } = router.query;

        // 在组件渲染之前，检查用户登录状态
        useEffect(() => {
            if (!checkAuth()) {
                // 如果用户未登录，则进行页面跳转到登录页面或其他未登录提示页面
                router.push('/');
            }
        }, []);
        // console.log(checkAuth(username));

        // 如果用户已登录，则渲染原始组件
        // return checkAuth() ? <WrappedComponent {...props} /> : null;
        return <WrappedComponent {...props} />;
    };
    return HocComponent;
};

export { WithAuth };
