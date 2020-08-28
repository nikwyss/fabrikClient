import ApiService from "src/utils/xhr"
import {mapGetters, mapActions} from 'vuex'
import AssemblyMixin from "src/pages/Assembly/mixins/assembly"
// import assembly from "src/pages/Assembly/mixins/assembly"

export default {
  
  mixins: [AssemblyMixin],
  data() {
    return {
      is_loaded: false,
      checked_sync_state:false
    }
  },
  
  computed: {
    containerID: function() {
      return(this.$route.params.containerID)
    },
    
    container: function() {
      console.assert(this.assembly)
      
      if(!this.containerID) {
        return(null)
      }
      
      if(!this.assemblyIdentifier) {
        return(null)
      }
      
      // has contentree already be cached in the vues store??
      var container = this.get_assembly_container({
        assemblyIdentifier: this.assemblyIdentifier, 
        containerID: this.containerID})
        if(!container) {
          // Not yet loaded. please wait
          return(null)
        }
        
        console.assert(container)
        
        return(container)
      },
      
      contenttree: function() {
        
        if(!this.containerID) {
          return(null)
        }
        
        if(!this.assemblyIdentifier) {
          return(null)
        }
        
        // has contentree already be cached in the vues store??
        var contenttree = this.get_contenttree(this.containerID)
        
        // // TODO: reload container data to check last modification date.
        if(contenttree) {
          
          //     // Retrieve once the version of the API
          //     // to ensure, that the local tree is up to date...
          //     this.retrieveContainer()
          
          //     // return cached version. (dont wait until data are up to date...)
          return(contenttree)
        }
        
        // no cache version exists: load the full tree...
        this.retrieveContentTree()
        return(null)
      },
      
      startingContentID: function() {
        if (this.$route.params.contentID!==undefined) {
          return(Number(this.$route.params.contentID))
        }
        
        return(null)
      },
      
      starting_content: function() {
        if(this.startingContentID) {
          console.log("starting content found")
          return(this.contenttree.entries[this.startingContentID])
        }
        return(null)
      },
      
      ...mapGetters({ 
        get_assembly_container: 'assemblystore/get_assembly_container',
        get_contenttree: 'contentstore/get_contenttree'
      })
    },
    
    methods: {
      
      retrieveContentTree() {
        console.log("Retrieve contenttree")
        
        // Load container data (to check sync status)
        console.assert(this.assemblyIdentifier)
        let url = process.env.VUE_APP_APISERVER_URL+'/assembly/' + this.assemblyIdentifier + '/container/' + this.containerID + '/contenttree/'
        ApiService.get(url).then(
          response => {
            // update
            console.log('save full contenttree to cache.')
            console.assert ('OK' in response.data)
            console.assert ('contenttree' in response.data)
            this.add_or_update_contenttree({containerID: this.containerID, contenttree: response.data.contenttree})
          }
          )
          
          // this.checked_sync_state = true
        },
        
        filter_question_entries: function(nodes) {
          var QUESTION_ENTRIES = ['QUESTION']
          var local_contenttree = this.contenttree
          let filtered = nodes.filter(
            item => QUESTION_ENTRIES.includes(local_contenttree.entries[item.id].content.type)
          )
          return(filtered)
        },
          
        filter_comment_entries: function(nodes) {
          var COMMENT_ENTRIES = ['COMMENT']
          var local_contenttree = this.contenttree
          let filtered = nodes.filter(
            item => COMMENT_ENTRIES.includes(local_contenttree.entries[item.id].content.type)
          )
          return(filtered)
        },
            
            // syncstorecontent: function (data) {
          //     console.log("syncstorecontent")
          
          //     // if response contains a full version of the container then replace it in the cache
          //     if ("contenttree" in data) {
          //         console.log("save full contenttree to cache.")
          //         this.add_or_update_contenttree({containerID: this.containerID, contenttree: data.contenttree})
          //     }
          // },
          
          
          // // CHECK STATE OF LOADED TREE
          // checkSyncStatus: function(contenttree, container) {
          //     console.log("Is out of date? CACHE STATUS")
          //     // Load container data (to check sync status)
          //     console.assert(container)
          //     console.assert(contenttree)
          //     // TODO: check if user_id has changed!
          //     if(!container  ||
          //             // vuex_cached_version.contenttree.structure===undefined ||
          //             container.entries===undefined ||
          //             container.access_date===undefined ||
          //             container.access_sub===undefined ||
          //             this.$root.oauth_sub != container.accessed_sub ||
          //             container.date_last_tree_modification > container.access_date) {
          
          //        // console.log("RE-RETRIEVE ARGUMENT TREE.")
          //         return(false)
          //     }
          //     return(true)
          // },
          
          ...mapActions({
            add_or_update_contenttree: 'contentstore/add_or_update_contenttree'
          }),
        }
      }
