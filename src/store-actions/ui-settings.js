const UISettingsActions = {
  status_bar: payload => {
    return {
      type: 'STATUS_BAR',
      payload,
    };
  },
};

export {UISettingsActions};
