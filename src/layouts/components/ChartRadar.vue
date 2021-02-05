<template>
    <ChartRadarBase :chart-data="radarChartData" :options="radarChartOptions" style="width:100%; max-width:700px;"/>
</template>


<script>
import ChartRadarBase from "./ChartRadarBase";
import { mapGetters } from "vuex"

export default {
  components: {
    ChartRadarBase
  },

  computed: {
    
    linebreakLabels() {
      const labels = this.labels.map(lab => this.linebreaker(lab))
      return (labels)
    },

    radarChartData() {
      return {
        labels: this.linebreakLabels,
        datasets: [
          {
            label: this.public_profile.U,
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

  methods: {

    linebreaker(label) {
      const maxlen = 20
      if (label.length <= maxlen) {
        return (label)
      }
    
      const words = label.split(" ")
      const startlines = []
      const endlines = []
      var start = ''
      var end = ''
      while(words.length > 0) {

        // add first word to 'start' string
        let first = words.shift()
        start += ' ' + first

        // add last word to end string
        if (words.length > 0) {
          let last = words.pop()
          end = last + ' ' + end
        }

        // if start or end string are overlength, put them into startlines resp. endlines lists
        if (start.length > maxlen) {
          startlines.push(start)
          start = ''
        }
        if (end.length > maxlen) {
          endlines.unshift(end)
          end = ''
        }
        // end loop
      }

      // assign the rest either to the startlines list (or both)
      if ((start+end).length > maxlen) {
          startlines.push(start)
          endlines.unshift(end)
      } else{
          startlines.push(start + " " + end)
      }

      return (startlines.concat(endlines))
    }
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
