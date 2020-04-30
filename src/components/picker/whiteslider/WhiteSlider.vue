<template>
  <div class="row justify-around">
    <div class="col-shrink items-stretch tw-my-10 tw-px-2 tw-py-5 tw-bg-gray-800 tw-rounded tw-border-0">
      <vue-slider
        style="height: 100%; padding: 0 0;"
        v-bind="optionsBrightness"
        v-model="brightness"/>
      <div class="row justify-center tw-text-gray-500">{{ brightness.toFixed(0) }} %</div>
    </div>
    <div v-if="isWhiteTemperatureZone(zoneId)"
      class="col-shrink items-stretch tw-my-10 tw-px-2 tw-py-5 tw-bg-gray-800 tw-rounded tw-border-0">
      <vue-slider
        style="height: 100%; padding: 0 0;"
        v-bind="optionsWhiteTemperature"
        v-model="whiteTemperature"/>
      <div class="row justify-center tw-text-gray-500">{{ whiteTemperature }} K</div>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import { mapGetters } from 'vuex'
import gradient from 'tinygradient'
import color from 'tinycolor2'
import streamMixin from 'components/picker/mixin/stream'

export default {
  name: 'whiteSlider',
  mixins: [streamMixin],
  components: {
    VueSlider
  },
  data () {
    return {
      optionsBrightness: {
        tooltip: 'none',
        interval: 5,
        direction: 'btt',
        width: 90,
        dotSize: [74, 34],
        processStyle: {
          backgroundColor: 'transparent'
        },
        railStyle: {
          borderRadius: '5px',
          backgroundImage: this.brightnessGradient.css('linear', 'to top')
        },
        dotStyle: {
          borderRadius: '5px',
          backgroundColor: 'transparent',
          boxShadow: '1px 1px 8px 1px rgba(0, 0, 0, 0.6)'
        }
      },
      optionsWhiteTemperature: {
        tooltip: 'none',
        min: 2700,
        max: 6500,
        interval: 100,
        direction: 'btt',
        width: 90,
        dotSize: [74, 34],
        processStyle: {
          backgroundColor: 'transparent'
        },
        railStyle: {
          borderRadius: '5px',
          backgroundImage: 'linear-gradient(to top, #fffeeb 0%, #c7d1ff 100%)',
          boxShadow: 'inset 0.5px 0.5px 3px 1px rgba(255,255,255,.36)'
        },
        dotStyle: {
          borderRadius: '5px',
          backgroundColor: 'transparent',
          boxShadow: '1px 1px 8px 1px rgba(0, 0, 0, 0.6)'
        }
      }
    }
  },
  watch: {
    brightness () {
      if (this.isLight) {
        this.optionsBrightness.dotStyle.boxShadow = '1px 1px 8px 1px rgba(0, 0, 0, 0.6)'
      } else {
        this.optionsBrightness.dotStyle.boxShadow = '1px 1px 8px 1px rgba(255, 255, 255, 0.6)'
      }
    }
  },
  computed: {
    ...mapGetters('msladapter', ['isWhiteTemperatureZone']),
    brightness: {
      get () {
        return this.statevalues[this.zoneId + '.brightness'].val
      },
      set (newVal) {
        this.setComponentState({ state: 'brightness', value: newVal })
      }
    },
    whiteTemperature: {
      get () {
        return this.statevalues[this.zoneId + '.whiteTemperature'].val
      },
      set (newVal) {
        this.setComponentState({ state: 'whiteTemperature', value: newVal })
      }
    },
    isLight () {
      return color(this.brightnessGradient.rgbAt(this.brightness / 100)).isLight()
    }
  },
  beforeCreate () {
    this.brightnessGradient = gradient(['#000000', '#ffffff'])
  }
}
</script>
