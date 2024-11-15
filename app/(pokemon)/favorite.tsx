import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { MMKV } from "react-native-mmkv";

export interface IFavoritePokemon {
  name: string;
  id: number;
}

const storage = new MMKV();

export default function FavoriteScreen() {
  const [favoritePokemons, setFavoritePokemons] = useState<IFavoritePokemon[]>(
    []
  );

  useEffect(() => {
    const fetchFavorites = () => {
      const favorites = storage.getString("favorites") || "[]";
      const favoritesArray = JSON.parse(favorites) as IFavoritePokemon[];
      setFavoritePokemons(favoritesArray);
    };

    fetchFavorites();
  }, []);

  const renderFavoriteItem = ({ item }: { item: IFavoritePokemon }) => {
    const imageURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;

    return (
      <Link href={`./${item.name}`}>
        <View style={styles.card}>
          <Image source={{ uri: imageURL }} style={styles.pokemonImage} />
          <Text style={styles.pokemonName}>{item.name}</Text>
        </View>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favoritePokemons}
        keyExtractor={(item) => item.name}
        renderItem={renderFavoriteItem}
        numColumns={2}
      />
    </View>
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
  card: {
    width: 164.42,
    height: 221,
    maxWidth: 164.42,
    maxHeight: 221,
    flex: 1,
    padding: 10,
    margin: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A8A8A8",
    alignItems: "center",
  },
  pokemonName: {
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: "600",
  },
  pokemonImage: {
    width: 148,
    height: 177,
    marginBottom: 5,
  },
});
