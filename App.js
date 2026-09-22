import { StatusBar } from 'expo-status-bar';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const viagensEmAlta = [
  {
    id: '1',
    title: 'Praia de Copacabana',
    location: 'Rio de Janeiro',
    price: 'R$ 680',
    rating: '4.9',
    tag: 'Mais procurada',
    days: '5 dias',
    image: 'https://i.pinimg.com/736x/4f/31/03/4f3103015fb580368b4c8000c03d5a8f.jpg' },
  {
    id: '2',
    title: 'Paris',
    location: 'Paris, França',
    price: 'R$ 820',
    rating: '4.8',
    tag: 'Trending',
    days: '4 dias',
    image:
      'https://i.pinimg.com/736x/e9/8f/2c/e98f2c723a8686fc228adad6c905ebc9.jpg'
  },
  {
    id: '3',
    title: 'Gramado e Serra',
    location: 'Rio Grande do Sul',
    price: 'R$ 760',
    rating: '4.7',
    tag: 'Top 10',
    days: '3 dias',
    image:
      'https://i.pinimg.com/1200x/4f/c7/a6/4fc7a6bc690d57666bae3856379787c1.jpg'
  }
];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Vamoaê</Text>
          <Text style={styles.title}>Viagens em alta</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {viagensEmAlta.map((trip) => (
            <TouchableOpacity key={trip.id} activeOpacity={0.9} style={styles.card}>
              <Image source={{ uri: trip.image }} style={styles.image} />

              <View style={styles.cardContent}>
                <View style={styles.rowBetween}>
                  <Text style={styles.location}>{trip.location}</Text>
                  <Text style={styles.badge}>{trip.tag}</Text>
                </View>

                <Text style={styles.tripTitle}>{trip.title}</Text>
                <Text style={styles.meta}>⭐ {trip.rating} · {trip.days}</Text>

                <View style={styles.rowBetween}>
                  <Text style={styles.price}>{trip.price}</Text>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Reservar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  header: {
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#4f8ef7',
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#14213d',
  },
  list: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  location: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f8ef7',
  },
  badge: {
    backgroundColor: '#e8f1ff',
    color: '#2b6fe6',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: '700',
  },
  tripTitle: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '800',
    color: '#14213d',
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
    color: '#596579',
  },
  price: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: '800',
    color: '#14213d',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#4f8ef7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
