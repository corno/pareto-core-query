import * as _pinternals from 'pareto-core-internals'
import * as _pix from 'pareto-core-interface'
import { create_asynchronous_processes_monitor } from "./create_asynchronous_processes_monitor"
import { __create_query_result } from './create_query_result'


export namespace dictionary {

    export const parallel = <Result, Error, Entry_Error>(
        dictionary: _pix.Dictionary<_pix.Query_Result<Result, Entry_Error>>,
        aggregate_errors: _pix.Transformer<_pix.Dictionary<Entry_Error>, Error>,

    ): _pix.Query_Result<_pix.Dictionary<Result>, Error> => {
        return __create_query_result((on_success, on_error) => {
            let has_errors = false
            const errors_builder = _pinternals.create_asynchronous_dictionary_builder<Entry_Error>()
            const results_builder = _pinternals.create_asynchronous_dictionary_builder<Result>()

            create_asynchronous_processes_monitor(
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

    export const parallel_without_error_aggregation = <Result, Error>(
        $: _pix.Dictionary<_pix.Query_Result<Result, Error>>,
    ): _pix.Query_Result<_pix.Dictionary<Result>, _pix.Dictionary<Error>> => {
        return __create_query_result((on_success, on_error) => {
            let has_errors = false
            const errors_builder = _pinternals.create_asynchronous_dictionary_builder<Error>()
            const results_builder = _pinternals.create_asynchronous_dictionary_builder<Result>()

            create_asynchronous_processes_monitor(
                (monitor) => {
                    $.map(($, key) => {
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
                        on_error(errors_builder['get dictionary']())
                    } else {
                        on_success(results_builder['get dictionary']())
                    }
                }
            )
        })
    }

}

export const fixed = <Result, Error>(
    result: Result,
): _pix.Query_Result<Result, Error> => {
    return __create_query_result((on_success, on_error) => {
        on_success(result)
    })
}

export const raise_error = <T, E>(
    $: E
): _pix.Query_Result<T, E> => {
    return __create_query_result((on_value, on_error) => {
        on_error($)
    })
}
