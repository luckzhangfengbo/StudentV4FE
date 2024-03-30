/*
 * @Descripttion: 
 * @version: 
 * @Author: luckzhangfengbo
 * @Date: 2024-03-30 11:14:36
 * @LastEditors: zhangfengbo
 * @LastEditTime: 2024-03-30 13:25:30
 */
const app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        students:[
            {
               sno:95001, name:'zhangfengbo', gender:'男',birthday:'1995-01-01',mobile:'12345678901',email:'1819067324@qq.com',address:'北京市海淀区'
            },
            {
                sno:95002, name:'zhangfengbo1', gender:'男',birthday:'1995-01-01',mobile:'12345678901',email:'1819067324@qq.com',address:'北京市海淀区'
            },
            {
                sno:95003, name:'zhangfengbo2', gender:'男',birthday:'1995-01-01',mobile:'12345678901',email:'1819067324@qq.com',address:'北京市海淀区'
            },
        ]
    }
})