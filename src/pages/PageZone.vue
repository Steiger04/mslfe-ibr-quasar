<template>
  <q-page class="row justify-center items-stretch tw-container tw-mx-auto">
    <div class="col">
      <div class="row justify-center tw-h-full">
        <transition enter-active-class="animated slideInUp">
          <keep-alive>
            <component
              class="bg-black tw-mt-6 tw-mx-4 col"
              :is="picker[activePicker].type"
              v-bind="picker[activePicker].props"
              v-bind:zoneId="zone_Id"/>
          </keep-alive>
        </transition>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import wheel from 'components/picker/wheel/Wheel'
import swatches from 'components/picker/swatches/Swatches'
import slider from 'components/picker/slider/Slider'
import whiteSlider from 'components/picker/whiteslider/WhiteSlider'
import whiteButtons from 'components/picker/whiteButtons/whiteButtons'

export default {
  name: 'PageZone',
  props: ['zoneId'],
  data () {
    return {
      zone_Id: this.zoneId,
      picker: {
        'wheel': {
          type: 'wheelPicker',
          props: {
            width: 330,
            height: 330
          }
        },
        'swatches': {
          type: 'swatchesPicker',
          props: {}
        },
        'slider': {
          type: 'sliderPicker',
          props: {}
        },
        'whiteSlider': {
          type: 'whiteSliderPicker',
          props: {}
        },
        'whiteButtons': {
          type: 'whiteButtonsPicker',
          props: {}
        }
      }
    }
  },
  computed: {
    ...mapState('msladapter', {
      statevalues: state => state.ids.statevalues,
      zones: state => state.ids.zones
    }),
    ...mapGetters('msladapter', ['getActivePickerFromZone']),
    activePicker () {
      return this.getActivePickerFromZone(this.zone_Id)
    }
  },
  methods: {
    ...mapActions('msladapter', ['setStateFromClient'])
  },
  components: {
    wheelPicker: wheel,
    swatchesPicker: swatches,
    sliderPicker: slider,
    whiteSliderPicker: whiteSlider,
    whiteButtonsPicker: whiteButtons
  },
  beforeDestroy () {
    this.colorchange$.unsubscribe()
  },
  beforeUpdate () {
    if (this.zoneId !== undefined) {
      this.zone_Id = this.zoneId
    }
  },
  activated () {
    this.zone_Id = this.zoneId
  }
}
</script>
