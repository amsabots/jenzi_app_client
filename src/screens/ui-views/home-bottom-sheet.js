import React, {useState, useEffect} from 'react';

import {View, Text, StyleSheet} from 'react-native';
import {LoaderSpinner} from '../../components';
import {COLORS, FONTS, SIZES} from '../../constants/themes';
import {Chip, Card, Divider} from 'react-native-paper';
import {FlatList} from 'react-native-gesture-handler';

import {LoadingNothing, CircularImage, FundiDetails} from '../../components';

//rating
import {Rating} from 'react-native-ratings';
//icons
import OIcons from 'react-native-vector-icons/Octicons';
// redux store
import {useDispatch, connect} from 'react-redux';
import {fundiActions} from '../../store-actions';

///// constants
import {delay} from '../../constants';

const users = [
  {
    id: 1,
    name: 'Andrew Mwebbi',
    longitude: 36.8886897,
    latitude: -1.219586,
    desc: '1Kms away',
  },
  {
    id: 2,
    name: 'Lameck Owesi',
    longitude: 36.8886697,
    latitude: -1.217586,
    desc: '3Kms away',
  },
];

const mapsStateToProps = state => {
  const {fundis} = state;
};

const ServiceType = ({onChipClick, item}) => {
  return (
    <View style={{marginRight: SIZES.padding_12}}>
      <Chip
        style={{
          paddingVertical: 4,
        }}
        onPress={() => onChipClick(item)}>
        {item.name}
      </Chip>
    </View>
  );
};

const Providers = ({details, itemClick}) => {
  return (
    <Card style={styles.card_container} onPress={() => itemClick(details)}>
      <View style={styles._card_content}>
        <CircularImage size={70} />
        <View style={{marginVertical: SIZES.base, alignItems: 'center'}}>
          <Text style={{...FONTS.body_bold}}>Andrew Mwebbi</Text>
          <Text style={{...FONTS.caption}}>Plumber</Text>
        </View>

        <Rating ratingCount={5} imageSize={SIZES.icon_size} startingValue={0} />
        <View style={{width: '100%'}}>
          <Text
            style={{
              ...FONTS.body,
              marginVertical: SIZES.base,
              color: COLORS.secondary,
            }}>
            <OIcons name="milestone" size={SIZES.icon_size} /> 8 Kilometers
          </Text>
        </View>
      </View>
    </Card>
  );
};

const PageContent = () => {
  const [load, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [fundis, setFundis] = useState([1]);

  //store
  const dispatch = useDispatch();

  //render types of profession
  const renderProfessionTypes = ({item}) => (
    <ServiceType item={item} onChipClick={i => setSelectedType(i)} />
  );
  //render available users
  const renderFundis = ({item}) => (
    <Providers details={item} itemClick={s => setSelectedUser(s)} />
  );

  useEffect(() => {
    dispatch(fundiActions.add_fundi(users));
  }, []);

  const services = [
    {id: 1, name: 'All', selected: false},
    {id: 2, name: 'Plumber', selected: false},
    {id: 3, name: 'Roofers', selected: false},
    {id: 4, name: 'Casual workers', selected: false},
    {id: 5, name: 'Foundation', selected: false},
    {id: 6, name: 'Welders', selected: false},
  ];

  return (
    <View style={styles.container}>
      <LoaderSpinner.DoubleRing loading={load} size={40} />
      <View>
        <Text style={{...FONTS.body_medium, color: COLORS.secondary}}>
          Available services
        </Text>
        <FlatList
          data={services}
          renderItem={renderProfessionTypes}
          key={item => item.name}
          style={{marginVertical: SIZES.padding_16}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {/* Available users */}
      <Text style={{...FONTS.body_medium, color: COLORS.secondary}}>
        Available providers
      </Text>
      {/* <LoadingNothing label={'No services providers found'} /> */}
      {fundis.length ? (
        <FlatList
          data={services}
          renderItem={renderFundis}
          keyExtractor={i => i.id}
          style={{marginVertical: SIZES.padding_16}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <LoadingNothing
          label={'No available fundis around your region'}
          textColor={COLORS.primary}
        />
      )}

      <View style={styles._section_selected_user}>
        {selectedUser ? (
          <FundiDetails fundi={selectedUser} />
        ) : (
          <LoadingNothing
            label={'Click any available fundi above to view details'}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.base,
  },
  card_container: {
    padding: SIZES.base,
    height: 200,
    paddingHorizontal: SIZES.padding_12,
    marginRight: SIZES.base,
  },
  _card_content: {
    alignItems: 'center',
  },
  _section_selected_user: {
    borderTopColor: COLORS.light_secondary,
    borderTopWidth: SIZES.stroke,
    marginVertical: SIZES.padding_12,
  },
});

export const HomeBottomSheetContent = connect(mapsStateToProps)(PageContent);
