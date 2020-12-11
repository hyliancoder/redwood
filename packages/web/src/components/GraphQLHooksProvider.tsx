import type { DocumentNode } from 'graphql'

export interface GraphQLHookOptions {
  variables?: Record<string, any>
}
export interface OperationResult<TData = any> {
  data?: TData
  loading: boolean
  error?: Error
}

export type MutationOperationResult<TData = any> = [
  (options?: any) => Promise<TData>,
  OperationResult<TData>
]

export interface GraphQLHooks {
  useQuery: (
    query: DocumentNode,
    options?: GraphQLHookOptions
  ) => OperationResult
  useMutation: (
    mutation: DocumentNode,
    options?: GraphQLHookOptions
  ) => MutationOperationResult
}
export const GraphQLHooksContext = React.createContext<GraphQLHooks>({
  useQuery: () => {
    throw new Error(
      'You must register a useQuery hook via the `GraphQLHooksProvider`'
    )
  },
  useMutation: () => {
    throw new Error(
      'You must register a useMutation hook via the `GraphQLHooksProvider`'
    )
  },
})

/**
 * GraphQLHooksProvider stores standard `useQuery` and `useMutation` hooks for Redwood
 * that can be mapped to your GraphQL library of choice's own `useQuery`
 * and `useMutation` implementation.
 *
 * @todo Let the user pass in the additional type for options.
 */
export const GraphQLHooksProvider: React.FunctionComponent<{
  useQuery: (
    query: DocumentNode,
    options?: GraphQLHookOptions
  ) => OperationResult
  useMutation: (
    mutation: DocumentNode,
    options?: GraphQLHookOptions
  ) => MutationOperationResult
}> = ({ useQuery, useMutation, children }) => {
  return (
    <GraphQLHooksContext.Provider
      value={{
        useQuery,
        useMutation,
      }}
    >
      {children}
    </GraphQLHooksContext.Provider>
  )
}

export function useQuery<TData = any>(
  query: DocumentNode,
  options?: GraphQLHookOptions
): OperationResult<TData> {
  return React.useContext(GraphQLHooksContext).useQuery(query, options)
}

export function useMutation<TData = any>(
  mutation: DocumentNode,
  options?: GraphQLHookOptions
): MutationOperationResult<TData> {
  return React.useContext(GraphQLHooksContext).useMutation(mutation, options)
}
