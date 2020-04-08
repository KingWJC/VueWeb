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

    computed: {
      // 科室无数据信息提示
      noDataMsg() {
        let mapId = this.activeAccordionName,
            deptCode = this.resolveObj(mapId, "deptCode"),
            groupId = this.resolveObj(mapId, "groupId"),
            deptName = this.resolveObj(mapId, "deptName");

        if (deptCode === null) {
          return `全部科室 没有监测病例`;
        }

        if (groupId === null) {
          return `${deptName} 全部诊疗组 中没有监测病例`;
        }
      },

      // 获得当前下钻组件的标题文本
      drillTitle() {
        let mapId = this.activeAccordionName,
            groupCodeObj = this.resolveObj(mapId, "groupCode"),
            colLevelObj = this.resolveObj(mapId, "columnLevel"),
            atvColObj = this.resolveObj(mapId, "activeColumn"),
            deptNameObj = this.resolveObj(mapId, "deptName"),
            groupNameObj = this.resolveObj(mapId, "groupName"),
            isCkGrpObj = this.resolveObj(mapId, "isClickGroup");

        // hash有没有构建成功,并且columnLevel(当前选择是不是科室)
        if (
          groupCodeObj === null &&
          colLevelObj === null &&
          !atvColObj
        ) {
          return "选择科室";
        } else {
          // 组件没启动时,文案显示'请选择科室'
          if (
            groupCodeObj === null &&
            colLevelObj === null &&
            atvColObj
          ) {
            return deptNameObj;
          }

          // 全部诊疗组 (atvColObj === false)
          if (
            groupCodeObj === "group" &&
            colLevelObj === "dept" &&
            !atvColObj
          ) {
            this.setAccuracyItems(mapId, [
              {
                CODE: "doctor",
                NAME: "医生"
              }
            ]);

            return `${deptNameObj}-全部诊疗组`;
          }

          // 指定诊疗组 (atvColObj === true)
          if (
            groupCodeObj === "group" &&
            colLevelObj === "dept" &&
            atvColObj
          ) {
            return groupNameObj;
          }

          // 指定诊疗组下的全部医生
          if (
            groupCodeObj === "doctor" &&
            colLevelObj === "group" &&
            atvColObj &&
            isCkGrpObj
          ) {
            this.setAccuracyItems(mapId, []);

            return `${groupNameObj}-全部医生`;
          }

          // 全部诊疗组的全部医生
          if (
            groupCodeObj === "doctor" &&
            colLevelObj === "group" &&
            atvColObj &&
            !isCkGrpObj
          ) {
            this.setAccuracyItems(mapId, []);

            return `${deptNameObj}-全部医生`;
          }

          // 全部科室下的全部医生
          if (
            groupCodeObj === "doctor" &&
            colLevelObj === "dept" &&
            atvColObj
          ) {
            this.setAccuracyItems(mapId, []);

            return `${deptNameObj}-全部医生`;
          }
        }
      }
    },

    methods: {
      // 点击上转
      upDrillList() {
        // 接收map的id 用于获取每条accordion 的map的对象
        let mapId = this.activeAccordionName,
            colLevelObj = this.resolveObj(mapId, "columnLevel"),
            upDrillArrObj = this.resolveObj(mapId, "upDrillArr")
              ? this.resolveObj(mapId, "upDrillArr")
              : [];
        // 是否选择了指定诊疗组
        this.setObj(mapId, false, "isClickGroup");
        // 开启柱图可点击
        this.setObj(mapId, false, "activeColumn");
        // 取出下转时记录的对象
        this.accordionCascadeMap[mapId] = upDrillArrObj.pop();

        // 点击上转 上转级别为dept时,组件相关样式置灰,点击变量恢复默认值
        if (colLevelObj === "dept") {
          // 请求数据
          this.fetchDeptCaseCadeData("up");

          // 当父级为dept时,点击后数据跳转回顶级结构,数据初始化
          this.accordionCascadeMap[mapId] = null;
          this.drillCodeObjData(
            mapId,
            this.accordionCascadeMap[mapId], "SD_ID"
          );
        }

        // 点击上转 上转级别为group时,组件点击值置为group
        if (colLevelObj === "group") {
          // 请求数据
          this.fetchDeptCaseCadeData("up");
          // 更新map数据为上一次记录值
          this.accordionCascadeMap[mapId] = Object.assign(
            {},
            upDrillArrObj[upDrillArrObj.length - 1]
          );
          // 更新点击下拉的标识符
          this.setObj(mapId, "group", "groupCode");
          // 跟新下转按钮的激活状态
          this.setObj(mapId, "doctor", "drillUpType");
        }
      },

      // 点击下转
      nextDrill(drillItem) {
        // mapId 为最优先的 私有变量
        let mapId = this.activeAccordionName;

        // 存储转取组件回传标识(存入map)
        this.setObj(mapId, drillItem.CODE, "groupCode");

        // 从map 中取出  或直接用 参数 都可
        let groupCodeObj = this.resolveObj(mapId, "groupCode"),
            colLevelObj = this.resolveObj(mapId, "columnLevel");

        // 构建状态数据的对象,存放在数组
        // 组建下拉没点击时
        if (
          groupCodeObj === null ||
          groupCodeObj === "dept"
        ) {
          this.setObj(mapId, null, "drillUpType");
          this.setObj(mapId, null, "columnLevel");
        }

        // 组建下拉点击诊疗组时
        if (groupCodeObj === "group") {
          // 开启柱图可点击
          this.setObj(mapId, false, "activeColumn");
          // 跟新组件上转按钮激活状态
          this.setObj(mapId, "dept", "drillUpType");
          // 更新map存放状态
          this.setObj(mapId, "dept", "columnLevel");
          this.setObj(mapId, "group", "legendType");
        }

        // 诊疗组下转到医生时
        if (
          groupCodeObj === "doctor" &&
          colLevelObj !== null
        ) {
          // 柱图不可点击
          this.setObj(mapId, true, "activeColumn");

          this.setObj(mapId, "group", "drillUpType");
          // 下转按钮激活状态改变
          this.setObj(mapId, null, "drilldownType");
          // 更新map存放状态
          this.setObj(mapId, "group", "columnLevel");
          this.setObj(mapId, "doctor", "legendType");
        }

        // 从科室直接下转到医生时
        if (
          groupCodeObj === "doctor" &&
          colLevelObj === null
        ) {
          this.setObj(mapId, "dept", "drillUpType");
          // 下转按钮激活状态改变
          this.setObj(mapId, null, "drilldownType");
          // 更新map存放状态
          this.setObj(mapId, "dept", "columnLevel");
          this.setObj(mapId, "doctor", "legendType");
        }

        // 上转存储arr压栈
        this.setUpDrillArr(mapId, this.accordionCascadeMap[mapId]);

        // 点击了组件 即请求了数据 下拉列表就要变化 组件激活状态也要变化
        if (groupCodeObj === "group") {
          this.setAccuracyItems(mapId, [
            {
              CODE: "doctor",
              NAME: "医生"
            }
          ]);
        }

        // 接收map的id 用于获取每条accordion 的map的对象
        this.fetchDeptCaseCadeData(drillItem.CODE);
      },

      // 构建map的方法
      drillCodeObjData(id, codeObj, fieldName) {
        let mapId = this.activeAccordionName,
            legendType = this.resolveObj(mapId, "legendType")
              ? this.resolveObj(mapId, "legendType")
              : "dept",
            columnLevel = this.resolveObj(mapId, "columnLevel"),
            accuracyItems = this.resolveObj(mapId, "accuracyItems")
              ? this.resolveObj(mapId, "accuracyItems")
              : [],
            groupCode = this.resolveObj(mapId, "groupCode"),
            upDrillArr = this.resolveObj(mapId, "upDrillArr")
              ? this.resolveObj(mapId, "upDrillArr")
              : [],
            drillUpType = this.resolveObj(mapId, "drillUpType"),
            drilldownType = this.resolveObj(mapId, "drilldownType"),
            activeColumn = this.resolveObj(mapId, "activeColumn")
              ? this.resolveObj(mapId, "activeColumn")
              : false,
            isClickGroup = this.resolveObj(mapId, "isClickGroup")
              ? this.resolveObj(mapId, "isClickGroup")
              : false,
            groupCodeObj = this.resolveObj(mapId, "groupCode");

        // 初始化调用时   构建map
        // 如果是空对象   证明当前停留级别为科室(上转用到)
        if (codeObj !== null) {
          // 得到列表当前行数据对象
          let activeAccordionObj = this.findObjById(id, fieldName);

          // 科室底下存在的诊疗组,有无数据
          if (activeAccordionObj.Groups.findIndex((item) => {
            return item.DEPT_CODE === codeObj.deptCode;
          }) > -1) {
            // 如果转取组件回传code为空
            // 证明当前为科室柱图级别 动态传递列表
            if (groupCodeObj === null) {
              legendType = "dept";
              accuracyItems = [
                {
                  CODE: "group",
                  NAME: "诊疗组"
                },
                {
                  CODE: "doctor",
                  NAME: "医生"
                }
              ];
            } else if (groupCodeObj === "group") {
              legendType = "group";
              columnLevel = "dept";
              accuracyItems = [
                {
                  CODE: "doctor",
                  NAME: "医生"
                }
              ];
            }
          } else {
            // else: 科室底下没有挂诊疗组，转取组件接收医生列表
            legendType = "dept";
            accuracyItems = [
              {
                CODE: "doctor",
                NAME: "医生"
              }
            ];
          }
        }

        // 更新 map 里面对应的code，无论当前有没有被注册
        // ！注意，必须把map内嵌套对象也更新，否则引用未发生变化，子组件 watch 是
        // 不会生效的
        this.accordionCascadeMap[id] = Object.assign(
          {
            legendType,
            columnLevel,
            accuracyItems,
            groupCode,
            upDrillArr,
            drillUpType,
            drilldownType,
            activeColumn,
            isClickGroup
          },
          codeObj
        );
        this.accordionCascadeMap = Object.assign({}, this.accordionCascadeMap);
      },

      // 当前点击柱图事件
      drillLevelMenuSub(fieldName, dataIndex) {
        let mapId = this.activeAccordionName,
            groupCodeObj = this.resolveObj(mapId, "groupCode"),
            deptCodeObj = this.resolveObj(mapId, "deptCode"),
            deptNameObj = this.resolveObj(mapId, "deptName");

        let dept = [],
            group = [];

        // 点击的是科室
        if (groupCodeObj === null) {
          // 查找科室柱形图数组，判断文案是否匹配
          dept = this.originalDeptData.X[dataIndex];

          this.drillCodeObjData(mapId, {
            deptCode: dept.Code,
            groupId: null,
            deptName: dept.Name,
            groupName: null
          }, fieldName);

          // 点击科室柱图才开启组件激活状态
          this.setObj(mapId, "dept", "drilldownType");
        } else if (groupCodeObj === "group") {
          // else-if: 点击的诊疗组
          // 查找诊疗组形图数组，判断文案是否匹配
          group = this.originalDeptData.X[dataIndex];

          this.drillCodeObjData(mapId, {
            deptCode: deptCodeObj,
            groupId: group.Code,
            deptName: deptNameObj,
            groupName: group.Name
          }, fieldName);

          // 开启诊疗组柱图点击变量
          this.setObj(mapId, true, "isClickGroup");
        }
        // 点击柱图更改状态
        this.setObj(mapId, true, "activeColumn");
      },

      resolveObj(id, field) {
        if (!this.accordionCascadeMap[id]) {
          // 给图例一个初始值 且定是 科室
          if (field === "legendType") {
            return "dept";
          }

          return null;
        }

        return this.accordionCascadeMap[id][field];
      },

      setObj(id, value, field) {
        if (!this.accordionCascadeMap[id]) {
          this.accordionCascadeMap[id] = {};
        }

        this.accordionCascadeMap[id][field] = value;
        this.accordionCascadeMap = Object.assign({}, this.accordionCascadeMap);
      },

      // accuracyItems包装方法 为了不在dom中写逻辑语句
      accuracyItemsPack(id, value) {
        return this.resolveObj(id, value) ? this.resolveObj(id, value) : [];
      },
      // 设置upDrillArr记录数组
      setUpDrillArr(id, value) {
        let arr = this.resolveObj(id, "upDrillArr")
          ? this.resolveObj(id, "upDrillArr")
          : [];

        arr.push(Object.assign({}, value));
      },

      // 设置下拉菜单
      setAccuracyItems(id, value) {
        this.accordionCascadeMap[id].accuracyItems = value.slice(0);
      },

      // 通过 ID 找出对应的行记录
      // @param {String} id accordion 的名字（字符串）
      // @param {String} fieldName accordion 的名字(字符串）
      findObjById(id, fieldName) {
        return this.accordionList.find((item) => {
          return item[fieldName] === parseInt(id);
        });
      },

      // 代理发送危急值信息（id(sd/kpi)，危急值）到父组件
      baselineChanged(obj) {
        this.$emit("baselineChanged", obj);
      }
    }
  };
</script>
