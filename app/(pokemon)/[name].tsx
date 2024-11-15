import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { MMKV } from "react-native-mmkv";
import { zodiosHooks } from "../services/api";
import { IFavoritePokemon } from "./favorite";
import { HeartIcon } from "lucide-react-native";
import { ScrollView } from "react-native-gesture-handler";

const storage = new MMKV();

interface IAbility {
  ability: {
    name: string;
  };
}

export default function DetailPokemon() {
  const navigation = useNavigation();

  const { name } = useLocalSearchParams();
  let favorites = JSON.parse(storage.getString("favorites") || "[]");
  const [isFavorite, setIsFavorite] = useState<boolean>(
    !!favorites.find((item: IFavoritePokemon) => item.name === name)
  );

  const { isLoading: pokemonDetailIsPending, data: pokemonDetail } =
    zodiosHooks.useQuery(`/pokemon/:name`, { params: { name: String(name) } });

  const toggleFavorite = () => {
    if (!pokemonDetail) return;
    if (isFavorite) {
      favorites = favorites.filter(
        (item: IFavoritePokemon) => item.name !== name
      );
      storage.set("favorites", JSON.stringify(favorites));
      setIsFavorite(false);
    } else {
      favorites = favorites.concat({
        name: pokemonDetail.name,
        id: pokemonDetail.id,
      });
      storage.set("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const spriteUrls = pokemonDetail
    ? (Object.values(pokemonDetail.sprites).filter(
        (url) => typeof url === "string"
      ) as string[])
    : [];

  if (pokemonDetailIsPending) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  if (!pokemonDetail) {
    return (
      <View style={styles.scrollView}>
        <Text>Pokemon not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      {pokemonDetail.sprites.front_default && (
        <Image
          source={{ uri: pokemonDetail.sprites.front_default }}
          style={styles.pokemonImage}
        />
      )}
      <View style={styles.nameContainer}>
        <Text style={styles.pokemonName}>{pokemonDetail.name}</Text>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteIcon}>
          {isFavorite ? (
            <HeartIcon size={24} color="red" fill="red" />
          ) : (
            <HeartIcon size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.spriteTitle}>Sprite Gallery</Text>
      <View style={styles.spriteGallery}>
        {spriteUrls.map((url, index) => (
          <Image key={index} source={{ uri: url }} style={styles.spriteImage} />
        ))}
      </View>
      <Text style={styles.pokemonInfo}>Abilities:</Text>
      {pokemonDetail.abilities.map((abilityInfo: IAbility) => (
        <Text key={abilityInfo.ability.name} style={styles.pokemonAbility}>
          {abilityInfo.ability.name}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pokemonImage: {
    width: 305,
    height: 236,
    marginBottom: 16,
    marginHorizontal: "auto",
  },
  nameContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
    borderTopColor: "#ddd",
    borderTopWidth: 1,
  },
  pokemonName: {
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "capitalize",
    flex: 1,
  },
  favoriteIcon: {
    padding: 5,
  },
  spriteTitle: {
    paddingLeft: 16,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    alignSelf: "flex-start",
    width: "100%",
  },
  spriteGallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  spriteImage: {
    width: 158,
    height: 115,
    margin: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pokemonInfo: {
    paddingLeft: 16,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    alignSelf: "flex-start",
    width: "100%",
  },
  pokemonAbility: {
    paddingLeft: 16,
    fontSize: 16,
    marginBottom: 5,
    alignSelf: "flex-start",
    textTransform: "capitalize",
  },
});
