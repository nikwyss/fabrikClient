<script>
// HorizontalBar,
import { mixins,  HorizontalBar } from "vue-chartjs";
import Chart from 'chart.js'

export default {
  extends: HorizontalBar,
  mixins: [mixins.reactiveProp],
  props: ["options"],
  mounted() {
    
    // Chart.defaults.global.defaultFontColor = 'red';
    Chart.defaults.global.defaultFontFamily = 'Open Sans'
    Chart.defaults.global.defaultFontSize = 15
    // Chart.defaults.global.defaultFontFamily = 'Open Sans';
    
    this.renderChart(this.chartData, this.options);
  }
};
</script>