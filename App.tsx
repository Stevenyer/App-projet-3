import React, { useEffect, useState } from 'react';
import { Alert, Button, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Accelerometer } from 'expo-sensors';
import { Subscription } from 'expo-sensors/build/Pedometer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const Stack = createStackNavigator();

let ws: WebSocket;
let IP: string | URL = "ws://192.168.1.16";



export default function App() {

  reconnect();

  return (

    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#3AB4BA', }, headerTintColor: "#fb5b5a", headerTitleStyle: { fontWeight: 'bold' }, headerTitleAlign: 'center' }}>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="adminmenu" component={Adminmenu} />
        <Stack.Screen options={{ headerShown: false }} name="techmenu" component={Techmenu} />
        <Stack.Screen name="logfile" component={Logfile} />
        <Stack.Screen name="dashboard" component={Dashboard} />
        <Stack.Screen name="adminaccess" component={Adminaccess} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
//TODO footer


var reset = false;


function reconnect() {
  ws = new WebSocket(IP);
  ws.onerror = () => {
    Alert.alert("Arm not found");
  }
  ws.onopen = () => {
    Alert.alert("Connected")
  }
}

function connect(IP: string | URL) {
  if (!IP || (typeof IP !== 'string' && !(IP instanceof URL))) {
    Alert.alert('Invalid IP or URL provided');
    return;
  }
  console.log(IP);
  ws = new WebSocket(IP);
  ws.onerror = () => {
    Alert.alert("Arm not found");
  }
  ws.onopen = () => {
    Alert.alert("Connected")
  }
}








function Login({ navigation }: any) {
  // END: ed8c6549bwf9
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  async function _verif(): Promise<void> {
    if (reset == true) {
      setUser('');
      setPassword('');
      reset = false;
    }
    switch (user) {
      case 'Admin':
        if (password === 'Admin') {
          Alert.alert("Welcome Admin");
          navigation.navigate('adminmenu');

          setUser('');
          setPassword('');
          reset = true;
        } else {
          Alert.alert("Error", "Invalid credentials");
          setPassword('');
        }
        break;
      case 'Technician':
        if (password == '12345') {
          Alert.alert("Welcome Technician");
          navigation.push('techmenu')
          setUser('');
          setPassword('');
        } else {
          Alert.alert("Error", "Invalid credentials");
        }
        break;
      default: Alert.alert("Error", "Invalid credentials");
        setPassword('');
        break;
    }
  }
  return (

    <View style={styles.container}>
      <ImageBackground source={require('./assets/robotic-arm-3d.jpg')} style={styles.imagebackground} resizeMode="cover" >
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText} placeholder="User" placeholderTextColor="#003f5c" value={user} onChangeText={setUser} />
        </View>
        <View style={styles.inputView}>
          <TextInput style={styles.inputText} secureTextEntry placeholder="Password" placeholderTextColor="#003f5c" value={password} onChangeText={setPassword} />
        </View>
        <View style={styles.loginBtn}>
          <Button color={'#fb5b5a'}
            title=" accept"
            onPress={() => {
              _verif()
            }}
          />
        </View>
      </ImageBackground>
    </View>


  );
}



function Dashboard() {



  // const [subscription, setSubscription] = useState<Subscription | null>(null);
  // const [{ x, y, z }, setData] = useState({
  //   x: 0,
  //   y: 0,
  //   z: 0,
  // });
  // Accelerometer.setUpdateInterval(200);
  // const _subscribe = () => {
  //   const newSubscription = Accelerometer.addListener(setData);
  //   setSubscription(newSubscription);
  // };
  // useEffect(() => {
  //   _subscribe();
  // partie accelerometer
  // if (x < -50) {
  //   ws.send('r');
  // }
  // if (x > 50) {
  //   ws.send('l');
  // }
  //   return () => {
  //     subscription && subscription.remove();
  //   };
  // }, [x, y, z]);


  return (



    <View style={styles.coorcontainer}>
      {/* <Text style={styles.textcoor}>x: {x.toFixed(2)}</Text>
      <Text style={styles.textcoor}>y: {y.toFixed(2)}</Text> */}

      <View style={styles.row}>
        <TouchableOpacity onPress={() => { ws.send('f'); }} style={styles.arrowButton}>
          <MaterialCommunityIcons name="arrow-up-bold" size={40} />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => { ws.send('l'); }} style={styles.arrowButton}>
          <MaterialCommunityIcons name="arrow-left-bold" size={40} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonpince} onPress={() => { ws.send('p'); }}>
          <Text>Pince</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { ws.send('r'); }} style={styles.arrowButton}>
          <MaterialCommunityIcons name="arrow-right-bold" size={40} />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => { ws.send('b'); }} style={styles.arrowButton}>
          <MaterialCommunityIcons name="arrow-down-bold" size={40} />
        </TouchableOpacity>
      </View>

      <Button color={'#3AB4BA'}
        title="reconnect"
        onPress={() => {
          reconnect();
        }}
      />
    </View>


  );
}

function Logfile() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/data')
      .then(response => {
        setData(response.data);
        setError(null); // Clear any previous errors
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
      });
  }, []);

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <ScrollView>
        {data.map((item, index) => (
          <View key={index}>
            <Text>{item.time}</Text>
            <Text>{item.log}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}


function Adminmenu({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Menu</Text>
      <View style={styles.adminbtn}>
        <Button color={'#3AB4BA'}
          title="Dashboard"
          onPress={() => navigation.push('dashboard')}
        />
        <Text></Text>
        <Button color={'#3AB4BA'}
          title="Admin"
          onPress={() => navigation.push('adminaccess')}
        />
        <Text></Text>
        <Button color={'#3AB4BA'}
          title="Log file"
          onPress={() => navigation.push('logfile')}
        />
        <Text></Text>
        <Button color={'#3AB4BA'}
          title="Logout"
          onPress={() => {
            navigation.navigate('Login');
          }}
        />
      </View>
    </View>
  );
}

function Techmenu({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Technician Menu</Text>
      <View style={styles.adminbtn}>
        <Button color={'#3AB4BA'}
          title="Dashboard"
          onPress={() => navigation.push('dashboard')}
        />
        <Text></Text>
        <Button color={'#3AB4BA'}
          title="Log"
          onPress={() => navigation.push('logfile')}
        />
        <Text></Text>
        <Button color={'#3AB4BA'}
          title="Logout"
          onPress={() => {
            navigation.navigate('Login');
          }}
        />
      </View>
    </View>
  );
}

function Adminaccess() {
  const [IP, setIP] = useState('');
  return (
    <View style={styles.container}>
      <View style={styles.loginBtn}>
        <Text style={styles.title}>Setting</Text>
        <View style={styles.inputView}>
          <TextInput style={styles.url} placeholder='ws://IP' placeholderTextColor="#003f5c" value={IP} onChangeText={setIP} />
        </View>
        <Button color={'#3AB4BA'}
          title="Connect"
          onPress={() => {
            connect(IP);
          }}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagebackground: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#3AB4BA",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "white"
  },
  url: {
    height: 70,
    width: 120,
    color: "white"
  },
  loginBtn: {
    marginBottom: 20,
    justifyContent: "center",
  },
  adminbtn: {
    marginBottom: 20,
    color: "white",
    justifyContent: "center",
    width: "80%",
  },
  button: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coorcontainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
  },

  textcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 25,
    color: 'black',
  },
  textcoor: {
    fontSize: 25,
    color: 'black',
  },
  buttonpince: {
    backgroundColor: 'red',
    borderRadius: 50,
    width: 100,
    height: 100,
    fontWeight: "bold",
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    marginRight: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginLeft: 60,
  },
  arrowButton: {
    width: 100,
    height: 100,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});






