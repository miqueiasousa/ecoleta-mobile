import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Image, Text, Linking } from 'react-native'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import * as MailComposer from 'expo-mail-composer'
import api from '../../services/api'

import styles from './style'

function Detail() {
  const [data, setData] = useState({})
  const navigation = useNavigation()
  const route = useRoute()

  const handleNavigateBack = () => {
    navigation.goBack()
  }

  const handleComposeMail = () => {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email]
    })
  }

  const handleWhatsapp = () => {
    Linking.openURL(
      `whatsapp://send?phone=${data.point.whatsapp}$text=Interesse na coleta de resíduos`
    )
  }

  useEffect(() => {
    api.get(`points/${route.params.id}`).then(({ data }) => setData(data))
  }, [])

  if (!data.point) {
    return null
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        <Image style={styles.pointImage} source={{ uri: data.point.image }} />
        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map(item => item.title).join(', ')}
        </Text>
        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text
            style={styles.addressContent}
          >{`${data.point.city}, ${data.point.uf}`}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#fff" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#fff" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </>
  )
}

export default Detail
