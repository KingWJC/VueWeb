const qaSeniorSearch = {
  TotalRecord: 154,

  Data: [
    {
      Depts: [
        {
          DEPT_CODE: "1",
          DEPT_NAME: "科室名称科室名称科室名称科室名称科室名称1"
        },
        {
          DEPT_CODE: "2",
          DEPT_NAME: "科室名称2"
        },
        {
          DEPT_CODE: "3",
          DEPT_NAME: "科室名称3"
        }
      ],
      Sds: [
        {
          SD_ID: "病种ID1",
          SD_CODE: "病种编码1",
          SD_NAME: "病种名称1病种名称1病种名称1病种名称1病种名称1"
        },
        {
          SD_ID: "病种ID2",
          SD_CODE: "病种编码2",
          SD_NAME: "病种名称2"
        },
        {
          SD_ID: "病种ID3",
          SD_CODE: "病种编码3",
          SD_NAME: "病种名称3"
        }
      ],
      Doctors: [
        {
          DOCTOR_CODE: "医生1编号",
          DOCTOR_NAME:
            "医生1姓名医生1姓名医生1姓名医生1姓名医生1姓名医生1姓名医生1姓名"
        },
        {
          DOCTOR_CODE: "医生2编号",
          DOCTOR_NAME: "医生2姓名"
        },
        {
          DOCTOR_CODE: "医生3编号",
          DOCTOR_NAME: "医生3姓名"
        }
      ],
      TimeRange: ["2017-06-09", "2017-11-04"],
      SuspRateRange: [10, 87],
      // 查询总数
      TotalResult: 160,
      Patients: [
        {
          SD_CPAT_NO: "IS_I_17588752_20",
          PATIENT_NO: "No-2016101237",
          PATIENT_ID: "Id-2016101237",
          PATIENT_NAME: "患者姓名1",
          // 性别, 男 女 未知
          GENDER_NAME: "女",
          BIRTH_DATE: "2016-09-19",
          DEPT_NAME: "科室名称1",
          DOCTOR_CODE: "doc1",
          DOCTOR_NAME: "医生(名称)1",
          SD_NAME: "病种名称1",
          SD_ID: "病种ID1",
          // 可疑率
          SuspRate: "23",
          // 原因反馈率
          RsnRate: "10",
          // 入院时间
          IN_DATE: "2016-07-20",
          // 出院时间
          OUT_DATE: "2016-09-05",
          IsFavDoctor: true,
          IsFavPatient: false
        },
        {
          SD_CPAT_NO: "IS_I_17588753||2",
          PATIENT_NO: "No-2016101238",
          PATIENT_ID: "Id-2016101238",
          PATIENT_NAME: "患者姓名2",
          // 性别, 男 女 未知
          GENDER_NAME: "女",
          BIRTH_DATE: "2016-09-19",
          DEPT_NAME: "科室名称2",
          DOCTOR_CODE: "doc2",
          DOCTOR_NAME: "医生(名称)2",
          SD_NAME: "病种名称2",
          SD_ID: "病种ID2",
          // 可疑率
          SuspRate: "10",
          // 原因反馈率
          RsnRate: "4",
          // 入院时间
          IN_DATE: "2016-10-20",
          // 出院时间
          OUT_DATE: "2016-11-05",
          IsFavDoctor: true,
          IsFavPatient: true
        },
        {
          SD_CPAT_NO: "IS_I_17588754",
          PATIENT_NO: "No-2016101239",
          PATIENT_ID: "Id-2016101239",
          PATIENT_NAME: "患者姓名3",
          // 性别, 男 女 未知
          GENDER_NAME: "男",
          BIRTH_DATE: "2016-09-19",
          DEPT_NAME: "科室名称3科室名称3科室名称3科室名称3科室名称3",
          DOCTOR_CODE: "doc3",
          DOCTOR_NAME: "医生(名称)3医生(名称)医生(名称)医生(名称)",
          SD_NAME: "病种名称3病种名称3病种名称3病种名称3病种名称3病种名称3",
          SD_ID: "病种ID3",
          // 可疑率
          SuspRate: "30",
          // 原因反馈率
          RsnRate: "40",

          IN_DATE: "2016-03-20",
          // 出院时间
          OUT_DATE: "2016-05-05",
          IsFavDoctor: false,
          IsFavPatient: false
        },
        {
          SD_CPAT_NO: "IS_I_17588755_4",
          PATIENT_NO: "No-1600027580",
          PATIENT_ID: "Id-1600027580",
          PATIENT_NAME: "患者姓名4",
          // 性别, 男 女 未知
          GENDER_NAME: "女",
          BIRTH_DATE: "2016-09-19",
          DEPT_NAME: "科室名称4",
          DOCTOR_CODE: "doc4",
          DOCTOR_NAME: "医生(名称4)",
          SD_NAME: "病种名称4",
          SD_ID: "病种ID4",
          // 可疑率
          SuspRate: "50",
          // 原因反馈率
          RsnRate: "20",
          // 入院时间
          IN_DATE: "2016-04-10",
          // 出院时间
          OUT_DATE: "2016-03-25",
          IsFavDoctor: false,
          IsFavPatient: true
        }
      ]
    }
  ]
};

export default {
  route: "/HospDeptPatient",

  verbs: {
    post: {
      Code: 0,
      Msg: "Ok!",
      Data: qaSeniorSearch
    }
  }
};
