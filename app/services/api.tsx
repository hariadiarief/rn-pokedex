import { z } from "zod";
import { Zodios, makeApi } from "@zodios/core";
import { ZodiosHooks } from "@zodios/react";

const baseUrl = "https://pokeapi.co/api/v2";

const pokemonListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
});

const pokemonDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  base_experience: z.number(),
  abilities: z.array(
    z.object({
      ability: z.object({
        name: z.string(),
        url: z.string(),
      }),
      is_hidden: z.boolean(),
      slot: z.number(),
    })
  ),
  cries: z.object({
    latest: z.string(),
    legacy: z.string(),
  }),
  forms: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
  game_indices: z.array(
    z.object({
      game_index: z.number(),
      version: z.object({
        name: z.string(),
        url: z.string(),
      }),
    })
  ),
  held_items: z.array(z.unknown()),
  location_area_encounters: z.string(),
  moves: z.array(
    z.object({
      move: z.object({
        name: z.string(),
        url: z.string(),
      }),
      version_group_details: z.array(
        z.object({
          level_learned_at: z.number(),
          move_learn_method: z.object({
            name: z.string(),
            url: z.string(),
          }),
          version_group: z.object({
            name: z.string(),
            url: z.string(),
          }),
        })
      ),
    })
  ),
  types: z.array(
    z.object({
      slot: z.number(),
      type: z.object({
        name: z.string(),
        url: z.string(),
      }),
    })
  ),
  sprites: z.object({
    front_default: z.string().nullable(),
    back_shiny: z.string().nullable(),
    back_default: z.string().nullable(),
    front_shiny: z.string().nullable(),
  }),
});

const apiSchema = makeApi([
  {
    method: "get",
    path: "/pokemon",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().positive().optional(),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().optional(),
      },
    ],
    alias: "getPokemonList",
    response: pokemonListSchema,
  },
  {
    method: "get",
    path: "/pokemon/:name",
    alias: "getPokemonDetail",
    response: pokemonDetailSchema,
  },
]);

const zodios = new Zodios(baseUrl, apiSchema);
export const zodiosHooks = new ZodiosHooks("pokeapi", zodios);
