import * as _pi from 'pareto-core-interface'


type Queryer<Output, Error, Input> = (
    $: Input,
) => _pi.Query_Result<Output, Error>

export const __query = <Result, Error, Parameters, Resources>(
    handler: Queryer<Result, Error, Parameters>,
): _pi.Query<Result, Error, Parameters> => {
    return (parameters, error_transformer) => {
        return handler(parameters).deprecated_transform_error(error_transformer)
    }
}