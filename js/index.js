/*
 * @Descripttion: 
 * @version: 
 * @Author: luckzhangfengbo
 * @Date: 2024-03-30 11:14:36
 * @LastEditors: zhangfengbo
 * @LastEditTime: 2024-03-30 16:18:40
 */
const app = new Vue({
    el: '#app',
    data: {
        msg: 'Hello Vue!',
        baseURL:"http://127.0.0.1:8000/",
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
            // axios.get(this.baseURL + "students/")
            // .then(function(response){
            //     //成功
            //     console.log(response);
            // })
            // .catch(function(err){
            //     //失败
            //     console.log(error);
            // });
            //使用Axios实现Ajax请求
            // 记录this地址
            // let that = this; 目前我还有遇到这个问题 
            axios.get(this.baseURL + "students/")
            .then(response => {
                //成功
                // console.log(response);
                if(response.data.code == 1) {
                    //把数据给students
                    this.students = response.data.data;
                    //提示
                    this.$message({
                        message: '数据加载成功',
                        type: 'success'
                    });
                } else {
                    //提示
                    this.$message.error(response.data.msg);
                }
            })
            .catch(err => {
                //失败
                console.log(err);
            });
        },
    },
})