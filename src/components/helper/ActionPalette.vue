<template>
  <div>
    <q-fab
      ref="qfab"
      type="buttton"
      @before-show="$emit('actionpalette-show')"
      @before-hide="$emit('actionpalette-hide')"
      flat
      :style="{ color: zoneColor }"
      :icon="icon"
      :active-icon="actionItems.includes('whiteMode') ?  'fas fa-cog' : 'fas fa-palette'"
      direction="left">

      <q-fab-action
        class="tw-p-0"
        v-for="(actionItem, idx) in actionItems"
        :key="idx"
        :style="'padding: 0px; margin: 0px -14px;'"
        @click="selectModeAndPicker(actionItem)"
        icon=""
        flat
        unelevated
      >
        <q-img
          contain
          width="62px"
          :ratio="4/3"
          basic
          :src="`statics/img/msl-${actionItem.toLowerCase()}-alpha.png`"/>
      </q-fab-action>
    </q-fab>
  </div>
</template>

<script>
import color from 'tinycolor2'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ActionPalette',
  props: ['actionItems', 'zoneColor', 'zoneId'],
  data () {
    return {}
  },
  computed: {
    ...mapGetters('msladapter', ['getActivePickerFromZone']),
    activePicker () {
      return this.getActivePickerFromZone(this.zoneId)
    },
    grey () {
      return color(this.zoneColor).greyscale().toString()
    },
    ...mapState('msladapter', {
      actionMode (state) {
        return state.ids.zones[this.zoneId].actionMode
      },
      activePicker (state) {
        return state.ids.zones[this.zoneId].picker
      },
      isWhiteMode (state) {
        if (this.zoneType === 'white') return true

        return state.ids.statevalues[this.zoneId + '.whiteMode'].val
      },
      isNightMode (state) {
        return state.ids.statevalues[this.zoneId + '.nightMode'].val
      },
      zoneType (state) {
        return state.ids.zones[this.zoneId].common['mslZoneType']
      }
    }),
    icon () {
      if (this.actionMode === 'whiteMode') {
        return 'fas fa-sun'
      }
      if (this.actionMode === 'nightMode') {
        return 'fas fa-moon'
      }

      return 'fas fa-square'
    }
  },
  watch: {
    isNightMode () {
      if (this.isNightMode && this.actionMode !== 'nightMode') {
        this.setActionMode({ zoneId: this.zoneId, actionMode: 'nightMode' })
      }

      if (!this.isWhiteMode && !this.isNightMode) {
        this.setActionMode({ zoneId: this.zoneId, actionMode: 'none' })
      }
    },
    isWhiteMode () {
      if (this.isWhiteMode && this.actionMode !== 'whiteMode') {
        this.setActionMode({ zoneId: this.zoneId, actionMode: 'whiteMode' })
      }

      if (!this.isWhiteMode && !this.isNightMode) {
        this.setActionMode({ zoneId: this.zoneId, actionMode: 'none' })
      }
    },
    zoneColor () {
      if (this.zoneColor !== this.grey) {
        this.setActionMode({ zoneId: this.zoneId, actionMode: 'none' })

        if (this.activePicker === 'whiteSlider') {
          this.setActivePicker({ zoneId: this.zoneId, picker: 'wheel' })
        }
      } else {
        if (this.zoneColor !== '#000000') {
          this.setActionMode({ zoneId: this.zoneId, actionMode: 'whiteMode' })
        }
      }
    }
  },
  methods: {
    ...mapActions('msladapter', ['setActivePicker', 'setActionMode']),
    selectModeAndPicker (actionItem) {
      if (actionItem === 'whiteMode' || actionItem === 'nightMode') {
        this.$emit('select-mode', actionItem)
        if (actionItem === 'whiteMode') {
          this.setActivePicker({ zoneId: this.zoneId, picker: 'whiteSlider' })
        }
      } else {
        this.setActivePicker({ zoneId: this.zoneId, picker: actionItem })
      }
    }
  }
}
</script>
