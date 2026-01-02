import * as _pi from 'pareto-core-interface'

import { __query } from "./query"

export const query_function = <Result, Error, Parameters, Query_Resources>(
    handler: (
        $p: Parameters,
        $q: Query_Resources,
    ) => _pi.Query_Result<Result, Error>
): _pi.Query_Function<_pi.Query<Result, Error, Parameters>, Query_Resources> => {
    return ($q) => ($p, error_transformer) => handler($p, $q).deprecated_transform_error(error_transformer)
}