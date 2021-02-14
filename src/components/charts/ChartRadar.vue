<template>
    <ChartRadarBase v-if="this.public_profile" :chart-data="radarChartData" :options="radarChartOptions" style="width:100%; max-width:700px;"/>
</template>


<script>
import ChartRadarBase from "./ChartRadarBase";
import { mapGetters } from "vuex"
import {linebreaker} from "./lib"


export default {
  components: {
    ChartRadarBase
  },

  computed: {
    
    linebreakLabels() {
      const labels = this.labels.map(lab => linebreaker(lab))
      return (labels)
    },

    radarChartData() {
      return {
        labels: this.linebreakLabels,
        datasets: [
          {
            label: this.public_profile?.U,
            backgroundColor: "rgb(54, 162, 235, 0.55)",
            data: this.personalData
          },
          {
            label: 'Alle Teillnehmende',
            backgroundColor: "rgb(12, 114, 15, 0.25)",
            data: this.populationData
          }
        ]
      }
    },

    ...mapGetters({
      public_profile: "publicprofilestore/get_public_profile"
    })
  },

  props: ['personalData', 'populationData', 'labels'],
  data: () => ({
    radarChartOptions: {
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        },
        scale: {
          angleLines: {
              display: true
          },
          pointLabels: {
            // display: false
            fontSize: '11'
          },
          ticks: {
              // maxTicksLimit: 7,
              
              stepSize: 25,
              suggestedMin: 0,
              suggestedMax: 100
          }
      }
    }
  })
}
</script>
