
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
          :disable="enabledAnchors && !enabledAnchors.includes(item.anchor)"
          :class="{hidden: (item.visible && !item.visible())}"
          :style="selectedItemsAnchor.includes(item.anchor) ? selectedStyle : ''"
          @click="$root.scrollToAnchor(item.anchor)"
          v-ripple
        >

          <q-item-section class="lt-md">
            <q-icon
              dense
              :name="selectedItemAnchor==item.anchor ? 'mdi-checkbox-blank-circle' : 'mdi-checkbox-blank-circle-outline'"
            >
              <q-tooltip
                anchor="center left"
                self="center right"
                :offset="[10, 10]"
                content-class="tooltip"
              >{{item.label}}</q-tooltip>
            </q-icon>
          </q-item-section>

          <q-item-section class="gt-sm">
            <q-item-label>{{item.label}}</q-item-label>
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

import { colors } from "quasar";
const { changeAlpha } = colors;

const { offset } = dom;

export default {
  name: "SideMenu",
  props: ["items"],
  data() {
    return {
      scrollSelectedItemAnchor: null,
      fixedSelectedItemAnchor: null,
      enabledAnchors: null,
      // step: null,
    };
  },
  computed: {
    selectedItemAnchor() {
      return this.fixedSelectedItemAnchor
        ? this.fixedSelectedItemAnchor
        : this.scrollSelectedItemAnchor;
    },

    selectedItemsAnchor() {
      // it is possible that two are selected: onclick event!
      return [this.fixedSelectedItemAnchor, this.scrollSelectedItemAnchor];
    },

    selectedStyle() {
      const color = this.public_profile ? this.public_profile.CO : "grey";
      return `background-color: ${color}; color:#fff;`;
    },

    itemAnchors() {
      return this.items.map((item) => item.anchor);
    },

    ...mapGetters({
      public_profile: "publicprofilestore/get_public_profile",
    }),

    // profileColorWithAlpha() {
    //   return changeAlpha(this.public_profile.CO, 0.7);
    // },
  },
  methods: {
    onScroll(info) {
      this.scrollSelectedItemAnchor = this.getSelectedItemAnchor();
    },

    getEnabledAnchors() {
      const anchors = this.itemAnchors;
      return anchors.filter((anchor) => !!document.getElementsByName(anchor));
    },

    refresh() {
      this.enabledAnchors = this.getEnabledAnchors();
    },

    getSelectedItemAnchor() {
      const anchors = JSON.parse(JSON.stringify(this.itemAnchors));
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
    if (this.items?.length && this.items[0].anchor) {
      // console.log(this.items[0]);
      this.scrollSelectedItemAnchor = this.items[0].anchor;
      this.enabledAnchors = this.getEnabledAnchors();
    }
  },
};
</script>