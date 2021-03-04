
<template>
  <div>
    <div
      class="z-max bg-white"
      style="top: 200px; right:0px; position:fixed "
    >
      <!-- <q-menu content-class="bg-purple text-white" auto-close> -->
      <q-list>
        <q-item
          v-for="item in items"
          :key="item.label"
          clickable
          :style="$q.screen.width >= $q.screen.sizes.md && selectedItems.includes(item.anchor) ? selectedStyle : ''"
          @click="scrollToAnchor(item.anchor)"
          v-ripple
        >

          <q-item-section class="lt-md">
            <q-radio
              @input="scrollToAnchor"
              :value="selectedItem"
              :val="item.anchor"
            />
          </q-item-section>

          <q-item-section class="gt-sm">{{item.label}}</q-item-section>
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
import { scroll } from "quasar";
const { setScrollPosition, getScrollTarget } = scroll;

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

    scrollToAnchor(anchor) {
      const dom = document.getElementsByName(anchor);
      const ele = dom?.item(0);
      if (ele) {
        this.fixedSelectedItem = anchor;
        const offset =
          ele.offsetTop - ele.scrollHeight - this.$root.headerOffset;

        const target = getScrollTarget(ele);
        const duration = 300;
        setScrollPosition(target, offset, duration);
        setTimeout(() => (this.fixedSelectedItem = null), duration);
      }
    },
  },

  mounted() {
    this.scrollSelectedItem = this.items[0].anchor;
  },
};
</script>