<script>
  export default {
    data() {
      return {
        // 当前指标或病种下的全部科室及是否选中科室的映射
        typeDataMap: {}
      };
    },

    methods: {
      // 获取所有趋势类型设置
      getTypeData(sourceData, pageType) {
        // 初始构建map
        if (!this.typeDataMap[this.activeAccordionName]) {
          let typeData = [],
              typeSubData = {
                itemName: "科室趋势",
                itemCode: "sd",
                isSelected: true
              },
              ctrlList = [];

          if (pageType === "sd") {
            ctrlList.push({
              ctrlName: "可疑率",
              code: "susprate",
              isSelected: true
            }, {
              ctrlName: "反馈率",
              code: "resprate",
              isSelected: true
            });
          } else if (pageType === "war") {
            typeSubData.itemCode = "index";
          } else if (pageType === "eval") {
            typeSubData.itemCode = "index";
          }

          typeSubData.ctrlList = ctrlList;

          typeSubData.childList = sourceData.reduce((newArr, item) => {
            if (item.Item.Code !== "") {
              newArr.push({
                code: item.Item.Code,
                childName: item.Item.Name,
                isSelected: false
              });
            }

            return newArr;
          }, []);

          typeData.push(typeSubData);

          this.typeDataMap[this.activeAccordionName] = typeData;
        } else {
          // 相应map存在时
          let typeData = this.typeDataMap[this.activeAccordionName];

          typeData[0].childList = sourceData.reduce((newArr, item) => {
            if (item.Item.Code !== "") {
              let obj = {
                    code: item.Item.Code,
                    childName: item.Item.Name,
                    isSelected: false
                  },

                  flag = typeData[0].childList.find((subItem) => {
                    return item.Item.Code === subItem.code &&
                      subItem.isSelected;
                  });

              if (flag) {
                obj.isSelected = true;
              }

              newArr.push(obj);
            }

            return newArr;
          }, []);
        }
      },

      // 转换已选择的趋势类型对象为typeDataMap里的形式
      getSelectedTypeData(sourceData, obj) {
        let typeData =
          this.typeDataMap[this.activeAccordionName].find((item) => {
            return item.itemCode === obj.itemCode;
          });

        typeData.ctrlList = typeData.ctrlList.map((item) => {
          let flag = obj.ctrlList.find((subItem) => {
            return item.code === subItem;
          });

          item.isSelected = flag ? true : false;

          return item;
        });

        typeData.childList = typeData.childList.map((item) => {
          let flag = obj.code.find((subItem) => {
            return item.code === subItem;
          });

          item.isSelected = flag ? true : false;

          return item;
        });

        return this.filterSourceData(sourceData);
      },

      // 筛选符合条件的原始数据
      filterSourceData(sourceData) {
        // 筛选已选中科室的原始数据
        return sourceData.filter((item) => {
          let obj = this.typeDataMap[this.activeAccordionName][0]
            .childList.find((subItem) => {
              return subItem.isSelected && item.Item.Code === subItem.code;
            });

          return item.Item.Code === "" || obj;
        });
      }
    }
  };
</script>
