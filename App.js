import React from "react";
import { Text, View, StyleSheet, StatusBar, Dimensions, Alert, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    flex: 0,
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  webviewStyle: {
    flex: 1
  },
  errorView: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFF',
    padding: 10
  }
});

const HooksDimensions = () => {
  const { width, height } = useWindowDimensions();
  return <Text style={styles.paragraph}>{`Hooks: width=${width} height=${height}`}</Text>
}



export default class App extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      wb: false
    };
  }

  async componentDidMount(){
    this.mounted = true;
    Dimensions.addEventListener('change', this.handleOrientationChange);
    this.handleOrientationChange();
  }


  componentWillUnmount(){
    this.mounted = false;
    if(this.wbTimeout){
      clearTimeout(this.wbTimeout);
      this.wbTimeout = null;
    }
    Dimensions.removeEventListener('change', this.handleOrientationChange);
  }

  handleOrientationChange = () => {

    let {width, height} = Dimensions.get('window');
    this.setState({
      width: width,
      height: height,
      wb: false
    });

    if(this.wbTimeout){
      clearTimeout(this.wbTimeout);
      this.wbTimeout = null;
    }

    // although the bug can happen after some time, it triggers faster
    // if we mount/unmount the webview
    this.wbTimeout = setTimeout(()=>{
      this.wbTimeout = null;
      if(this.mounted){
        this.setState({wb: true})
      }
    });
  }

  setRef = (r) => {
    this.webView = r;
  }

  setRef = (r) => {
    this.webView = r;
  }

  onError = (e) => {
    setTimeout(()=> {
      Alert.alert("Error", "Failed to load data, please check your internet connection and try again.");
    }, 100);
  }

  render() {
    let {width, height, wb} = this.state;

    return (
        <View style={styles.container}>
          <Text style={styles.paragraph}>{`Class: width=${width} height=${height}`}</Text>
          <HooksDimensions />
          {wb ?
            <WebView
              mixedContentMode={'always'}
              ref={this.setRef}
              source={{uri: "https://www.google.com"}}
              originWhitelist={['*']}
              style={styles.webviewStyle}
              onError={this.onError}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
            />
        : null}
        </View>
    );
  }
}