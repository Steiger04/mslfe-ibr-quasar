<template>
  <div class="row tw-pb-1">
    <div class="col-shrink">
      <q-btn
        v-show="left"
        icon="fas fa-angle-double-left"
        replace
        class="tw-mr-1 tw-rounded-lg tw-text-gray-500 tw-bg-gray-800"
        style="height: 100%;"
        :to="'/'"
      />
    </div>

    <div class="col">
      <q-slide-item
        left-color="green-6"
        right-color="pink-8"
        class="tw-bg-gray-500 tw-rounded-lg"
        :class="{'tw-bg-gray-700': isLight }"
        @left="details => zoneOn(details, true)"
        @right="details => zoneOn(details, false)"
      >
        <template v-slot:right>
          <q-icon
            name="fas fa-toggle-off"
            size="sm"
          />
        </template>
        <template v-slot:left>
          <q-icon
            name="fas fa-toggle-on"
            size="sm"
          />
        </template>

        <div class="row items-center"
             :class="{'tw-text-gray-400': isLight, 'tw-text-gray-800': !isLight }"
             style="min-height: 3.2rem">
          <div class="col-shrink self-center">
            <transition
              enter-active-class="animated flipInX"
              leave-active-class="animated flipOutX"
            >
              <q-icon
                v-show="palette"
                size="md"
                :color="statevalues[zoneId + '.on'].val === true ? 'green-6' :'pink-8'"
                name="fas fa-lightbulb"
              />
            </transition>
          </div>
          <div class="col">
            <transition
              enter-active-class="animated flipInX"
              leave-active-class="animated flipOutX"
            >
              <div
                class="ellipsis-2-lines tw-ml-2 q-py-md-md md:tw-text-xl tw-text-base tw-tracking-wide tw-font-medium"
                v-show="palette">
                {{ zoneCommonName }}
              </div>
            </transition>
          </div>

          <div class="col-shrink">
            <action-palette
              :class="{ 'tw-pointer-events-none': zoneColor==='#000000' && left}"
              ref="actionpalette"
              @actionpalette-show="palette=false"
              @actionpalette-hide="palette=true"
              @select-mode="setComponentState({ state: $event, value: true })"
              :zoneColor="zoneColor"
              :zoneId="zoneId"
              :actionItems="right ? modePalette : allowedPicker"
            />
          </div>
        </div>
      </q-slide-item>
    </div>

    <div class="col-shrink">
      <q-btn
        v-show="right"
        icon="fas fa-angle-double-right"
        replace
        class=" tw-ml-1 tw-rounded-lg tw-text-gray-500 tw-bg-gray-800"
        style="height: 100%;"
        @click="activePickerChange()"
      />
    </div>
  </div>
</template>

<script>
import color from 'tinycolor2'
import { mapState, mapGetters, mapActions } from 'vuex'
import streamMixin from 'components/picker/mixin/stream'
import actionPalette from 'components/helper/ActionPalette'

export default {
  name: 'ZoneOnOff',
  mixins: [streamMixin],
  components: {
    actionPalette
  },
  props: {
    isPalette: {
      type: Boolean,
      default: true
    },
    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    picker: String,
    zoneCommonName: String
  },
  data () {
    return {
      palette: true
    }
  },
  computed: {
    ...mapState('msladapter', {
      statevalues: state => state.ids.statevalues,
      zones: state => state.ids.zones
    }),
    ...mapGetters('msladapter', ['getColorFromZone', 'getAllowedPickerFromZone']),
    modePalette () {
      if (this.zones[this.zoneId].common['mslZoneType'] === 'white') {
        return ['nightMode']
      }
      return ['nightMode', 'whiteMode']
    },
    allowedPicker () {
      return this.getAllowedPickerFromZone(this.zoneId)
    },
    zoneColor () {
      return this.getColorFromZone(this.zoneId)
    },
    isLight () {
      return color(this.zoneColor).isLight()
    }
  },
  updated () {
    if (this.$refs.actionpalette.$refs.qfab.showing === true && this.zoneColor === '#000000' && this.left === true) {
      this.$refs.actionpalette.$refs.qfab.hide()
    }
  },
  methods: {
    activePickerChange () {
      this.$router.replace(this.zoneId)
    },
    ...mapActions('msladapter', ['setStateFromClient', 'setActivePicker']),
    zoneOn ({ reset }, onoff) {
      this.setComponentState({ state: 'on', value: onoff })
      reset()
    }
  }
}
</script>

<style scoped>

</style>
