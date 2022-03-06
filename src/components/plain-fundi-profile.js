import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {Button, Chip, Divider} from 'react-native-paper';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {endpoints} from '../endpoints';
import {CircularImage, LoaderSpinner, LoadingNothing} from './';
import {Rating} from 'react-native-ratings';
import {VERTICAL} from 'react-native/Libraries/Components/ScrollView/ScrollViewContext';
import {screens} from '../constants';

const PlainFundiProfile = ({fundi, fundiId, onFundiFinished, navigation}) => {
  const [data, setData] = useState(null);

  const load_data = () => {
    if (fundi) return setData(fundi);
    if (!fundiId) return setData(null);
    axios
      .get(`${endpoints.fundi_service}/accounts/${fundiId}`)
      .then(res => {
        setData(res.data);
        onFundiFinished(res.data);
      })
      .catch(err => setData(null));
  };

  useEffect(() => {
    load_data();
  }, [fundi, fundiId]);

  if (!data) {
    return (
      <View>
        <LoadingNothing
          label={'Fundi information cannot be displayed at this moment'}
          width={180}
        />
      </View>
    );
  }

  const {
    accountId,
    email,
    name,
    ncaNumber,
    photoUrl,
    createdAt,
    stars,
    ratings,
  } = data;
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: COLORS.white, width: '100%'},
      ]}>
      <CircularImage size={120} url={photoUrl} />
      <Text style={{...FONTS.body_bold, marginTop: SIZES.padding_12}}>
        {name}
      </Text>
      <Text style={{marginTop: SIZES.base}}>{email}</Text>
      <View style={styles._star_container}>
        <Rating
          type="heart"
          ratingCount={5}
          imageSize={SIZES.icon_size}
          startingValue={stars}
          readonly={true}
        />
        <View style={styles._rating_details}>
          <TouchableOpacity>
            <Text style={[styles._txt_sec]}>0 reviews</Text>
          </TouchableOpacity>
          <VerticalDivider height={12} space={8} />
          <Text style={[styles._txt_sec]}>{stars} stars</Text>
        </View>
      </View>

      <Chip
        style={styles._chip_review}
        textStyle={{color: COLORS.white}}
        onPress={() => ToastAndroid.show('Coming soon...', ToastAndroid.SHORT)}
        onPress={() => navigation.navigate(screens.rate_fundi, {fundi: data})}>
        Rate {'&'} see reviews
      </Chip>
    </View>
  );
};

export const VerticalDivider = ({
  height,
  color = COLORS.secondary,
  space = SIZES.padding_4,
}) => {
  return (
    <View
      style={{
        height,
        width: SIZES.stroke,
        backgroundColor: color,
        marginHorizontal: space,
        alignSelf: 'center',
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {...SIZES.centerInView, paddingVertical: SIZES.padding_16},
  _star_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  _rating_details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: SIZES.base,
  },
  _txt_sec: {
    color: COLORS.secondary,
    ...FONTS.caption,
  },
  _chip_review: {
    height: 32,
    width: '70%',
    ...SIZES.centerInView,
    backgroundColor: COLORS.primary,
    marginTop: SIZES.padding_16,
  },
});

export {PlainFundiProfile};
