import { mapActions, mapState } from 'vuex'
import { from, of, timer, zip } from 'rxjs'
import {
  endWith, exhaust, exhaustMap, map, share, startWith, switchMap, throttleTime, takeUntil, repeat
  , delay
} from 'rxjs/operators'

export default {
  props: ['zoneId'],
  computed: {
    ...mapState('msladapter', {
      statevalues: state => state.ids.statevalues,
      debounceTime: state => state.debounceTime
    }),
    bindColor () {
      return this.statevalues[this.zoneId + '.rgb'].val
    }
  },
  methods: {
    ...mapActions('msladapter', ['setStateFromClient'])
  },
  domStreams: ['touchstart$', 'touchend$'],
  subscriptions () {
    const setComponentState$ = this.$createObservableMethod('setComponentState').pipe(
      throttleTime(this.debounceTime))

    this.$subscribeTo(setComponentState$, payload => this.setStateFromClient({
      id: this.zoneId + `.${payload.state}`,
      val: payload.value
    }))

    // -----------------------------------------------------------------------------------------------------

    const allZonesOn$ = this.$createObservableMethod('allZonesOn')

    const makeAllZonesOn$ = allZonesOn$.pipe(
      map(arr => of(arr)),
      exhaust(),
      exhaustMap(arr => zip(from(arr).pipe(endWith(false)),
        timer(0, 200), (item, i) => item)),
      share())

    const disabled$ = makeAllZonesOn$.pipe(
      map(v => {
        if (v !== false) return true
        return false
      }), startWith(false))

    this.$subscribeTo(makeAllZonesOn$, zoneOn => {
      if (zoneOn !== false) {
        this.setStateFromClient({ id: zoneOn[0] + '.on', val: zoneOn[1] })
      }
    })

    // -----------------------------------------------------------------------------------------------------

    const whiteButtons$ = this.touchstart$.pipe(
      throttleTime(250),
      switchMap(val => timer(0, 250)
        .pipe(
          map(v => val.data),
          takeUntil(this.touchend$.pipe(delay(230))),
          endWith(false)
        )),
      repeat()
    )

    this.$subscribeTo(whiteButtons$, payload => {
      if (payload !== false) {
        this.setStateFromClient({
          id: this.zoneId + `.${payload}`,
          val: true
        })
      }
    })

    // -----------------------------------------------------------------------------------------------------

    return { disabled$, whiteButtons$ }
  }
}
