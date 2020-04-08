const qaUserinfo = {
  TotalRecord: 1,

  Data: [
    {
      Roles: [
        {
          ROLE_ID: 1,
          ROLE_NAME: "超级管理员",
          // 1选择  0未选择
          IsSelect: 1,
          ROLE_TYPE: 0
        },
        {
          ROLE_ID: 2,
          ROLE_NAME: "管理员",
          // 1选择  0未选择
          IsSelect: 0,
          ROLE_TYPE: 1
        },
        {
          ROLE_ID: 3,
          ROLE_NAME: "医生",
          // 1选择  0未选择
          IsSelect: 0,
          ROLE_TYPE: 0
        },
        {
          ROLE_ID: 4,
          ROLE_NAME: "院长",
          // 1选择  0未选择
          IsSelect: 0,
          ROLE_TYPE: 0
        },
        {
          ROLE_ID: 5,
          ROLE_NAME: "科主任",
          // 1选择  0未选择
          IsSelect: 0,
          ROLE_TYPE: 0
        }
      ],
      Depts: [
        {
          DEPT_CODE: "dept_code_1",
          DEPT_NAME: "心内科",
          IsSelect: 0,
          // 病种所属类别（0.专病 1.全院 2.科室）
          SD_TYPE_CODE: 0
        },
        {
          DEPT_CODE: "dept_code_2",
          DEPT_NAME: "普外科",
          IsSelect: 1,
          SD_TYPE_CODE: 0
        },
        {
          DEPT_CODE: "dept_code_3",
          DEPT_NAME: "心血管",
          IsSelect: 1,
          SD_TYPE_CODE: 0
        },
        {
          DEPT_CODE: "dept_code_4",
          DEPT_NAME: "外科",
          IsSelect: 1,
          SD_TYPE_CODE: 1
        },
        {
          DEPT_CODE: "dept_code_5",
          DEPT_NAME: "妇产科",
          IsSelect: 1,
          SD_TYPE_CODE: 1
        },
        {
          DEPT_CODE: "dept_code_6",
          DEPT_NAME: "儿科",
          IsSelect: 0,
          SD_TYPE_CODE: 1
        },
        {
          DEPT_CODE: "dept_code_7",
          DEPT_NAME: "儿科11",
          IsSelect: 0,
          SD_TYPE_CODE: 2
        },
        {
          DEPT_CODE: "dept_code_8",
          DEPT_NAME: "儿科22",
          IsSelect: 0,
          SD_TYPE_CODE: 2
        },
        {
          DEPT_CODE: "dept_code_9",
          DEPT_NAME: "儿科33",
          IsSelect: 1,
          SD_TYPE_CODE: 2
        }
      ],

      Sds: [
        {
          SD_ID: 10021,
          SD_CODE: "CRC",
          SD_NAME: "缺血性脑卒中",
          IsSelect: 1
        },
        {
          SD_ID: 10022,
          SD_CODE: "IS",
          SD_NAME: "IS",
          IsSelect: 1
        },
        {
          SD_ID: 10023,
          SD_CODE: "CRC1",
          SD_NAME:
            "结直肠癌(比较长一些的病种名称比较长一些的病种名称比较长一些的病种名称)",
          IsSelect: 0
        },
        {
          SD_ID: 10024,
          SD_CODE: "CRC2",
          SD_NAME: "结直肠癌1",
          IsSelect: 0
        },
        {
          SD_ID: 10025,
          SD_CODE: "CRC3",
          SD_NAME: "结直肠癌2",
          IsSelect: 0
        },
        {
          SD_ID: 10026,
          SD_CODE: "CRC4",
          SD_NAME: "结直肠癌3",
          IsSelect: 1
        },
        {
          SD_ID: 10027,
          SD_CODE: "CRC5",
          SD_NAME: "结直肠癌4",
          IsSelect: 1
        }
      ],

      Kpis: "-"
        .repeat(40)
        .split("")
        .map((item, index) => {
          let endId = parseInt(Math.random() * 6 + 1);
          let inum = index - 23;
          let temp =
            index === 33
              ? `${inum}--比较长一些的指标名称比较长一些的指标名称比较长一些的评价指标比较长一些的指标名称比较长`
              : `${inum}--评价指标`;

          return {
            SD_ID: endId + 10020,
            SD_EKPI_ID: index + 1,
            SD_EKPI_NAME: index > 23 ? temp : `${index + 1}--预警指标`,
            SD_EKPI_TYPE: index > 23 ? 2 : 1,
            IsSelect: endId === 3 ? 0 : index % 3 === 0 ? 1 : 0,
            ORDER_NO: index > 23 ? index - 23 : index + 1
          };
        })
    }
  ]
};

// 用户管理--角色设置
export default {
  route: "/User/Jurisdiction",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok",
      Data: qaUserinfo
    },
    post: {
      Code: 0,
      Msg: "ok"
    }
  }
};
