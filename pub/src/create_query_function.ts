import * as _pi from 'pareto-core-interface'

import { __create_query } from "./create_query"

export const create_query_function = <Result, Error, Parameters, Queries>(
    handler: (
        $p: Parameters,
        $q: Queries,
    ) => _pi.Query_Result<Result, Error>
): _pi.Query_Function<_pi.Query<Result, Error, Parameters>, Queries> => {
    return ($q) => ($p, error_transformer) => handler($p, $q).deprecated_transform_error(error_transformer)
}