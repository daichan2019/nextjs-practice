import type { Query } from '@favware/graphql-pokemon';
import { request } from 'graphql-request'
import useSWR from 'swr'
import { GetServerSideProps } from 'next'

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

export type Page1Props = {
  data: GraphQLPokemonResponse<'getPokemon'>
}

export default function Page1({data}: Page1Props ) {
  return (
    <div>
      <p>TOP Page</p>
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Page1Props> = async (context) => {
  const data = await request<GraphQLPokemonResponse<'getPokemon'>>('https://graphqlpokemon.favware.tech/v7', query)

  // const data = 'hoge'

  return {
    props: { data }
  }
}