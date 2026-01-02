import * as _pi from 'pareto-core-interface'
import { __query_result } from './query_result'


type Queryer<Output, Error, Input> = (
    $: Input,
) => _pi.Query_Result<Output, Error>

export const __query = <Result, Error, Parameters, Resources>(
    handler: Queryer<Result, Error, Parameters>,
): _pi.Query<Result, Error, Parameters> => {
    return (parameters, error_transformer) => {
        return __query_result((on_success, on_error) => {
            handler(parameters).__extract_data(
                on_success,
                (e) => {
                    on_error(error_transformer(e))
                },
            )
        })
    }
}