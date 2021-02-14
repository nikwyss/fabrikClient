<template>
    <ChartBarBase v-if="this.public_profile" :chart-data="barChartData" :options="barChartOptions" style="width:100%; max-width:700px;"/>
</template>


<script>
import ChartBarBase from "./ChartBarBase";
import { mapGetters } from "vuex"
import {linebreaker} from "./lib"

export default {
  components: {
    ChartBarBase
  },

  computed: {
    
    linebreakLabels() {
      const labels = this.labels.map(lab => linebreaker(lab))
      return (labels)
    },

    barChartData() {
      return {
        labels: this.linebreakLabels,
        datasets: [
          {
            label: this.public_profile?.U,
            backgroundColor: "rgb(54, 162, 235, 0.55)",
            data: this.personalData
          }
          // {
          //   label: 'Alle Teillnehmende',
          //   backgroundColor: "rgb(12, 114, 15, 0.25)",
          //   data: this.populationData
          // }
        ]
      }
    },

    ...mapGetters({
      public_profile: "publicprofilestore/get_public_profile"
    })

  },
  
  // 'populationData', 
  props: ['personalData', 'labels'],
  data: () => ({
    barChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
          xAxes: [{
              ticks: {
                suggestedMin: 0,
                suggestedMax: 100,
                scaleShowLabels:false,
              }
          }],
          yAxes: [{
              ticks: {
                  scaleShowLabels:false,
                  mirror: true
              }
          }]
      },
      responsive: true,
      layout: {
          padding: {
              left: 5,
              right: 5,
              top: 5,
              bottom: 5
          }
      },
      //   scale: {
      //     angleLines: {
      //         display: true
      //     },
          // pointLabels: {
          //   // display: false
          //   fontSize: '11'
          // },
      //     ticks: {
      // //         // maxTicksLimit: 7,
              
      // //         stepSize: 25,
      //         suggestedMin: 0,
      //         suggestedMax: 100
      //     }
      // }
    }
  })
}
</script>
