import servConn from 'src/ws/conn-neu.js'

export const setAllMslids = ({ commit }, ids) => {
  commit('setAllMslids', ids)
}

export const setInstances = ({ commit }, instances) => {
  commit('setInstances', instances)
}

export const setState = ({ commit }, payload) => {
  commit('setState', payload)
}

export const setStateFromClient = ({ commit }, payload) => {
  commit('setStateFromClient', payload)
  servConn.setState(payload.id, payload.val)
}

export const setActivePicker = ({ commit }, payload) => {
  commit('setActivePicker', payload)
}

export const setActionMode = ({ commit }, payload) => {
  commit('setActionMode', payload)
}

export const setDebounceTime = ({ commit }, payload) => {
  commit('setDebounceTime', payload)
}
