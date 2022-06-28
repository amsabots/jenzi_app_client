import axios from 'axios';
import React, {useMemo, memo, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {Chip, Divider} from 'react-native-paper';
import {CircularImage, InfoChips, LoadingModal} from '../../components';
import {COLORS, FONTS, SIZES} from '../../constants/themes';
import {axios_endpoint_error, endpoints} from '../../endpoints';
import AIcons from 'react-native-vector-icons/AntDesign';
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';

const Fundi_Info = ({prop_fundi}) => {
  const [fundi, set_fundi] = useState(null);
  const [load, set_loading] = useState(false);
  const handle_unassign_request = () => {
    set_loading(true);
    axios
      .delete(`/fundi-tasks/${fundi.entryId}`)
      .then(re =>
        ToastAndroid.show(
          `Unassigned successfully, Exit and refresh to view chnages`,
          ToastAndroid.LONG,
        ),
      )
      .catch(err => axios_endpoint_error(err))
      .finally(() => set_loading(false));
  };
  useEffect(() => {
    if (!prop_fundi) return;
    axios
      .get(`/fundi/${prop_fundi.fundiId}`)
      .then(res => set_fundi(res.data))
      .catch(err => axios_endpoint_error(err));
  }, []);
  return (
    <View style={sub_item.container}>
      <TouchableOpacity>
        <CircularImage url={fundi?.photo_url} size={64} />
      </TouchableOpacity>
      <Text style={{...FONTS.caption, marginVertical: SIZES.base}}>
        {fundi?.name}
      </Text>
      <View style={sub_item._action}>
        <Chip textStyle={{fontSize: 10}}>Open chats</Chip>
        <Chip
          onPress={handle_unassign_request}
          textStyle={{fontSize: 10, color: COLORS.white}}
          style={{backgroundColor: COLORS.danger}}>
          Unassign
        </Chip>
      </View>
      <LoadingModal show={load} label={'Unassigning fundi....'} />
    </View>
  );
};

const sub_item = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingTop: SIZES.base,
  },
  _action: {
    width: '80%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
const AssigneeInfo = ({fundis}) => {
  const [loading, set_loading] = useState(false);
  return (
    <View style={styles.container}>
      {fundis.map((el, idx) => {
        return (
          <View
            style={[
              styles._card,
              {borderTopColor: `#${el.entryId.substring(0, 6)}`},
            ]}
            key={idx}>
            <Fundi_Info prop_fundi={el} />
            <Divider style={{marginVertical: SIZES.base}} />
            <View style={{alignItems: 'center', width: '100%'}}>
              <Text style={{...FONTS.caption}}>Current project status</Text>
              <Chip
                style={{
                  height: 32,
                  justifyContent: 'center',
                  marginVertical: SIZES.base,
                  backgroundColor: `#${el.entryId.substring(0, 6)}`,
                }}
                textStyle={{...FONTS.captionBold, color: COLORS.white}}>
                {el?.state}
              </Chip>
            </View>
            <Divider style={{marginVertical: SIZES.base}} />
            <View
              style={{
                paddingHorizontal: SIZES.padding_16,
                paddingVertical: SIZES.base,
              }}>
              <Text style={{...FONTS.caption, marginBottom: SIZES.base}}>
                Progress summary
              </Text>
              {el?.conflict_flag && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <AIcons name="flag" color={COLORS.danger} />
                  <Text
                    style={{
                      ...FONTS.caption,
                      marginLeft: SIZES.base,
                      marginBottom: SIZES.base,
                    }}>
                    Flagged
                  </Text>
                </View>
              )}
              <Text style={{...FONTS.captionBold}}>
                Managed Information:{' '}
                <Text
                  style={{
                    ...FONTS.caption,
                    color: `#${el.entryId.substring(0, 6)}`,
                  }}>
                  {el?.conflict_flag_info || 'None Available at this moment'}
                </Text>
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.padding_16,
    marginTop: SIZES.base,
    alignItems: 'center',
  },
  _card: {
    backgroundColor: COLORS.white,
    width: '80%',
    elevation: 1,
    overflow: 'hidden',
    borderTopWidth: 6,
    borderRadius: SIZES.padding_16,
    borderTopEndRadius: 0,
    borderTopLeftRadius: 0,
    marginBottom: SIZES.base,
  },
  _project_info: {},
});

export default memo(AssigneeInfo);
