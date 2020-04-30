import { getColorFromZone } from './getters'
import color from 'tinycolor2'

export const setAllMslids = (state, ids) => {
  state.ids = Object.assign({}, ids)

  Object.assign(state.ids.zones, Object.fromEntries(Object.entries(state.ids.zones).map(zone => {
    const zoneColor = getColorFromZone(state)(zone[0])
    const grey = color(zoneColor).greyscale().toString()

    const isNightMode = state.ids.statevalues[zone[0] + '.nightMode'].val
    const zoneType = zone[1].common['mslZoneType']

    let allowedPicker,
      picker,
      actionMode

    if (zoneType === 'white') {
      allowedPicker = ['whiteButtons']
      picker = 'whiteButtons'
      actionMode = 'whiteMode'
    } else {
      allowedPicker = ['wheel', 'slider', 'swatches', 'whiteSlider']
      if (zoneColor === grey && zoneColor !== '#000000') {
        picker = 'whiteSlider'
        actionMode = 'whiteMode'
      } else {
        picker = 'wheel'
        if (zoneColor === '#000000' && isNightMode) {
          actionMode = 'nightMode'
        } else {
          actionMode = 'none'
        }
      }
    }
    zone[1] = Object.assign({}, zone[1], { picker: picker, allowedPicker: allowedPicker, actionMode: actionMode })

    return zone
  })))

  Object.setPrototypeOf(state.ids.groups, {
    * [Symbol.iterator] () {
      const tmp = Object.entries(this)
        .sort((z1, z2) => {
          const n1 = z1[1].common.name
          const n2 = z2[1].common.name

          if (n1 === n2) return 0
          if (n1 > n2) return 1
          return -1
        })

      for (let entry of tmp) {
        yield entry
      }
    }
  })

  Object.setPrototypeOf(state.ids.zones, {
    * [Symbol.iterator] () {
      const tmp = Object.entries(this)
        .sort((z1, z2) => {
          const n1 = z1[1].common.name
          const n2 = z2[1].common.name

          if (n1 === n2) return 0
          if (n1 > n2) return 1
          return -1
        })

      for (let entry of tmp) {
        yield entry
      }
    }
  })
}

export const setInstances = (state, instances) => {
  Object.assign(state.ids, { instances: instances })

  Object.setPrototypeOf(state.ids.instances, {
    * [Symbol.iterator] () {
      const tmp = Object.entries(this).sort(([v1], [v2]) => (v1.split('.')[1] - v2
        .split('.')[1])).map(instance => instance[1])

      for (let entry of tmp) {
        yield entry
      }
    }
  })
}

export const setState = (state, payload) => {
  if (state.ids.statevalues[payload.id].val !== payload.state.val) {
    Object.assign(state.ids.statevalues[payload.id], payload.state)
  }
}

export const setStateFromClient = (state, payload) => {
  if (state.ids.statevalues[payload.id].val !== payload.val) {
    Object.assign(state.ids.statevalues[payload.id], { val: payload.val })
  }
}

export const setActivePicker = (state, payload) => {
  Object.assign(state.ids.zones[payload.zoneId], { picker: payload.picker })
}

export const setActionMode = (state, payload) => {
  Object.assign(state.ids.zones[payload.zoneId], { actionMode: payload.actionMode })
}

export const setDebounceTime = (state, payload) => {
  state.debounceTime = payload
}
