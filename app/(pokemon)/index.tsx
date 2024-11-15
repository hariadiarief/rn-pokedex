import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { zodiosHooks } from "../services/api";
import { useForm, Controller } from "react-hook-form";

interface IPokemon {
  name: string;
  url: string;
}

export default function HomeScreen() {
  const { control, watch } = useForm({
    defaultValues: {
      keyword: "",
    },
  });
  const keyword = watch("keyword");

  const { isLoading: pokemonListIsPending, data: pokemonList } =
    zodiosHooks.useQuery("/pokemon", { queries: { limit: 100000, offset: 0 } });

  const pokemonListByKeyword =
    keyword && pokemonList
      ? pokemonList.results.filter((pokemon: IPokemon) =>
          pokemon.name.toLowerCase().includes(keyword.toLowerCase())
        )
      : [];

  const renderPokemonItem = ({
    item,
  }: {
    item: { name: string; url: string };
  }) => {
    const pokemonId = item.url.split("/").filter(Boolean).pop();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

    return (
      <Link href={`./${item.name}`}>
        <View style={styles.card}>
          <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
          <Text style={styles.pokemonName}>{item.name}</Text>
        </View>
      </Link>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Controller
          control={control}
          name="keyword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name..."
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        {!pokemonListIsPending && (
          <FlatList
            data={
              keyword
                ? pokemonListByKeyword
                : pokemonList && pokemonList.results
            }
            keyExtractor={(item) => item.name}
            renderItem={renderPokemonItem}
            numColumns={2}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: "space-between",
  },
  searchInput: {
    padding: 20,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  card: {
    width: 164.42,
    height: 221,
    maxWidth: 164.42,
    maxHeight: 221,
    flex: 1,
    flexDirection: "column",
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A8A8A8",
    alignItems: "center",
  },
  pokemonImage: {
    width: 148,
    height: 177,
    marginBottom: 5,
  },
  pokemonName: {
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: 600,
  },
});
