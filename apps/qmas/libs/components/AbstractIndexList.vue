<script>
  // 这个 Mixin 里面包含所有 行记录 accordion（全院/专科/专病）里面用到的公用
  // 方法和逻辑，每一个 props 或者 method 的改动都必须完全确保相应依赖项也同时更新，
  // 比如 data 属性，参数等
  export default {
    props: {
      // 列表
      accordionList: {
        type: Array,
        default() {
          return [];
        }
      }
    },

    methods: {
      // 接受从子组件传过来的科室和诊疗组的code
      // @param {String} id 当前行记录的 ID
      // @param {Object} codeObj 当前行记录对应的已选择科室，诊疗组
      codeObjData(id, codeObj, fieldName) {
        let legendType;

        // 级联变化之后科室图图例的类型相应变化
        if (codeObj.deptCode === null) {
          legendType = "dept";
        } else {
          let activeAccordionObj = this.findObjById(id, fieldName);

          // 科室底下存在诊疗组
          if (activeAccordionObj.Groups.findIndex((item) => {
            return item.DEPT_CODE === codeObj.deptCode;
          }) > -1) {
            // 如果诊疗组没选（全部诊疗组）
            if (codeObj.groupId === null) {
              legendType = "group";
            } else {
              // else: 选了诊疗组，渲染医生视图
              legendType = "doctor";
            }
          } else {
            // else: 科室底下没有挂诊疗组，直接渲染医生视图
            legendType = "doctor";
          }
        }

        // 更新 map 里面对应的code，无论当前有没有被注册
        // ！注意，必须把map内嵌套对象也更新，否则引用未发生变化，子组件 watch 是
        // 不会生效的
        this.accordionCascadeMap[id] = Object.assign({legendType}, codeObj);
        this.accordionCascadeMap = Object.assign({}, this.accordionCascadeMap);

        // 层叠发送上来code，发送请求
        // 先清空原有数据
        this.diagramData = null;
        this.originalDeptData = null;

        this.fetchDeptCaseCadeData();
      },

      // 从 map 里面解析对应的科室code
      resolveDeptCode(id) {
        // 如果kpi没有被注册，返回 null（表示全部科室）
        if (!this.accordionCascadeMap[id]) {
          return null;
        }

        return this.accordionCascadeMap[id].deptCode;
      },

      // 从 map 里面解析对应的科室name
      resolveDeptName(id) {
        // 如果kpi没有被注册，返回 null（表示全部科室）
        if (!this.accordionCascadeMap[id]) {
          return null;
        }

        return this.accordionCascadeMap[id].deptName;
      },

      // 从 map 里面解析对应的诊疗组id
      resolveGroupId(id) {
        // 如果kpi没有被注册，返回 null（表示全部诊疗组）
        if (!this.accordionCascadeMap[id]) {
          return null;
        }

        return this.accordionCascadeMap[id].groupId;
      },

      // 从 map 里面解析对应的诊疗组id
      resolveGroupName(id) {
        // 如果kpi没有被注册，返回 null（表示全部诊疗组）
        if (!this.accordionCascadeMap[id]) {
          return null;
        }

        return this.accordionCascadeMap[id].groupName;
      },

      // 从 map 里面解析对应的当前科室渲染视图（dept,科室/group,诊疗组/doctor,医生）
      resolveLegendType(id) {
        // 如果kpi没有被注册，返回科室（表示默认渲染科室视图）
        if (!this.accordionCascadeMap[id]) {
          return "dept";
        }

        return this.accordionCascadeMap[id].legendType;
      },

      // 通过 ID 找出对应的行记录
      // @param {String} id accordion 的名字（字符串）
      // @param {String} fieldName accordion 的名字(字符串）
      findObjById(id, fieldName) {
        return this.accordionList.find((item) => {
          return item[fieldName] === parseInt(id);
        });
      },

      // 此事件是柱形图点击事件(包括点击科室,点击诊疗组或者点击医生触发此事件)
      // @params dataIndex Number 当前渲染的echart 点击的哪个柱图
      levelMenuSub(fieldName, dataIndex) {
        let accName = this.activeAccordionName,
            dept = [],
            group = [];

        // 点击的是科室
        if (this.accordionCascadeMap[accName].legendType === "dept") {
          // 查找科室柱形图数组，判断文案是否匹配
          dept = this.originalDeptData.X[dataIndex];

          this.codeObjData(accName, {
            deptCode: dept.DEPT_CODE,
            groupId: null,
            deptName: dept.DEPT_NAME,
            groupName: this.accordionCascadeMap[accName].groupName
          }, fieldName);
        } else if (this.accordionCascadeMap[accName].legendType === "group") {
          // else-if:点击的诊疗组
          // 查找诊疗组形图数组，判断文案是否匹配
          group = this.originalDeptData.X[dataIndex];

          this.codeObjData(accName, {
            deptCode: this.accordionCascadeMap[accName].deptCode,
            groupId: group.GROUP_ID
          }, fieldName);
        }
      },

      // 代理发送预警值信息（id(sd/kpi)，预警值）到父组件
      baselineChanged(obj) {
        this.$emit("baselineChanged", obj);
      },

      // 柱图排序
      bubbleSort(obj) {
        // 全院/专科
        let len = obj.Y.length;

        for (let i = 0; i < len; i++) {
          for (let j = 0; j < len - 1 - i; j++) {
            // 相邻元素两两对比
            if (Number(obj.Y[j].Rate) < Number(obj.Y[j + 1].Rate)) {
              // 元素交换
              let tempY = obj.Y[j + 1];
              obj.Y[j + 1] = obj.Y[j];
              obj.Y[j] = tempY;

              // 元素交换
              let tempX = obj.X[j + 1];
              obj.X[j + 1] = obj.X[j];
              obj.X[j] = tempX;
            }
          }
        }

        return obj;
      }
    }
  };
</script>
