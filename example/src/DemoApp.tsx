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
  TextInput,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Colors } from './styles';
import { MalwareModal } from './MalwareModal';
import {
  isScreenCaptureBlocked,
  blockScreenCapture,
  type SuspiciousAppInfo,
  storeExternalId,
} from 'freerasp-react-native';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

export const DemoApp: React.FC<{
  checks: {
    name: string;
    status: string;
  }[];
  suspiciousApps: SuspiciousAppInfo[];
  allChecksFinishedStatus: 'in progress' | 'completed';
}> = ({ checks, suspiciousApps, allChecksFinishedStatus }) => {
  const [hasScreenCaptureBlocked, setHasScreenCaptureBlocked] =
    React.useState(false);
  const [externalIdValue, setExternalIdValue] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      await updateScreenCaptureStatus();
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

  const handleModalSend = async () => {
    setModalVisible(false);
    try {
      await storeExternalId(externalIdValue);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'External ID stored',
      });
    } catch (error: any) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Warning',
        textBody: 'External ID not stored',
      });
    }
  };

  const handleModalDismiss = () => {
    setModalVisible(false);
  };

  return (
    <>
      <AlertNotificationRoot>
        <Flex fill style={styles.flex}>
          <ScrollView>
            <VStack>
              <Image source={TalsecLogo} style={{ alignSelf: 'center' }} />;
              <HStack
                style={{ justifyContent: 'space-evenly', paddingTop: 10 }}>
                <TouchableOpacity
                  onPress={toggleScreenCaptureBlock}
                  style={[
                    styles.button,
                    hasScreenCaptureBlocked && styles.blockedButton,
                  ]}>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: hasScreenCaptureBlocked ? 'white' : 'black' },
                    ]}>
                    {hasScreenCaptureBlocked
                      ? 'Enable Screen Capture'
                      : 'Block Screen Capture'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={[styles.button]}>
                  <Text style={[styles.buttonText, { color: 'black' }]}>
                    Set External ID
                  </Text>
                </TouchableOpacity>
                <Modal
                  transparent
                  visible={modalVisible}
                  animationType="fade"
                  onRequestClose={handleModalDismiss}>
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={styles.title}>Set External ID</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Type something..."
                        value={externalIdValue}
                        onChangeText={setExternalIdValue}
                      />
                      <View style={styles.buttonRow}>
                        <TouchableOpacity
                          style={styles.sendButton}
                          onPress={handleModalSend}>
                          <Text style={styles.modalText}>Send</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.dismissButton}
                          onPress={handleModalDismiss}>
                          <Text style={styles.modalText}>Dismiss</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </HStack>
              <Text style={styles.titleText}>RASP Execution State:</Text>
              <Box
                style={[
                  styles.box,
                  allChecksFinishedStatus === 'completed'
                    ? styles.boxCheckOk
                    : styles.boxProgress,
                ]}>
                <HStack
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color:
                        allChecksFinishedStatus === 'completed'
                          ? 'green'
                          : Colors.progressDark,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                    }}>
                    All Checks Finished
                  </Text>
                  {allChecksFinishedStatus === 'completed' ? (
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
                    <ActivityIndicator size={30} color={Colors.progressDark} />
                  )}
                </HStack>
              </Box>
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
                        color:
                          check.status === 'ok' ? 'green' : 'rgb(200, 0, 0)',
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
      </AlertNotificationRoot>
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
    backgroundColor: Colors.checkNokDark,
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
  boxProgress: {
    borderColor: Colors.progressDark,
    backgroundColor: Colors.progressLight,
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
  modalOverlay: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  dismissButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
