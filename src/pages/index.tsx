import type { Query } from '@favware/graphql-pokemon';
import { request } from 'graphql-request'
import useSWR from 'swr'

type GraphQLPokemonResponse<K extends keyof Omit<Query, '__typename'>> = Record<
  K,
  Omit<Query[K], '__typename'>
>;

const query = `
{
  getPokemon(pokemon: pikachu) {
      sprite
      num
      species
      color
  }
}
`

const fetcher = (query: string) => request<GraphQLPokemonResponse<'getPokemon'>>('https://graphqlpokemon.favware.tech/v7', query).then(data => {
  console.log(data)

  return data
})

export default function Pages() {
  const { data } = useSWR<GraphQLPokemonResponse<'getPokemon'>>(query, fetcher)

  return (
    <div>
      <p>TOP Page</p>
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}
