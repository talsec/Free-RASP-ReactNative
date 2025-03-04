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
  StyleSheet,
  Platform,
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
  const [hasScreenCaptureBlocked, setHasScreenCaptureBlocked] =
    React.useState(false);

  React.useEffect(() => {
    (async () => {
      Platform.OS === 'android' && (await updateScreenCaptureStatus());
    })();
  }, []);

  const updateScreenCaptureStatus = async () => {
    try {
      const isBlocked = await isScreenCaptureBlocked();
      setHasScreenCaptureBlocked(isBlocked);
    } catch (error) {
      console.error('Error fetching screen capture status:', error);
    }
  };

  const toggleScreenCaptureBlock = async () => {
    try {
      const response = await blockScreenCapture(!hasScreenCaptureBlocked);
      console.info('Changing Screen Capture Status:', response);
      await updateScreenCaptureStatus();
    } catch (error: any) {
      console.error('Screen capture Error:', error.message);
    }
  };

  return (
    <>
      <Flex fill style={styles.flex}>
        <ScrollView>
          <VStack>
            <Image source={TalsecLogo} style={{ alignSelf: 'center' }} />;
            {Platform.OS === 'android' && (
              <HStack
                style={{ justifyContent: 'space-evenly', paddingTop: 10 }}>
                <TouchableOpacity
                  onPress={toggleScreenCaptureBlock}
                  style={[
                    styles.button,
                    hasScreenCaptureBlocked
                      ? styles.unblockedButton
                      : styles.blockedButton,
                  ]}>
                  <Text
                    style={[
                      styles.buttonText,
                      hasScreenCaptureBlocked
                        ? styles.colorCheckNok
                        : styles.colorCheckOk,
                    ]}>
                    {hasScreenCaptureBlocked
                      ? 'Enable Screen Capture'
                      : 'Block Screen Capture'}
                  </Text>
                </TouchableOpacity>
              </HStack>
            )}
            <Text style={styles.titleText}>freeRASP checks:</Text>
            {checks.map((check: any, idx: number) => (
              <Box
                key={idx}
                style={[
                  styles.box,
                  check.status === 'ok'
                    ? styles.boxCheckOk
                    : styles.boxCheckNok,
                ]}>
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
                      style={[
                        styles.checkIcon,
                        {
                          tintColor: Colors.checkOkDark,
                        },
                      ]}
                    />
                  ) : (
                    <Image
                      source={CloseCircle}
                      style={[
                        styles.checkIcon,
                        {
                          tintColor: Colors.checkNokDark,
                        },
                      ]}
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
  flex: {
    paddingTop: 50,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
    textAlign: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
    height: 50,
    backgroundColor: Colors.checkOkLight,
    borderRadius: 10,
    padding: 2,
    marginTop: 20,
  },
  blockedButton: {
    backgroundColor: Colors.checkOkLight,
  },
  unblockedButton: {
    backgroundColor: Colors.checkNokLight,
  },
  colorCheckNok: {
    color: Colors.checkNokDark,
  },
  colorCheckOk: {
    color: Colors.checkOkDark,
  },
  boxCheckNok: {
    borderColor: Colors.checkNokDark,
    backgroundColor: Colors.checkNokLight,
  },
  boxCheckOk: {
    borderColor: Colors.checkOkDark,
    backgroundColor: Colors.checkOkLight,
  },
  box: {
    borderWidth: 1,
    paddingHorizontal: 30,
    paddingVertical: 4,
    marginVertical: 8,
    marginHorizontal: 20,
    borderRadius: 15,
  },
  checkIcon: {
    width: 30,
    height: 30,
  },
  titleText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
    paddingTop: 15,
  },
});
