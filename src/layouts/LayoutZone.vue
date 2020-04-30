<template>
  <transition enter-active-class="animated fadeInRight">
    <q-layout view="HHH LpR FFF">
      <q-header
        class="bg-black"
      >
        <bridge-status
          ref="bridgestatus"
          class="tw-mt-1 tw-mb-2"
          :instance="instances[instanceId]"
        />
      </q-header>

      <q-page-container>
        <keep-alive>
          <router-view/>
        </keep-alive>
      </q-page-container>

      <q-footer
        class="bg-black"
      >
        <zone-on-off
          class="tw-mx-2 tw-mb-2"
          :picker="zones[zoneId].picker"
          :zoneCommonName="zones[zoneId].common.name"
          :zoneId="zoneId"
          :left=true
        />
      </q-footer>
    </q-layout>
  </transition>
</template>

<script>
import BridgeStatus from 'components/bridge/BridgeStatus'
import ZoneOnOff from 'components/zone/ZoneOnOff'
import { mapState } from 'vuex'

export default {
  name: 'LayoutZone',
  components: {
    BridgeStatus,
    ZoneOnOff
  },
  props: ['instanceId', 'zoneId'],
  computed: {
    ...mapState('msladapter', {
      instances: state => state.ids.instances,
      zones: state => state.ids.zones
    })
  },
  beforeRouteUpdate (to, from, next) {
    if (to.meta.store.state.msladapter.ids.zones[to.params.zoneId] === undefined) {
      next({ path: from.path, replace: true })
    } else {
      next()
    }
  },
  activated () {
    this.$refs.bridgestatus.visible = true
  }
}
</script>
