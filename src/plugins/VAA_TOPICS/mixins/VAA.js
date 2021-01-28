// import StageMixin from 'src/mixins/stage'

export default {

  // mixins: [StageMixin],

  computed: {

    sectionsEnabled: function () {
      return ['VAA_TOPICS', 'VAA_QUESTIONS']
    }
  },

  methods: {
    isSectionEnabled(section) {
      return this.sectionsEnabled.includes(section)
    },
    isSectionDisabled(section) {
      return !this.sectionsEnabled.includes(section)
    }
  }
}
