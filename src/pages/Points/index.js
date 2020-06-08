import React, { useEffect, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Alert
} from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import * as Location from 'expo-location'
import api from '../../services/api'

import styles from './style'

function Points() {
  const [items, setItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [initialPosition, setInitialPosition] = useState([0, 0])
  const [points, setPoints] = useState([])
  const navigation = useNavigation()
  const route = useRoute()

  const handleNavigateBack = () => {
    navigation.goBack()
  }

  const handleNavigateToDetail = id => {
    navigation.navigate('Detail', { id })
  }

  const handleSelectItem = id => {
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if (alreadySelected >= 0) {
      setSelectedItems(selectedItems.filter(item => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert('Precisamos de sua permissão para obter a localização')

        return
      }

      const { coords } = await Location.getCurrentPositionAsync()

      setInitialPosition([coords.latitude, coords.longitude])
    }

    loadPosition()
  }, [])

  useEffect(() => {
    api.get('items').then(({ data }) => setItems(data))
  }, [])

  useEffect(() => {
    api
      .get('points', {
        params: {
          city: route.params.city,
          uf: route.params.uf,
          items: selectedItems
        }
      })
      .then(({ data }) => setPoints(data))
  }, [selectedItems])

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        <Text style={styles.title}>Bem vindo</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta
        </Text>
        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014
              }}
            >
              {points.map(point => (
                <Marker
                  key={String(point.id)}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude
                  }}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{ uri: point.image }}
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 30 }}
        >
          {items.map(item => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {}
              ]}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.5}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  )
}

export default Points
