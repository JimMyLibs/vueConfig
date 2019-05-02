import Vue from 'vue';
import Router from 'vue-router';
import { user } from "comm/business/user";

Vue.use(Router);

const VueRouter = new Router({
    routes: [{ // 首页
            path: '/',
            alias: '/index',
            name: 'index',
            component: () =>
                import ('../pages/index/Index.vue')
        },
        { // 公司介绍
            path: '/companyProfile',
            name: 'companyProfile',
            component: () =>
                import ('../pages/index/CompanyProfile.vue')
        },
        { // 公告
            path: '/notice',
            component: () =>
                import ('../pages/notice/Notice.vue'),
            children: [{
                    path: '/',
                    redirect: "list"
                },
                {
                    path: 'list',
                    component: () =>
                        import ('../pages/notice/List.vue')
                },
                {
                    path: 'detail',
                    component: () =>
                        import ('../pages/notice/Detail.vue')
                }
            ]
        },
        {
            path: '/user',
            component: () =>
                import ( /* webpackChunkName: "user" */ '../pages/user/User.vue'),
            children: [{
                    path: '',
                    name: 'user_index',
                    component: () =>
                        import ( /* webpackChunkName: "user_index" */ '../pages/user/Index.vue')
                },
                {
                    path: 'set',
                    name: 'user_set',
                    component: () =>
                        import ( /* webpackChunkName: "user_index" */ '../pages/user/Set.vue')
                },
                {
                    path: 'editPw',
                    name: 'user_editPw',
                    component: () =>
                        import ( /* webpackChunkName: "user_index" */ '../pages/user/EditPw.vue')
                },
                {
                    path: 'editUserInfo',
                    name: 'user_editUserInfo',
                    component: () =>
                        import ( /* webpackChunkName: "user_index" */ '../pages/user/EditUserInfo.vue')
                },
                {
                    path: 'comments',
                    name: 'user_comments',
                    component: () =>
                        import ( /* webpackChunkName: "user_index" */ '../pages/user/comments/Comments.vue')
                },
                {
                    path: 'reply',
                    name: 'user_reply',
                    component: () =>
                        import ( /* webpackChunkName: "user_index" */ '../pages/user/myCustomService/Reply.vue')
                },
                {
                    path: 'customService',
                    name: 'user_customService',
                    component: () =>
                        import ( /* webpackChunkName: "user_index" */ '../pages/user/customService/List.vue')
                },
                {
                    path: 'myCustomService',
                    name: 'user_myCustomService',
                    component: () =>
                        import ( /* webpackChunkName: "user_index" */ '../pages/user/myCustomService/List.vue')
                },
                {
                    path: 'perfectMyInfo',
                    name: 'user_perfectMyInfo',
                    component: () =>
                        import ( /* webpackChunkName: "user_index" */ '../pages/user/PerfectMyInfo/Index.vue')
                },
                {
                    path: 'checkState',
                    name: 'user_checkState',
                    component: () =>
                        import ( /* webpackChunkName: "user_index" */ '../pages/user/PerfectMyInfo/checkState.vue')
                }
            ]
        },
        {
            path: '/agreement',
            component: () =>
                import ('../pages/agreement/Agreement.vue'),
            children: [{
                    path: '/',
                    redirect: "list"
                },
                {
                    path: 'list',
                    component: () =>
                        import ('../pages/agreement/List.vue')
                },
                {
                    path: 'detail',
                    component: () =>
                        import ('../pages/agreement/Detail.vue')
                }
            ]
        },
        {
            path: '/check',
            component: () =>
                import ('../pages/check/Check.vue'),
            children: [{
                    path: '/',
                    redirect: "list"
                },
                {
                    path: 'list',
                    component: () =>
                        import ('../pages/check/List.vue')
                },
                {
                    path: 'detail',
                    component: () =>
                        import ('../pages/check/Detail.vue')
                }
            ]
        },
        {
            path: '/review',
            component: () =>
                import ('../pages/review/Review.vue'),
            children: [{
                    path: '/',
                    redirect: "list"
                },
                {
                    path: 'list',
                    component: () =>
                        import ('../pages/review/List.vue')
                },
                {
                    path: 'detail',
                    component: () =>
                        import ('../pages/review/Detail.vue')
                }
            ]
        },
        {
            path: '/loginView',
            component: () =>
                import ('../pages/login/View.vue'),
            meta: {
                auth: 1
            },
            children: [{
                    path: '/login',
                    redirect: "login",
                    meta: {
                        auth: 1
                    }
                },
                {
                    path: 'login',
                    component: () =>
                        import ('../pages/login/Login.vue'),
                    meta: {
                        auth: 1
                    }
                },
                {
                    path: 'register',
                    name: 'register',
                    component: () =>
                        import ('../pages/login/Register.vue'),
                    meta: {
                        auth: 1
                    },
                    children: [{
                        path: 'agreement',
                        name: 'reg_agreement',
                        component: () =>
                            import ('../pages/login/Agreement.vue'),
                        meta: {
                            auth: 1
                        }
                    }]
                },
                {
                    path: 'find',
                    component: () =>
                        import ('../pages/login/Find.vue'),
                    meta: {
                        auth: 1
                    }
                },
                {
                    path: 'agreement',
                    component: () =>
                        import ('../pages/login/Agreement.vue'),
                    meta: {
                        auth: 1
                    }
                },
                {
                    path: 'wechatReg',
                    component: () =>
                        import ('../pages/login/wechatReg.vue'),
                    meta: {
                        auth: 1
                    }
                },
                {
                    path: 'wechatLogin',
                    component: () =>
                        import ('../pages/login/wechatLogin.vue'),
                    meta: {
                        auth: 1
                    }
                }
            ]
        },
        {
            path: '/message',
            component: () =>
                import ('../pages/message/Message.vue')
        },
        {
            path: '/sign',
            component: () =>
                import ('../pages/sign/Sign.vue')
        }
    ]
});

const goWhere = (to: any, from: any, next: any, data: any) => {
    let { materialStatus, userType } = data;
    userType = Number(userType)
    if (userType === 1) {
        console.log(21)
        next();
    } else {
        if(materialStatus === 2){// 资料审核通过，允许访问任何页面
            next();
        }else{
            if(to.name === 'index'){// APP默认进首页
                if (materialStatus === 0) {
                    console.log(22)
                    next("/user/perfectMyInfo?type=edit");
                } else if (materialStatus === 1) {
                    console.log(23)
                    next("/user/checkState");
                } else if (materialStatus === 3) {
                    console.log(25)
                    next("/user/perfectMyInfo?type=fail");
                }
            }else{// 防止死循环
                next();
            }            
        }
    }
}

VueRouter.beforeEach((to, from, next) => {
    // let userInfo: any = localStorage.__userInfo__;
    console.log("登录信息", from.path, to.path);
    let userInfo = user()

    if (userInfo) {
        if (!userInfo.token) {// 未登录
            if (to.meta.auth) {// 无需登录
                console.log(11)
                next();
            } else {// 需要登录
                console.log(12)
                next("/login");                
            }
        } else {// 已登录
            console.log(13)
            goWhere(to, from, next, userInfo);
        }
    } else {// 未登录
        if (to.meta.auth) {// 无需登录
            console.log(15)
            next();
        } else {// 需要登录
            console.log(16)
            next("/login");                
        }
    }
})
export default VueRouter