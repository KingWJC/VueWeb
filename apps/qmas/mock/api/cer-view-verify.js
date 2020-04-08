const cerInfo = {
  CERTIFICATE_ID: "1",
  APPLY_ID: "12",
  CERTIFICATE_CODE: "7981",
  CERTIFICATE_CONTENT: "",
  STATE: "4",
  FINISH_TIME: "2020-01-22 07:00:02",
  ORG_ID: "18",
  ORG_NAME: "*****医院****科室"
};

export default {
  route: "/Certificate/VerifyCourseIsAllOver",

  verbs: {
    get: {
      Code: 0,
      Msg: "",
      Data: cerInfo
    }
  }
};
