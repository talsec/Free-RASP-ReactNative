/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Box, Flex, HStack, Text, VStack } from '@react-native-material/core';
import CheckmarkCircle from '../assets/checkmark-circle-outline.png';
import CloseCircle from '../assets/close-circle-outline.png';
import TalsecLogo from '../assets/talsec-logo.png';
import { Image } from 'react-native';
import { Colors } from './styles';
import { MalwareModal } from './MalwareModal';
import type { SuspiciousAppInfo } from 'freerasp-react-native';

export const DemoApp: React.FC<{
  checks: {
    name: string;
    status: string;
  }[];
  suspiciousApps: SuspiciousAppInfo[];
}> = ({ checks, suspiciousApps }) => {
  return (
    <>
      <Flex
        fill
        style={{
          backgroundColor: Colors.background,
          justifyContent: 'center',
        }}
      >
        <VStack>
          <Image source={TalsecLogo} style={{ alignSelf: 'center' }} />;
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              fontSize: 25,
              color: 'white',
              paddingTop: 15,
            }}
          >
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
              }}
            >
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text
                  style={{
                    color: check.status === 'ok' ? 'green' : 'rgb(200, 0, 0)',
                    fontWeight: 'bold',
                    alignSelf: 'center',
                  }}
                >
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
      </Flex>
    </>
  );
};
