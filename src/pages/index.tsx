import { useEffect } from 'react';
import type { Query } from '@favware/graphql-pokemon';
import { request, gql } from 'graphql-request'

type GraphQLPokemonResponse<K extends keyof Omit<Query, '__typename'>> = Record<
  K,
  Omit<Query[K], '__typename'>
>;

const query = gql`
{
  getPokemon(pokemon: dragonite) {
      sprite
      num
      species
      color
  }
}
`

export default function Pages() {
  useEffect(() => {
    request<GraphQLPokemonResponse<'getPokemon'>>('https://graphqlpokemon.favware.tech/v7', query).then((data) => console.log(data.getPokemon))
  }, []);

  return (
    <div>
      TOP Page
    </div>
  )
}