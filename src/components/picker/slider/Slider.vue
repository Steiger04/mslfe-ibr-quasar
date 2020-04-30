<template>
  <div>
    <div class="vc-slider">
      <div class="vc-slider-hue-warp">
        <hue v-model="colors" @change="hueChange"/>
      </div>
      <div class="vc-margin">
        <template v-for="(offset, index) in swatches">
          <div
            v-if="index%4==0"
            :key="index"
            class="vc-slider-swatches"
            :data-index="index"
          >
            <div
              v-for="n in 4"
              :key="n"
              class="vc-slider-swatch"
              @click="handleSwClick(index+n-1, swatches[index+n-1])"
            >
              <div
                class="vc-slider-swatch-picker"
                :class="{'vc-slider-swatch-picker--active': swatches[index+n-1] == activeOffset}"
                :style="{background: 'hsl(' + colors.hsl.h + ', 50%, ' + (swatches[index+n-1] * 100) + '%)'}"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import colorMixin from 'components/picker/mixin/color'
import streamMixin from 'components/picker/mixin/stream'
import hue from 'components/picker/slider/util/Hue.vue'

export default {
  name: 'Slider',
  components: {
    hue
  },
  mixins: [colorMixin, streamMixin],
  props: {
    // eslint-disable-next-line vue/require-default-prop
    direction: String
  },
  data () {
    return {
      swatches: ['.95', '.90', '.85', '.80', '.75', '.70', '.60', '.55', '.50', '.45', '.40', '.35', '.30', '.20', '.15', '.10']
    }
  },
  computed: {
    activeOffset () {
      if (Math.round(this.colors.hsl.s * 100) >= 0.49) {
        // TODO: Warum 0.49 ok?
        return Math.round(this.colors.hsl.l * 100) / 100
      }
      return 0
    }
  },
  methods: {
    hueChange (data) {
      this.colorChange(data)
      this.setComponentState({ state: 'rgb', value: this.colors.hex.toLowerCase() })
    },
    handleSwClick (index, offset) {
      this.colorChange({
        h: this.colors.hsl.h,
        s: 0.5,
        l: offset,
        source: 'hsl'
      })
      this.setComponentState({ state: 'rgb', value: this.colors.hex.toLowerCase() })
    }
  }
}
</script>

<style>
  .vc-margin {
    margin-top: 30px;
  }

  .vc-slider {
    position: relative;
    width: auto;
  }

  .vc-slider-hue-warp {
    height: 54px;
    position: relative;
    border-radius: 6px;
  }

  .vc-slider-hue-warp .vc-hue-picker {
    width: 28px;
    height: 50px;
    border-radius: 6px;
    transform: translate(-14px, 1px);
    background-color: transparent;
    box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.6);
  }

  .vc-slider-swatches {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .vc-slider-swatch {
    justify-content: space-around;
    margin: 0.4rem;
    width: 60px;
    height: 45px;
  }

  .vc-slider-swatch .vc-slider-swatch-picker {
    border-radius: 6px;
  }

  .vc-slider-swatch-picker {
    cursor: pointer;
    height: 40px;
  }

  .vc-slider-swatch-picker--active {
    transform: scale(1.15);
    box-shadow: 0px 0px 4px 3px rgba(160, 174, 192, 1.0);
  }
</style>
