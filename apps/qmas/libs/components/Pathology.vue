<script>
  import Axios from "axios";
  import MedicalRecords from "./MedicalRecords";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "pathology",

    mixins: [MedicalRecords],

    methods: {
      // 点击父表格的某个 出现对应的子表格的内容
      subIns(PathologyId, index) {
        this.curItem = index;

        // 病理记录  子表格
        if (this.patientObj.SD_CPAT_NO !== undefined) {
          Axios.get(resolveApiRoute("pathology-description", {
            SdCpatNo: this.patientObj.SD_CPAT_NO,
            PathologyId: PathologyId
          }), {
            params: {
              // I 住院E 急诊O 门诊 9 未知
              InFlag: this.patientObj.IN_FLAG
            }
          }).then((res) => {
            // get body data
            if (res.data.Code === 0) {
              if (res.data.Data.Data.length > 0) {
                this.insAll = res.data.Data.Data[0];
              } else {
                this.insAll = null;
              }

              if (
                this.nulls(this.insAll.REPORT_OBJECTIVE) &&
                this.nulls(this.insAll.REPORT_SUBJECTIVE)
              ) {
                // 为空时不展示数据
                this.isSubInsShowData = false;
              } else {
                // 不为空展示数据
                this.isSubInsShowData = true;
              }
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          }, () => {
            this.$showNotice("网络异常", "failed");
          });
        }
      }
    }
  };
</script>
