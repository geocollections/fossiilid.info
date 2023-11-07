<template>
  <div>
    <slot v-if="$props.elLength < 4" />
    <div class="vue-foldable" v-else>
      <div
        class="vue-foldable-container"
        :style="{ maxHeight: currentMaxHeight + 100 + 'px' }"
        ref="container"
      >
        <slot
          name="view-more"
          :toggle="toggle"
          :collapsed="collapsed"
          v-if="!collapsed"
        >
          <div
            class="vue-foldable-view-more"
            :class="{ collapsed: collapsed }"
            @click="toggle"
            v-if="reachThreshold"
          >
            <UButton
              :icon="
                collapsed
                  ? 'i-heroicons-chevron-down'
                  : 'i-heroicons-chevron-up'
              "
              variant="outline"
              size="xl"
            >
              {{ collapsed ? $t("main.btnViewMore") : $t("main.btnViewLess") }}
            </UButton>
          </div>
        </slot>
        <slot />
      </div>

      <div
        :class="{ collapsed: collapsed }"
        class="vue-foldable-mask"
        v-if="!noMask"
      ></div>

      <slot name="view-more" :toggle="toggle" :collapsed="collapsed">
        <div
          class="vue-foldable-view-more mt-3 mb-3"
          style="text-align: center"
          :class="{ collapsed: collapsed }"
          @click="toggle"
          v-if="reachThreshold"
        >
          <span class="vue-foldable-text">
            <UButton
              :icon="
                collapsed
                  ? 'i-heroicons-chevron-down'
                  : 'i-heroicons-chevron-up'
              "
              variant="outline"
              size="xl"
            >
              {{ collapsed ? $t("main.btnViewMore") : $t("main.btnViewLess") }}
            </UButton>
          </span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
const DEFAULT_VISUAL_HEIGHT = 200;

export default defineNuxtComponent({
  name: "Foldable",
  props: {
    elLength: {
      type: Number,
      default: 1,
    },
    minHeight: {
      type: Number,
      default: DEFAULT_VISUAL_HEIGHT,
    },
    height: {
      type: [Number, String],
      default: DEFAULT_VISUAL_HEIGHT,
    },

    once: {
      type: Boolean,
      default: false,
    },

    async: {
      type: Boolean,
      default: false,
    },

    timeout: {
      type: Number,
      default: 3000,
    },

    noMask: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    let height = this.height;
    if (typeof this.height === "number" && this.height < this.minHeight) {
      height = this.minHeight;
    }
    return {
      collapsed: true,
      currentMaxHeight: height,
      threshold: height,
      reachThreshold: true,
      percentageMode:
        typeof this.height === "string" && this.height.indexOf("%") !== -1,
      percentage: null,
    };
  },

  created() {
    if (this.percentageMode) {
      this.percentage = parseInt(this.threshold.replace("%", "").trim()) / 100;
    } else if (typeof this.height === "string") {
      this.currentMaxHeight = this.threshold = DEFAULT_VISUAL_HEIGHT;
    }
  },

  mounted() {
    if (this.$props.elLength < 4) return;
    this.handleMount();

    // Temporary hack since this.$nextTick still cannot ensure all the sub components rendered.
    // See: https://vuejs.org/v2/api/#mounted
    setTimeout(this.handleMount, 50);
    // this.$nextTick(function () {
    //     this.handleMount()
    // })

    if (this.async) {
      onElementHeightChange({
        el: this.$refs.container,
        callback: this.handleMount,
        timeout: this.timeout,
      });
    }
  },

  methods: {
    handleMount() {
      const contentHeight = this.$refs.container.scrollHeight;
      this.calculateThreshold(contentHeight);
      this.checkReachThresfold(contentHeight);
    },

    checkReachThresfold(contentHeight) {
      this.reachThreshold = contentHeight > this.threshold;
    },

    calculateThreshold(contentHeight) {
      if (this.percentageMode) {
        let calculatedHeight = contentHeight * this.percentage;
        if (calculatedHeight < this.minHeight) {
          calculatedHeight = this.minHeight;
        }
        this.currentMaxHeight = calculatedHeight;
        this.threshold = calculatedHeight;
      }
    },

    toggle() {
      this.collapsed = !this.collapsed;
      if (this.collapsed) {
        this.currentMaxHeight = this.threshold;
      } else {
        // explicitly set max height so that it can be transitioned
        this.currentMaxHeight = this.$refs.container.scrollHeight;
        if (this.once) {
          this.reachThreshold = false;
        }
      }
    },
  },
});

function onElementHeightChange({ el, callback, timeout }) {
  let oldHeight = el.scrollHeight,
    newHeight;
  let poller;
  let interval = 100;
  let count = 0;
  let maxCount = timeout / interval;

  function unit() {
    count++;
    newHeight = el.scrollHeight;
    if (oldHeight !== newHeight) {
      callback(newHeight);
      if (poller) {
        clearTimeout(poller);
      }
    }
    oldHeight = newHeight;
    if (count <= maxCount) {
      poller = setTimeout(unit, interval);
    }
  }

  unit();
}
</script>

<style lang="scss">
.vue-foldable {
  position: relative;
  .vue-foldable-container {
    overflow: hidden;
  }
  .vue-foldable-mask {
    position: absolute;
    bottom: 30px;
    height: 50px;
    width: 100%;
    background: transparent;
    pointer-events: none;
  }
  .vue-foldable-view-more {
    width: 100%;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    color: #eb3812;
    font-weight: bolder;
    .vue-foldable-icon {
      width: 22px;
      transform: rotate(180deg);
      transition: transform 0.3s;
      vertical-align: middle;
    }
    .vue-foldable-text {
      vertical-align: middle;
    }
    &.collapsed {
      .vue-foldable-icon {
        transform: rotate(0deg);
      }
    }
  }
}
</style>
