import React, { useState, useEffect } from 'react'
import {
  View,
  ImageBackground,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select'
import ibge from '../../services/ibge'

import logo from '../../assets/logo.png'
import homeBackground from '../../assets/home-background.png'
import styles from './style'

function Home() {
  const [selectedUf, setSelectedUf] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [ufs, setUfs] = useState([])
  const [cities, setCities] = useState([])
  const navigation = useNavigation()

  const handleNavigateToPoints = () => {
    navigation.navigate('Points', { uf: selectedUf, city: selectedCity })
  }

  useEffect(() => {
    ibge.get('estados').then(({ data }) => setUfs(data.map(uf => uf.sigla)))
  }, [])

  useEffect(() => {
    ibge
      .get(`estados/${selectedUf}/municipios`)
      .then(({ data }) => setCities(data.map(city => city.nome)))
  }, [selectedUf])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={homeBackground}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={logo} />
          <Text style={styles.title}>
            Seu marketplace de coleta de resíduos
          </Text>
          <Text style={styles.description}>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
          </Text>
        </View>
        <View style={styles.footer}>
          <RNPickerSelect
            style={{
              inputAndroid: {
                height: 60,
                backgroundColor: '#FFF',
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 24,
                fontSize: 16
              },
              inputIOS: {
                height: 60,
                backgroundColor: '#FFF',
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 24,
                fontSize: 16
              }
            }}
            placeholder={{ label: 'Escolha a UF' }}
            value={selectedUf}
            onValueChange={setSelectedUf}
            items={ufs.map(uf => ({
              label: uf,
              value: uf
            }))}
          />
          <RNPickerSelect
            style={{
              inputAndroid: {
                height: 60,
                backgroundColor: '#FFF',
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 24,
                fontSize: 16
              },
              inputIOS: {
                height: 60,
                backgroundColor: '#FFF',
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 24,
                fontSize: 16
              }
            }}
            placeholder={{ label: 'Escolha a cidade' }}
            value={selectedCity}
            onValueChange={setSelectedCity}
            items={cities.map(city => ({
              label: city,
              value: city
            }))}
          />
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default Home
