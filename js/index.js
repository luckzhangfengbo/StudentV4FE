/*
 * @Descripttion: 
 * @version: 
 * @Author: luckzhangfengbo
 * @Date: 2024-03-30 11:14:36
 * @LastEditors: zhangfengbo
 * @LastEditTime: 2024-03-30 20:38:01
 */
const app = new Vue({
    el: '#app',
    data: {
        msg: 'Hello Vue!',
        baseURL:"http://127.0.0.1:8000/",
        students:[],
        pageStudents:[],//分页后当前页的数据
        total:0, //数据总行数
        currentpage:1,//当前页码
        pagesize:10,//每页显示行数
        inputStr: '',//输入查询条件
        dialogTitle:'',//弹出框的标题
        isView:false,//是否是查看
        isEdit:false,//是否是修改
        dialogVisible: false,
        studentForm:{
            sno:'',
            name:'',
            gender:'',
            birthday:'',
            mobile:'',
            email:'',
            address:'',
            imaged:'',
        }
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
                    //获取返回记录的总行数
                    this.total = response.data.data.length;
                    //获取当前页的数据
                    this.getPageStudents();
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
        //添加学生时候打开表单
        addStudent(){
            this.dialogTitle = '添加学生明细';
            this.dialogVisible=true;
            
        },
        //查看学生的明细
        viewStudent(row) {
            this.dialogTitle = '查看学生明细';
            this.isView=true;
            this.dialogVisible=true;
            //赋值
            // this.studentForm = row;//这是一个浅拷贝， 会把表单中的数据一块删除掉
            //深拷贝01就是每个元素都赋值
            //深拷贝02
            this.studentForm = JSON.parse(JSON.stringify(row));
            
        },
         //修改学生的明细
         updateStudent(row) {
            this.dialogTitle = '修改学生明细';
            //修改变量
            this.isEdit=true;
            this.dialogVisible=true;
            this.studentForm = JSON.parse(JSON.stringify(row));
            
        },
        //全部按钮触发的事件
        getAllStudents(){
            //清空
            this.inputStr = '';
            this.getStudents();
        },
        //获取当前页的学生
        getPageStudents() {
            //清空PageStudents中的数据
            this.pageStudents = [];
            //获得当前页的数据
            for (let i=(this.currentpage-1) * this.pagesize; i<this.total; i++) {
                //遍历数据添加到pageStudents中
                this.pageStudents.push(this.students[i]);
                //判断是否达到一页的要求
                if (this.pageStudents.length >= this.pagesize) {
                    break;
                }
            }
            
        },
        //关闭弹出框的表单
        closeDialogForm() {
            //清空表单
            this.studentForm.sno='';
            this.studentForm.name='';
            this.studentForm.gender='';
            this.studentForm.birthday='';
            this.studentForm.mobile='';
            this.studentForm.email='';
            this.studentForm.address='';

            //关闭弹出框
            this.dialogVisible = false;
            this.isEdit = false;
            this.isView = false;
        },
        //分页时修改每页的行数
        handleSizeChange(size){
            //修改当前每页的行数
            this.pagesize = size;
            //数据重新分页
            this.getPageStudents();

        },
        //实现学生信息的查询
        queryStudents() {
          //实用Ajax请求--post--传递查询条件
            axios
            .post(this.baseURL + "students/query/", {
                inputstr: this.inputStr
            }).then(response => {
                //成功
                if(response.data.code == 1) {
                    //把数据给students
                    this.students = response.data.data;
                    //获取返回记录的总行数
                    this.total = response.data.data.length;
                    //获取当前页的数据
                    this.getPageStudents();
                    //提示
                    this.$message({
                        message: '数据查询成功',
                        type: 'success'
                    });
                } else {
                    //提示
                    this.$message.error(response.data.msg);
                }
            }).catch(err => {
                //失败
                console.log(err);
                this.$message.error("获取后端查询接口出现异常!");
            });
        },
        //调整当前的页码
        handleCurrentChange(pageNumber){
            //修改当前的页码
            this.currentpage = pageNumber;
            //数据重新分页
            this.getPageStudents();
        },  
    },
})