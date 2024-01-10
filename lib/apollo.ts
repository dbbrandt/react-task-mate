import { IncomingMessage, ServerResponse } from 'http'
import { useMemo } from 'react'
import {
    ApolloClient,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client'
import resolvers from '../backend/resolvers'
import typeDefs from "../backend/typeDefs";
import merge from 'deepmerge';
const isEqual = require('lodash.isequal');

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

export type ResolverContext = {
    req?: IncomingMessage
    res?: ServerResponse
}

function createIsomorphLink(context: ResolverContext = {}) {
    if (typeof window === 'undefined') {
        const { SchemaLink } = require('@apollo/client/link/schema');
        const { makeExecutableSchema } = require('@graphql-tools/schema');
        const { db } = require('../backend/db');

        const schema = makeExecutableSchema({
            typeDefs,
            resolvers,
        })
        return new SchemaLink({ schema, context: {db}})
    } else {
        const { HttpLink } = require('@apollo/client')
        return new HttpLink({
            uri: '/graphql',
            credentials: 'same-origin',
        })
    }
}

function createApolloClient(context?: ResolverContext) {
    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: createIsomorphLink(context),
        cache: new InMemoryCache(),
    })
}

export function initializeApollo(
    initialState: any = null,
    // Pages with Next.js data fetching methods, like `getStaticProps`, can send
    // a custom context which will be used by `SchemaLink` to server render pages
    context?: ResolverContext
) {
    const _apolloClient = apolloClient ?? createApolloClient(context)

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // get hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract()

        // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
        const data = merge(existingCache, initialState, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray, sourceArray) => [
                ...sourceArray,
                ...destinationArray.filter((d) =>
                    sourceArray.every((s) => !isEqual(d, s))
                ),
            ],
        })

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data)
    }
    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

export function useApollo(initialState: any) {
    return useMemo(() => initializeApollo(initialState), [initialState])
}
