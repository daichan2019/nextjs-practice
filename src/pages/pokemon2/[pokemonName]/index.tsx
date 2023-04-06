import type { Query } from '@favware/graphql-pokemon';
import { request } from 'graphql-request'
import useSWR, {unstable_serialize, SWRConfig} from 'swr';
import { GetStaticPaths, GetStaticProps } from 'next'

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

type Variables = {
  pokemon: string
}

const fetcher = (query: string, variables: Variables) => request<GraphQLPokemonResponse<'getFuzzyPokemon'>, Variables>('https://graphqlpokemon.favware.tech/v7', query, variables)

type PokemonNameProps = {
  pokemon: string
}

function PokemonName({pokemon}: PokemonNameProps) {
  const { data } = useSWR<GraphQLPokemonResponse<'getFuzzyPokemon'>>([query, {pokemon}], ([query, variables]: [string, Variables]) => fetcher(query, variables));

  return (
    <div>
      <p>TOP Page</p>
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}

export type PageProps = Pick<PokemonNameProps, 'pokemon'> & {
  fallback: {
    [key: string]: GraphQLPokemonResponse<'getFuzzyPokemon'>
  }
}

export default function Page({fallback, pokemon}: PageProps) {
  return (
    <SWRConfig value={{fallback}}>
      <PokemonName pokemon={pokemon} />
    </SWRConfig>
  )
}

type Params = {
  pokemonName: string;
}

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    paths: [{ params: { pokemonName: 'pikachu' } }],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<PageProps, Params> = async ({params}) => {
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
    props: {
      fallback: {
        [unstable_serialize([query, {pokemon: pokemonName}])]: data,
      },
      pokemon: pokemonName
    }
  }
}