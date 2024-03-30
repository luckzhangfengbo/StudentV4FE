/*
 * @Descripttion: 
 * @version: 
 * @Author: luckzhangfengbo
 * @Date: 2024-03-30 11:14:36
 * @LastEditors: zhangfengbo
 * @LastEditTime: 2024-03-30 15:22:07
 */
const app = new Vue({
    el: '#app',
    data: {
        msg: 'Hello Vue!',
        baseURL:"http://localhost:8000/",
        students:[],
        total:100, //数据总行数
        currentpage:1,//当前页码
        pagesize:10,//每页显示行数
    },
    mounted() {
        //自动加载数据
        this.getStudents();
    },
    methods: {
        //获取所有学生的信息
        getStudents:function(){
            //使用Axios实现Ajax请求
            axios.get(this.baseURL + "students/")
            .then(function(res){
                //成功
                console.log(res);
            })
            .catch(function(err){
                //失败
                console.log(error);
            });
        },
    },
})