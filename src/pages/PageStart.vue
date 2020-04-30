<template>
  <q-page>
    <q-carousel
      v-model="slide"
      keep-alive
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      infinite
      control-color="white"
      class="h-full"
    >
      <q-carousel-slide
        v-for="(instance, index) in getInstancesAsArray"
        :key="index"
        :name="instance.instance_id"
        class="p-0"
      >
        <bridge-button
          :instance="instance"
        />
      </q-carousel-slide>
    </q-carousel>
  </q-page>
</template>

<script>
import BridgeButton from 'components/BridgeButton'
import { mapGetters } from 'vuex'

export default {
  name: 'PageStart',
  components: {
    BridgeButton
  },
  data () {
    return {
      slide: ''
    }
  },
  computed: {
    ...mapGetters('msladapter', ['getInstancesAsArray'])
  },
  created () {
    this.slide = this.getInstancesAsArray[0].instance_id
  }
}
</script>

<style scoped>
</style>
