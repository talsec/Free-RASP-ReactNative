const FRAMEWORKS_PROPERTY = 'ios.useFrameworks';
const MANAGED_PROPERTY = 'freerasp.iosUseFrameworks';
const PREVIOUS_VALUE_PROPERTY = 'freerasp.previousIosUseFrameworks';
const UNSET_VALUE = '__freerasp_unset__';

const configureIosSpmProperties = (
  properties: Record<string, string>,
  spmEnabled: boolean
): Record<string, string> => {
  if (spmEnabled) {
    if (properties[MANAGED_PROPERTY] !== 'true') {
      properties[PREVIOUS_VALUE_PROPERTY] =
        properties[FRAMEWORKS_PROPERTY] ?? UNSET_VALUE;
    }
    properties[FRAMEWORKS_PROPERTY] = 'dynamic';
    properties[MANAGED_PROPERTY] = 'true';
  } else if (properties[MANAGED_PROPERTY] === 'true') {
    const previousValue = properties[PREVIOUS_VALUE_PROPERTY];
    if (previousValue && previousValue !== UNSET_VALUE) {
      properties[FRAMEWORKS_PROPERTY] = previousValue;
    } else {
      delete properties[FRAMEWORKS_PROPERTY];
    }
    delete properties[MANAGED_PROPERTY];
    delete properties[PREVIOUS_VALUE_PROPERTY];
  }

  return properties;
};

export default configureIosSpmProperties;
