import * as _pi from 'pareto-core-internals'

export type I_Async_Monitor = {
    readonly 'report process started': () => void
    readonly 'report process finished': () => void
}

/**
 * this function helps in keeping track of ongoing async operations
 * async operations are registered and when finished reported as such.
 * when all ongoing operations are finished the onEnd callback is called
 * 
 * this function is specifically useful for async map functions
 * 
 * @param callback this callback creates a scope within which the counter is provided
 * @param onEnd this callback will be called when all ongoing operations are finished
 */
export function create_asynchronous_processes_monitor(
    monitoring_phase: ($: I_Async_Monitor) => void,
    on_all_finished: () => void
): void {

    let counter = 0

    /*
     * we need to keep track of if the registration phase is ended or not.
     * it can happen that the counter reaches 0 during the registration phase, specifically if there is no real async calls being made
     * in that case the reportFinished counter is als called during the registration phase.
     * If that happens there should not yet be a call to onEnd().
     */
    let registration_phase_ended = false
    let on_all_finished_has_been_called = false

    function checkStatus() {
        if (registration_phase_ended) {

            if (counter === 0) {
                if (on_all_finished_has_been_called === true) {
                    _pi.panic("CORE: already ended")
                }
                on_all_finished_has_been_called = true
                on_all_finished()
            }
        }
    }
    monitoring_phase({
        'report process started': () => {
            if (on_all_finished_has_been_called) {
                _pi.panic("CORE: async call done after context is ready")
            }
            counter += 1

        },
        'report process finished': () => {
            if (counter === 0) {
                _pi.panic("CORE: decrement while counter is 0")
            }
            counter -= 1
            checkStatus()
        },
    })
    registration_phase_ended = true
    checkStatus()
}
