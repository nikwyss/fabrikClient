<script>
import { Radar, mixins } from "vue-chartjs";
import Chart from 'chart.js'

export default {
  extends: Radar,
  mixins: [mixins.reactiveProp],
  props: ["options"],
  mounted() {
    
    // Chart.defaults.global.defaultFontColor = 'red';
    Chart.defaults.global.defaultFontFamily = 'Open Sans'
    Chart.defaults.global.defaultFontSize = 15
    // Chart.defaults.global.defaultFontFamily = 'Open Sans';
    
    // console.log(this.options)
    this.renderChart(this.chartData, this.options);
  }
};
</script>