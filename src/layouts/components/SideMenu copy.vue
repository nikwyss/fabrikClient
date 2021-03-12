
<template>
  <div v-if="items">
    <div
      class="z-max "
      style="top: 200px; right:0px; position:fixed; background: rgba(255,255,255,0.8)"
    >
      <!-- <q-menu content-class="bg-purple text-white" auto-close> -->
      <q-list>
        <q-item
          v-for="item in items"
          :key="item.label"
          clickable
          :class="{hidden: (item.visible && !item.visible())}"
          :style="$q.screen.gt.sm && selectedItems.includes(item.anchor) ? selectedStyle : ''"
          @click="$root.scrollToAnchor(item.anchor)"
          v-ripple
        >

          <q-item-section class="lt-md">

            <q-radio
              dense
              @input="$root.scrollToAnchor"
              :value="selectedItem"
              :val="item.anchor"
            >
              <q-tooltip
                anchor="center left"
                self="center right"
                :offset="[10, 10]"
                content-class="tooltip"
              >{{item.label}}</q-tooltip>
            </q-radio>
          </q-item-section>

          <q-item-section class="gt-sm">
            <q-item-label style="width: 150px">{{item.label}}</q-item-label>
            <q-item-label
              v-if="item.caption"
              style="width: 150px"
              caption
            >{{item.caption}}</q-item-label>

          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-scroll-observer
      @scroll="onScroll"
      debounce="300"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { dom } from "quasar";
const { offset } = dom;

export default {
  name: "SideMenu",
  props: ["items"],
  data() {
    return {
      scrollSelectedItem: null,
      fixedSelectedItem: null,
    };
  },
  computed: {
    selectedItem() {
      return this.fixedSelectedItem
        ? this.fixedSelectedItem
        : this.scrollSelectedItem;
    },

    selectedItems() {
      // it is possible that two are selected: onclick event!
      return [this.fixedSelectedItem, this.scrollSelectedItem];
    },

    selectedStyle() {
      const color = this.public_profile ? this.public_profile.CO : "grey";
      return `background-color: ${color}; color:#fff;`;
    },

    ...mapGetters({
      public_profile: "publicprofilestore/get_public_profile",
    }),
  },
  methods: {
    onScroll(info) {
      this.scrollSelectedItem = this.getSelectedItem();
    },

    getSelectedItem() {
      const anchors = this.items.map((item) => item.anchor);
      anchors.reverse();
      var selected = anchors.find((anchor) => {
        const dom = document.getElementsByName(anchor);
        return (
          dom &&
          dom?.item(0) &&
          offset(dom.item(0)).top < this.$root.headerOffset + 350
        );
      });
      if (!selected) {
        return anchors[anchors.length - 1];
      }
      return selected;
    },
  },

  mounted() {
    if (this.items) {
      this.scrollSelectedItem = this.items[0].anchor;
    }
  },
};
</script>