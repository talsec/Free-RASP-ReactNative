/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Box, Flex, HStack, Text, VStack } from '@react-native-material/core';
import CheckmarkCircle from '../assets/checkmark-circle-outline.png';
import CloseCircle from '../assets/close-circle-outline.png';
import TalsecLogo from '../assets/talsec-logo.png';
import {
  Platform,
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
  isScreenControlBlocked,
  blockScreenControl,
  isOverlayWindowsBlocked,
  blockOverlayWindows,
  type SuspiciousAppInfo,
  storeExternalId,
  removeExternalId,
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
    detail?: string;
  }[];
  suspiciousApps: SuspiciousAppInfo[];
  fastChecksFinishedStatus: 'in progress' | 'completed';
  postponedChecksFinishedStatus: 'in progress' | 'completed';
}> = ({
  checks,
  suspiciousApps,
  fastChecksFinishedStatus,
  postponedChecksFinishedStatus,
}) => {
  const [hasScreenCaptureBlocked, setHasScreenCaptureBlocked] =
    React.useState(false);
  const [hasScreenControlBlocked, setHasScreenControlBlocked] =
    React.useState(false);
  const [hasOverlayWindowsBlocked, setHasOverlayWindowsBlocked] =
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
      await blockScreenCapture(!hasScreenCaptureBlocked);
      await updateScreenCaptureStatus();
    } catch (error: any) {
      console.error('Screen capture Error:', error.message);
    }
  };

  const toggleScreenControlBlock = async () => {
    try {
      await blockScreenControl(!hasScreenControlBlocked);
      setHasScreenControlBlocked(await isScreenControlBlocked());
    } catch (error: any) {
      console.error('Screen control Error:', error);
    }
  };

  const toggleOverlayWindowsBlock = async () => {
    try {
      const applied = await blockOverlayWindows(!hasOverlayWindowsBlocked);
      console.info('Changing Overlay Windows Status applied:', applied);
      setHasOverlayWindowsBlocked(await isOverlayWindowsBlocked());
    } catch (error: any) {
      console.error('Overlay windows Error:', error);
    }
  };

  const renderToggle = (
    isBlocked: boolean,
    onPress: () => void,
    blockLabel: string,
    enableLabel: string
  ) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, isBlocked && styles.blockedButton]}>
      <Text
        style={[styles.buttonText, { color: isBlocked ? 'white' : 'black' }]}>
        {isBlocked ? enableLabel : blockLabel}
      </Text>
    </TouchableOpacity>
  );

  const renderExecutionState = (
    label: string,
    status: 'in progress' | 'completed'
  ) => (
    <Box
      style={[
        styles.box,
        status === 'completed' ? styles.boxCheckOk : styles.boxProgress,
      ]}>
      <HStack
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: status === 'completed' ? 'green' : Colors.progressDark,
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          {label}
        </Text>
        {status === 'completed' ? (
          <Image
            source={CheckmarkCircle}
            style={[styles.checkIcon, { tintColor: Colors.checkOkDark }]}
          />
        ) : (
          <ActivityIndicator size={30} color={Colors.progressDark} />
        )}
      </HStack>
    </Box>
  );

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

  const handleModalRemove = async () => {
    setModalVisible(false);
    try {
      await removeExternalId();
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'External ID removed',
      });
    } catch (error: any) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Warning',
        textBody: 'External ID not removed',
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
                          style={styles.removeButton}
                          onPress={handleModalRemove}>
                          <Text style={styles.modalText}>Remove</Text>
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
              {Platform.OS === 'android' && (
                <HStack
                  style={{ justifyContent: 'space-evenly', paddingTop: 10 }}>
                  {renderToggle(
                    hasScreenControlBlocked,
                    toggleScreenControlBlock,
                    'Block Screen Control',
                    'Enable Screen Control'
                  )}
                  {renderToggle(
                    hasOverlayWindowsBlocked,
                    toggleOverlayWindowsBlock,
                    'Block Overlays',
                    'Enable Overlays'
                  )}
                </HStack>
              )}
              <Text style={styles.titleText}>RASP Execution State:</Text>
              {renderExecutionState(
                'Fast Checks Finished',
                fastChecksFinishedStatus
              )}
              {Platform.OS === 'android' &&
                renderExecutionState(
                  'Postponed Checks Finished',
                  postponedChecksFinishedStatus
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
                        color:
                          check.status === 'ok' ? 'green' : 'rgb(200, 0, 0)',
                        fontWeight: 'bold',
                        alignSelf: 'center',
                      }}>
                      {check.detail
                        ? `${check.name}: ${check.detail}`
                        : check.name}
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
  removeButton: {
    backgroundColor: '#FF9800',
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
