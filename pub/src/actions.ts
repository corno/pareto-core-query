import * as _pinternals from 'pareto-core-internals'
import * as _pi from 'pareto-core-interface'
import { __query_result } from './query_result'


export namespace dictionaryx {

    export const parallel = <Result, Error, Entry_Error>(
        dictionary: _pi.Dictionary<_pi.Query_Result<Result, Entry_Error>>,
        aggregate_errors: _pi.Transformer<_pi.Dictionary<Entry_Error>, Error>,

    ): _pi.Query_Result<_pi.Dictionary<Result>, Error> => {
        return __query_result((on_success, on_error) => {
            let has_errors = false
            const errors_builder = _pinternals.create_asynchronous_dictionary_builder<Entry_Error>()
            const results_builder = _pinternals.create_asynchronous_dictionary_builder<Result>()

            _pinternals.create_asynchronous_processes_monitor(
                (monitor) => {
                    dictionary.map(($, key) => {
                        monitor['report process started']()
                        $.__extract_data(
                            ($) => {
                                results_builder['add entry'](key, $)
                                monitor['report process finished']()
                            },
                            ($) => {
                                has_errors = true
                                errors_builder['add entry'](key, $)
                                monitor['report process finished']()
                            },
                        )
                    })
                },
                () => {
                    if (has_errors) {
                        on_error(aggregate_errors(errors_builder['get dictionary']()))
                    } else {
                        on_success(results_builder['get dictionary']())
                    }
                }
            )
        })
    }
}

export const direct_result = <Result, Error>(
    result: Result,
): _pi.Query_Result<Result, Error> => {
    return __query_result((on_success, on_error) => {
        on_success(result)
    })
}

export const direct_error = <T, E>(
    $: E
): _pi.Query_Result<T, E> => {
    return __query_result((on_value, on_error) => {
        on_error($)
    })
}
