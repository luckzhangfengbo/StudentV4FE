/*
 * @Descripttion:
 * @version:
 * @Author: luckzhangfengbo
 * @Date: 2024-03-30 11:14:36
 * @LastEditors: zhangfengbo
 * @LastEditTime: 2024-04-27 10:07:53
 */
const app = new Vue({
  el: "#app",
  data() {
    //校验学号是否存在
    const rulesSNo = (rule, value, callback) => {
      if (this.isEdit) {
        callback();
      }
      //使用Axios进行校验
      axios
        .post(this.baseURL + "sno/check/", {
          sno: value,
        })
        .then((response) => {
          //成功
          if (response.data.code == 1) {
            //提示
            if (response.data.exists) {
              callback(new Error("学号已经存在"));
            } else {
              callback();
            }
          } else {
            //提示
            callback(new Error("校验学号失败,后端出现异常"));
          }
        })
        .catch((err) => {
          //失败
          console.log(err);
          callback(new Error("校验学号出现异常"));
        });
    };
    return {
      msg: "Hello Vue!",
      baseURL: "http://127.0.0.1:8000/",
      students: [],
      pageStudents: [], //分页后当前页的数据

      selectStudents: [], //选择复选框的集合

      total: 0, //数据总行数
      currentpage: 1, //当前页码
      pagesize: 10, //每页显示行数
      inputStr: "", //输入查询条件
      dialogTitle: "", //弹出框的标题
      isView: false, //是否是查看
      isEdit: false, //是否是修改
      dialogVisible: false,
      studentForm: {
        sno: "",
        name: "",
        gender: "",
        birthday: "",
        mobile: "",
        email: "",
        address: "",
        imaged: "",
      },
      rules: {
        sno: [
          { required: true, message: "学号不能为空", trigger: "blur" },
          {
            pattern: /^[9][5]\d{3}$/,
            message: "学号必须是95开头的5位数字",
            trigger: "blur",
          },
          {
            validator: rulesSNo,
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          {
            pattern: /^[\u4e00-\u9fa5]{2,5}$/,
            message: "姓名在2-5汉字",
            trigger: "blur",
          },
        ],
        gender: [
          { required: true, message: "性别不能为空", trigger: "change" },
        ],
        birthday: [
          {
            required: true,
            message: "生日不能为空",
            trigger: "change",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          {
            pattern: /^\w+@\w+\.\w+$/,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
      },
    };
  },
  mounted() {
    //自动加载数据
    this.getStudents();
  },
  methods: {
    //获取所有学生的信息
    getStudents: function () {
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
      axios
        .get(this.baseURL + "students/")
        .then((response) => {
          //成功
          // console.log(response);
          if (response.data.code == 1) {
            //把数据给students
            this.students = response.data.data;
            //获取返回记录的总行数
            this.total = response.data.data.length;
            //获取当前页的数据
            this.getPageStudents();
            //提示
            this.$message({
              message: "数据加载成功",
              type: "success",
            });
          } else {
            //提示
            this.$message.error(response.data.msg);
          }
        })
        .catch((err) => {
          //失败
          console.log(err);
        });
    },
    //添加学生时候打开表单
    addStudent() {
      this.dialogTitle = "添加学生明细";
      this.dialogVisible = true;
    },
    //查看学生的明细
    viewStudent(row) {
      this.dialogTitle = "查看学生明细";
      this.isView = true;
      this.dialogVisible = true;
      //赋值
      // this.studentForm = row;//这是一个浅拷贝， 会把表单中的数据一块删除掉
      //深拷贝01就是每个元素都赋值
      //深拷贝02
      this.studentForm = JSON.parse(JSON.stringify(row));
    },
    //修改学生的明细
    updateStudent(row) {
      this.dialogTitle = "修改学生明细";
      //修改变量
      this.isEdit = true;
      this.dialogVisible = true;
      this.studentForm = JSON.parse(JSON.stringify(row));
    },
    //全部按钮触发的事件
    getAllStudents() {
      //清空
      this.inputStr = "";
      this.getStudents();
    },
    //获取当前页的学生
    getPageStudents() {
      //清空PageStudents中的数据
      this.pageStudents = [];
      //获得当前页的数据
      for (
        let i = (this.currentpage - 1) * this.pagesize;
        i < this.total;
        i++
      ) {
        //遍历数据添加到pageStudents中
        this.pageStudents.push(this.students[i]);
        //判断是否达到一页的要求
        if (this.pageStudents.length >= this.pagesize) {
          break;
        }
      }
    },
    //提交学生的表单 添加  修改
    submitStudentForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //校验成功后，执行添加还是修改
          if (this.isEdit) {
            //修改
            this.submitUpdateStudent();
          } else {
            //添加
            this.submitAddStudent();
          }
          //alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加到数据库的函数
    submitAddStudent() {
      //使用Axios实现Ajax请求
      let that = this;
      axios
        .post(that.baseURL + "student/add/", that.studentForm)
        .then((response) => {
          //success
          if (response.data.code == 1) {
            that.students = response.data.data;
            that.total = response.data.data.length;
            that.getPageStudents();
            that.$message({
              message: "查询数据加载成功",
              type: "success",
            });
            //关闭弹出框
            that.closeDialogForm("studentForm");
          } else {
            that.$message.error(response.data.msg);
          }
        })
        .catch((err) => {
          //error
          console.log(err);
          that.$message.error("获取后端结果出现异常");
        });
    },
    //修改到数据库的函数
    submitUpdateStudent() {
      //使用Axios实现Ajax请求
      let that = this;
      axios
        .post(that.baseURL + "student/update/", that.studentForm)
        .then((response) => {
          //success
          if (response.data.code == 1) {
            that.students = response.data.data;
            that.total = response.data.data.length;
            that.getPageStudents();
            that.$message({
              message: "数据修改成功",
              type: "success",
            });
            //关闭弹出框
            that.closeDialogForm("studentForm");
          } else {
            that.$message.error(response.data.msg);
          }
        })
        .catch((err) => {
          //error
          console.log(err);
          that.$message.error("获取后端结果出现异常");
        });
    },
    //删除一条学生数据
    deleteStudent(row) {
      console.log(row);
      console.log(row.sno);
      this.$confirm("是否删除该学生信息?", "提示", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let that = this;
          axios
            .post(that.baseURL + "student/delete/", { sno: row.sno })
            .then((res) => {
              if (res.data.code === 1) {
                console.log("enter this");
                that.students = res.data.data;
                that.total = res.data.data.length;
                that.getPageStudents();
                that.$message({
                  type: "success",
                  message: "删除成功!",
                });
              } else {
                that.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //关闭弹出框的表单
    closeDialogForm(formName) {
      //重置表单的校验
      this.$refs[formName].resetFields();
      //清空表单
      this.studentForm.sno = "";
      this.studentForm.name = "";
      this.studentForm.gender = "";
      this.studentForm.birthday = "";
      this.studentForm.mobile = "";
      this.studentForm.email = "";
      this.studentForm.address = "";

      //关闭弹出框
      this.dialogVisible = false;
      this.isEdit = false;
      this.isView = false;
    },
    //分页时修改每页的行数
    handleSizeChange(size) {
      //修改当前每页的行数
      this.pagesize = size;
      //数据重新分页
      this.getPageStudents();
    },
    deleteStudents() {
      this.$confirm(
        "是否批量删除" + this.selectStudents.length + "学生信息?",
        "提示",
        {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let that = this;
          axios
            .post(that.baseURL + "students/delete/", {
              student: that.selectStudents,
            })
            .then((res) => {
              if (res.data.code === 1) {
                console.log("enter this");
                that.students = res.data.data;
                that.total = res.data.data.length;
                that.getPageStudents();
                that.$message({
                  type: "success",
                  message: "数据批量删除成功!",
                });
              } else {
                that.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //实现学生信息的查询
    queryStudents() {
      //实用Ajax请求--post--传递查询条件
      axios
        .post(this.baseURL + "students/query/", {
          inputstr: this.inputStr,
        })
        .then((response) => {
          //成功
          if (response.data.code == 1) {
            //把数据给students
            this.students = response.data.data;
            //获取返回记录的总行数
            this.total = response.data.data.length;
            //获取当前页的数据
            this.getPageStudents();
            //提示
            this.$message({
              message: "数据查询成功",
              type: "success",
            });
          } else {
            //提示
            this.$message.error(response.data.msg);
          }
        })
        .catch((err) => {
          //失败
          console.log(err);
          this.$message.error("获取后端查询接口出现异常!");
        });
    },
    //调整当前的页码
    handleCurrentChange(pageNumber) {
      //修改当前的页码
      this.currentpage = pageNumber;
      //数据重新分页
      this.getPageStudents();
    },
    //选择复选框触发的操作
    handleSelectionChange(data) {
      this.selectStudents = data;
      console.log(data);
    },
  },
});
