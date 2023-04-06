import type { Query } from '@favware/graphql-pokemon';
import { request } from 'graphql-request'
import { GetStaticPaths, GetStaticProps } from 'next'
import { InferGetServerSidePropsType } from 'next'

type GraphQLPokemonResponse<K extends keyof Omit<Query, '__typename'>> = Record<
  K,
  Omit<Query[K], '__typename'>
>;

const query = `
  query getFuzzyPokemon($pokemon: String!) {
    getFuzzyPokemon(pokemon: $pokemon) {
      sprite
      num
      species
      color
    }
  }
`;

export type PakemonNameProps = {
  data: GraphQLPokemonResponse<'getFuzzyPokemon'>
}

export default function PakemonName({data}: PakemonNameProps) {
  return (
    <div>
      <p>TOP Page</p>
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}

type Params = {
  pokemonName: string;
}

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    paths: [{ params: { pokemonName: 'pikachu' } }],
    fallback: true
  }
}

type Variables = {
  pokemon: string
}

export const getStaticProps: GetStaticProps<PakemonNameProps, Params> = async ({params}) => {
  if (!params) {
    return {
      notFound: true
    }
  }

  const { pokemonName } = params

  const data = await request<GraphQLPokemonResponse<'getFuzzyPokemon'>, Variables>('https://graphqlpokemon.favware.tech/v7', query, {
    pokemon: pokemonName,
  })

  return {
    props: { data },
    revalidate: 60
  }
}