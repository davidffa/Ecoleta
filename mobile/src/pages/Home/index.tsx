import React, { useState } from 'react';
import { Feather as Icon} from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

const cities = [
    { label: 'Aveiro', value: 'Aveiro' },
    { label: 'Beja', value: 'Beja' },
    { label: 'Braga', value: 'Braga' },
    { label: 'Bragança', value: 'Bragança' },
    { label: 'Castelo Branco', value: 'Castelo Branco' },
    { label: 'Coimbra', value: 'Coimbra' },
    { label: 'Évora', value: 'Évora' },
    { label: 'Faro', value: 'Faro' },
    { label: 'Guarda', value: 'Guarda' },
    { label: 'Leiria', value: 'Leiria' },
    { label: 'Portalegre', value: 'Portalegre' },
    { label: 'Porto', value: 'Porto' },
    { label: 'Santarém', value: 'Santarém' },
    { label: 'Setúbal', value: 'Setúbal' },
    { label: 'Viana do Castelo', value: 'Viana do Castelo' },
    { label: 'Vila Real', value: 'Vila Real' },
    { label: 'Viseu', value: 'Viseu' }
];

const Home = () => {
    const [city, setCity] = useState('');

    const navigation = useNavigation();
    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            city,
        });
    }
    return (
        <ImageBackground 
            source={require('../../assets/home-background.png')} 
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.input}>
                    <RNPickerSelect
                        onValueChange={(value) => setCity(value)}
                        items={cities}
                        placeholder={{
                            label: 'Selecione a cidade',
                            value: null,
                            color: '#F0F0F5',
                        }}
                    /> 
                </View>
                <RectButton style={styles.button} onPress={handleNavigateToPoints}>                    
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home;