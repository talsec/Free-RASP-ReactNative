/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Box, Flex, HStack, Text, VStack } from '@react-native-material/core';
import CheckmarkCircle from '../assets/checkmark-circle-outline.png';
import CloseCircle from '../assets/close-circle-outline.png';
import TalsecLogo from '../assets/talsec-logo.png';
import {
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
} from 'react-native';
import { Colors } from './styles';
import { MalwareModal } from './MalwareModal';
import {
  isScreenCaptureBlocked,
  blockScreenCapture,
  type SuspiciousAppInfo,
} from 'freerasp-react-native';

export const DemoApp: React.FC<{
  checks: {
    name: string;
    status: string;
  }[];
  suspiciousApps: SuspiciousAppInfo[];
}> = ({ checks, suspiciousApps }) => {
  const [isBlocked, setIsBlocked] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      Platform.OS === 'android' && (await checkScreenCaptureStatus());
    })();
  }, []);

  const checkScreenCaptureStatus = async () => {
    try {
      const status = await isScreenCaptureBlocked();
      setIsBlocked(status);
    } catch (error) {
      console.error('Screen capture status check failed:', error);
    }
  };

  const toggleScreenCaptureBlock = async () => {
    try {
      await blockScreenCapture(!isBlocked);
      setIsBlocked(!isBlocked);
    } catch (error: any) {
      console.error('Screen capture Error:', error.message);
    }
  };

  return (
    <>
      <Flex
        fill
        style={{
          backgroundColor: Colors.background,
          justifyContent: 'center',
        }}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <VStack>
            <Image source={TalsecLogo} style={{ alignSelf: 'center' }} />;
            {Platform.OS === 'android' && (
              <HStack
                style={{ justifyContent: 'space-evenly', paddingTop: 10 }}>
                <TouchableOpacity
                  onPress={toggleScreenCaptureBlock}
                  style={[
                    styles.button,
                    isBlocked ? styles.blockedButton : styles.unblockedButton,
                  ]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: isBlocked
                          ? Colors.checkOkDark
                          : Colors.checkNokDark,
                      },
                    ]}>
                    {isBlocked
                      ? 'Enable Screen Capture'
                      : 'Block Screen Capture'}
                  </Text>
                </TouchableOpacity>
              </HStack>
            )}
            <Text
              style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 25,
                color: 'white',
                paddingTop: 15,
              }}>
              freeRASP checks:
            </Text>
            {checks.map((check: any, idx: number) => (
              <Box
                key={idx}
                style={{
                  borderColor:
                    check.status === 'ok'
                      ? Colors.checkOkDark
                      : Colors.checkNokDark,
                  backgroundColor:
                    check.status === 'ok'
                      ? Colors.checkOkLight
                      : Colors.checkNokLight,
                  borderWidth: 1,
                  paddingHorizontal: 30,
                  paddingVertical: 4,
                  marginVertical: 8,
                  marginHorizontal: 20,
                  borderRadius: 15,
                }}>
                <HStack style={{ justifyContent: 'space-between' }}>
                  <Text
                    style={{
                      color: check.status === 'ok' ? 'green' : 'rgb(200, 0, 0)',
                      fontWeight: 'bold',
                      alignSelf: 'center',
                    }}>
                    {check.name}
                  </Text>
                  {check.name === 'Malware' && (
                    <MalwareModal
                      isDisabled={check.status === 'ok'}
                      suspiciousApps={suspiciousApps}
                    />
                  )}
                  {check.status === 'ok' ? (
                    <Image
                      source={CheckmarkCircle}
                      style={{
                        tintColor: Colors.checkOkDark,
                        width: 30,
                        height: 30,
                      }}
                    />
                  ) : (
                    <Image
                      source={CloseCircle}
                      style={{
                        tintColor: Colors.checkNokDark,
                        width: 30,
                        height: 30,
                      }}
                    />
                  )}
                </HStack>
              </Box>
            ))}
          </VStack>
        </ScrollView>
      </Flex>
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: 'center', // Centers content inside ScrollView
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
    height: 50,
    backgroundColor: Colors.lightBlue,
    borderRadius: 10,
    padding: 2,
    marginTop: 20,
  },
  blockedButton: {
    backgroundColor: Colors.checkOkLight, // When blocked
  },
  unblockedButton: {
    backgroundColor: Colors.checkNokLight, // When not blocked
  },
  vStack: {
    width: '90%', // Ensures items stay within proper width
    alignItems: 'center',
  },
});
