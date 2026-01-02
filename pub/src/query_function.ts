import * as _pi from 'pareto-core-interface'

import { __query } from "./query"
import { __query_result } from './query_result'

export const query_function = <Result, Error, Parameters, Query_Resources>(
    handler: (
        $p: Parameters,
        $q: Query_Resources,
    ) => _pi.Query_Result<Result, Error>
): _pi.Query_Function<_pi.Query<Result, Error, Parameters>, Query_Resources> => {
    return ($q) => ($p, error_transformer) => {
        return __query_result((on_success, on_error) => {
            handler($p, $q).__extract_data(
                on_success,
                (e) => {
                    on_error(error_transformer(e))
                },
            )
        })
    }
}