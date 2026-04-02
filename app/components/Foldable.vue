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
    if (typeof this.height === "number" && this.height < this.minHeight)
      height = this.minHeight;

    return {
      collapsed: true,
      currentMaxHeight: height,
      threshold: height,
      reachThreshold: true,
      percentageMode:
        typeof this.height === "string" && this.height.includes("%"),
      percentage: null,
    };
  },

  created() {
    if (this.percentageMode)
      this.percentage = Number.parseInt(this.threshold.replace("%", "").trim()) / 100;
    else if (typeof this.height === "string")
      this.currentMaxHeight = this.threshold = DEFAULT_VISUAL_HEIGHT;
  },

  mounted() {
    if (this.$props.elLength < 4)
      return;
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
        if (calculatedHeight < this.minHeight)
          calculatedHeight = this.minHeight;

        this.currentMaxHeight = calculatedHeight;
        this.threshold = calculatedHeight;
      }
    },

    toggle() {
      this.collapsed = !this.collapsed;
      if (this.collapsed) {
        this.currentMaxHeight = this.threshold;
      }
      else {
        // explicitly set max height so that it can be transitioned
        this.currentMaxHeight = this.$refs.container.scrollHeight;
        if (this.once)
          this.reachThreshold = false;
      }
    },
  },
});

function onElementHeightChange({ el, callback, timeout }) {
  let oldHeight = el.scrollHeight;
  let newHeight;
  let poller;
  const interval = 100;
  let count = 0;
  const maxCount = timeout / interval;

  function unit() {
    count++;
    newHeight = el.scrollHeight;
    if (oldHeight !== newHeight) {
      callback(newHeight);
      if (poller)
        clearTimeout(poller);
    }
    oldHeight = newHeight;
    if (count <= maxCount)
      poller = setTimeout(unit, interval);
  }

  unit();
}
</script>

<template>
  <div>
    <slot v-if="elLength < 4" />
    <div v-else class="vue-foldable">
      <div
        ref="container"
        class="vue-foldable-container"
        :style="{ maxHeight: `${currentMaxHeight + 100}px` }"
      >
        <slot
          v-if="!collapsed"
          name="view-more"
          :toggle="toggle"
          :collapsed="collapsed"
        >
          <div
            v-if="reachThreshold"
            class="vue-foldable-view-more"
            :class="{ collapsed }"
            @click="toggle"
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
        v-if="!noMask"
        :class="{ collapsed }"
        class="vue-foldable-mask"
      />

      <slot name="view-more" :toggle="toggle" :collapsed="collapsed">
        <div
          v-if="reachThreshold"
          class="vue-foldable-view-more mb-3 mt-3"
          style="text-align: center"
          :class="{ collapsed }"
          @click="toggle"
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
