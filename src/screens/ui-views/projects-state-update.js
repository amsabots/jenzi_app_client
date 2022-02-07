import React, {useState, useMemo, useRef, useEffect} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {View, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import {COLORS, FONTS, SIZES} from '../../constants/themes';
import {TextInput, Button} from 'react-native-paper';

import {LoadingModal} from '../../components';

const mapStateToProps = state => {
  const {tasks} = state;
  return {tasks};
};

const pickers = [
  {value: 'COMPLETE', label: 'Project complete'},
  {label: 'Project in progress', value: 'ON_GOING'},
  {label: 'Raise dispute', value: 'PENDING'},
  {label: 'Cancel the project', value: 'CANCELLED'},
];

const TaskUpdateView = ({sheetRef, tasks}) => {
  const [status, setStatus] = useState('');
  const [loader, setLoader] = useState(false);
  //
  const {selected_job} = tasks;
  const snapPoints = useMemo(() => [0, '25%', '70%'], []);

  const show_reasons_view = () => {
    return status === 'PENDING' || status === 'CANCELLED';
  };

  const handleOnPress = () => {
    console.log(selected_job);
    setLoader(true);
  };

  useEffect(() => {
    show_reasons_view();
  }, [status]);

  return (
    <BottomSheet ref={sheetRef} index={0} snapPoints={snapPoints}>
      <LoadingModal
        show={loader}
        onDismiss={() => setLoader(false)}
        label={'Updating work state'}
      />
      <View style={styles.wrapper}>
        <Picker
          mode="dropdown"
          style={{borderColor: COLORS.disabled_grey, borderWidth: 1}}
          prompt="Select the status of the project"
          selectedValue={status}
          onValueChange={(itemValue, itemIndex) => {
            setStatus(itemValue);
          }}>
          {pickers.map((el, idx) => (
            <Picker.Item
              label={el.label}
              value={el.value}
              style={{color: COLORS.primary, ...FONTS.body_medium}}
              key={idx}
            />
          ))}
        </Picker>

        {show_reasons_view() && (
          <View style={styles._reasons_wrapper}>
            <TextInput
              placeholder="Provide a valid reason for the action selected"
              multiline={true}
              numberOfLines={3}
              mode="outlined"
              outlineColor={COLORS.secondary}
              activeOutlineColor={COLORS.secondary}
            />
          </View>
        )}
        <Button
          color={COLORS.white}
          onPress={handleOnPress}
          style={{
            backgroundColor: COLORS.secondary,
            marginVertical: SIZES.padding_16,
          }}>
          Submit update
        </Button>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: SIZES.padding_16,
  },
  _reasons_wrapper: {
    marginTop: SIZES.padding_32,
  },
});

export const TaskUpdate = connect(mapStateToProps)(React.memo(TaskUpdateView));
