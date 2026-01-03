import * as _pinternals from 'pareto-core-internals'
import * as _pi from 'pareto-core-interface'

/**
 * these functions coming from core-internals should be exposed for query development
 */
export {

    cc,
    au,
    ss,

} from "pareto-core-internals"

export namespace optional {

    export const set = _pinternals.optional_set
    export const not_set = _pinternals.optional_not_set
}

export namespace list {

    export const literal = _pinternals.list_literal

}

export namespace dictionary {   

    export const literal = _pinternals.dictionary_literal

}

export * from "./actions"
export * from "./query_function"
export * from "./query_result"
export * from "./query"
