import Toast from 'react-native-toast-message';
export const endpoints = {
  notification_server: 'http://18.216.4.98:27500/realtime-server',
  client_service: `http://18.216.4.98:27900/client/api`,
  fundi_service: `http://18.216.4.98:27800/fundi/api`,
};

export const errorMessage = err => {
  if (err.response) {
    const {data, status} = err.response;
    Toast.show({
      type: 'error',
      text1: status === 403 ? 'Bad credetials' : 'Unknown Entity',
      text2:
        status === 403
          ? 'Invalid email/phone and password provided'
          : data.message,
      position: 'bottom',
    });
  } else {
    Toast.show({
      type: 'error',
      text1: 'System error',
      text2: 'Please try again later, System unavailable',
    });
  }
};
