import React, {useState, useMemo, useRef, useEffect} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {View, Text, StyleSheet} from 'react-native';
//redux
import {connect, useDispatch} from 'react-redux';
import {task_actions} from '../../store-actions';
import DropDownPicker from 'react-native-dropdown-picker';

import {COLORS, FONTS, SIZES} from '../../constants/themes';
import {TextInput, Button} from 'react-native-paper';

//

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

const TaskUpdateView = ({sheetRef, tasks, updateDone}) => {
  const [loader, setLoader] = useState(false);
  const [force_rerender, setRerender] = useState(null);
  const [reason, setReason] = useState('');
  /////////////////////////
  const [items, setItems] = useState(pickers);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const {selected_job} = tasks;
  const snapPoints = useMemo(() => [0, '25%', '70%'], []);

  const show_reasons_view = () => {
    return value === 'PENDING' || value === 'CANCELLED';
  };

  const handleOnPress = () => {
    let job = selected_job;
    job = {...job, taskState: value};
    setLoader(true);
    if (show_reasons_view) updateDone(job);
  };

  useEffect(() => {
    show_reasons_view();
  }, [value]);

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={index => {
        if (index === 0) {
          setRerender(Math.random());
        }
      }}>
      <LoadingModal
        show={loader}
        onDismiss={() => setLoader(false)}
        label={'Updating work state'}
      />
      <View
        style={{
          paddingVertical: SIZES.padding_32,
          paddingHorizontal: SIZES.padding_16,
        }}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          disabledItemContainerStyle={true}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder={'Set current task state'}
        />
      </View>
      <View style={styles.wrapper}>
        {show_reasons_view() && (
          <View style={styles._reasons_wrapper}>
            <TextInput
              placeholder="Provide a valid reason for the action selected"
              multiline={true}
              numberOfLines={3}
              mode="outlined"
              onChangeText={txt => setReason(text)}
              value={reason}
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

export const TaskUpdate = connect(mapStateToProps)(TaskUpdateView);
