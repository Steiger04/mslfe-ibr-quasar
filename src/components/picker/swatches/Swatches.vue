<template>
  <q-carousel
    v-bind:value="slide!==null ? slide:slide_"
    @input="slide=$event"
    transition-prev="fade"
    transition-next="fade"
    swipeable
    keep-alive
    animated
    infinite
    height="auto"
    class="column"
  >
    <template
      v-for="(group, $idx) in palette">
      <q-carousel-slide
        v-if="$idx%4===0"
        :key="$idx"
        :name="$idx/4"
        class="row justify-center tw-overflow-y-auto tw-border-green-400 tw-border-0"
      >
        <div
          v-for="n in 4"
          :key="n"
          class="col-auto"
        >
          <div
            v-for="c in palette[$idx+n-1]" :key="c"
            :style="{background: c}"

            class="column justify-center tw-mb-1 tw-mr-1 tw-w-16 tw-h-12 tw-rounded-lg"
            :class="['vc-swatches-color-it', {'vc-swatches-color--white': c === '#FFFFFF' }]"
            @click="handlerClick(c)">
            <div class="self-center" v-show="equal(c)">
              <q-icon
                size="md"
                name="img:statics/img/ioBroker.svg"/>
            </div>
          </div>
        </div>
      </q-carousel-slide>
    </template>
  </q-carousel>
</template>

<script>
import material from 'material-colors'
import colorMixin from 'components/picker/mixin/color'
import streamMixin from 'components/picker/mixin/stream'

var colorMap = [
  'red', 'pink', 'purple', 'deepPurple',
  'indigo', 'blue', 'lightBlue', 'cyan',
  'teal', 'green', 'lightGreen', 'lime',
  'yellow', 'amber', 'orange', 'deepOrange'
]
var colorLevel = ['900', '800', '700', '600', '500', '400', '300', '200', '100']
var defaultColors = (() => {
  var colors = []
  colorMap.forEach((type) => {
    var typeColor = []
    if (type.toLowerCase() === 'black' || type.toLowerCase() === 'white') {
      typeColor = typeColor.concat(['#000000', '#FFFFFF'])
    } else {
      colorLevel.forEach((level) => {
        const color = material[type][level]
        typeColor.push(color.toUpperCase())
      })
    }
    colors.push(typeColor)
  })
  return colors
})()

export default {
  name: 'Swatches',
  mixins: [colorMixin, streamMixin],
  props: {
    palette: {
      type: Array,
      default () {
        return defaultColors
      }
    }
  },
  data () {
    return {
      slide: null
    }
  },
  computed: {
    slide_ () {
      for (const [index, colors] of this.palette.entries()) {
        if (colors.indexOf(this.val.hex.toUpperCase()) !== -1) {
          return Math.trunc(index / 4)
        }
      }

      return 0
    }
  },
  methods: {
    equal (color) {
      return color.toLowerCase() === this.colors.hex.toLowerCase()
    },
    handlerClick (c) {
      this.colorChange({
        hex: c,
        source: 'hex'
      })
      // this.$emit('color-change', c.toLowerCase())
      this.setComponentState({ state: 'rgb', value: c.toLowerCase() })
    }
  },
  activated () {
    this.slide = null
  }
}
</script>
