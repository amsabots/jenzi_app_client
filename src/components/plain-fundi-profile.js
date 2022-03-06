import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button, Chip, Divider} from 'react-native-paper';
import {FONTS, SIZES} from '../constants/themes';
import {endpoints} from '../endpoints';
import {CircularImage, LoaderSpinner, LoadingNothing} from './';
import {Rating} from 'react-native-ratings';

const PlainFundiProfile = ({fundi, fundiId, onFundiFinished}) => {
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
  console.log(data);
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
    <View style={styles.container}>
      <CircularImage size={120} url={photoUrl} />
      <Text style={{...FONTS.body_bold, marginTop: SIZES.padding_12}}>
        {name}
      </Text>
      <Text style={{marginTop: SIZES.base}}>{email}</Text>
      <View>
        <Rating
          type="heart"
          ratingCount={5}
          imageSize={SIZES.padding_32}
          ratingColor={COLORS.secondary}
          startingValue={stars}
          readonly={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {...SIZES.centerInView, paddingVertical: SIZES.padding_16},
  _star_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export {PlainFundiProfile};
