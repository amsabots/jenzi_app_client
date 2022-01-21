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
    longitude: 36.9095934,
    latitude: -1.2116835,
    desc: '1Kms away',
  },
  {
    id: 2,
    name: 'Lameck Owesi',
    longitude: 36.9096934,
    latitude: -1.2216635,
    desc: '3Kms away',
  },
];

const services = [
  {id: 1, name: 'All', selected: true},
  {id: 2, name: 'Plumber', selected: false},
  {id: 3, name: 'Roofers', selected: false},
  {id: 4, name: 'Casual workers', selected: false},
  {id: 5, name: 'Foundation', selected: false},
  {id: 6, name: 'Welders', selected: false},
];

const mapsStateToProps = state => {
  const {fundis} = state;
  return {fundis};
};

const ServiceType = ({onChipClick, item}) => {
  return (
    <View style={{marginRight: SIZES.padding_12}}>
      <Chip
        icon={item.selected && 'check'}
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
  const {name, desc, photoUrl} = details;
  return (
    <Card style={styles.card_container} onPress={() => itemClick(details)}>
      <View style={styles._card_content}>
        <CircularImage size={70} />
        <View style={{marginVertical: SIZES.base, alignItems: 'center'}}>
          <Text style={{...FONTS.body_bold}}>{name}</Text>
          <Text style={{...FONTS.caption}}>Plumber</Text>
        </View>

        <Rating ratingCount={5} imageSize={SIZES.icon_size} startingValue={0} />
        <View
          style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
          <OIcons
            name="milestone"
            size={SIZES.icon_size}
            style={{marginRight: SIZES.base}}
          />
          <Text
            style={{
              ...FONTS.body,
              marginVertical: SIZES.base,
              color: COLORS.secondary,
            }}>
            {desc}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const PageContent = ({fundis: f}) => {
  const [load, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState({
    name: 'All',
    selected: true,
  });
  const [fundis, setFundis] = useState([]);
  const [renderNull, setRenderNull] = useState(false);
  const [categories, setCategories] = useState(services);

  //store
  const dispatch = useDispatch();

  //render types of profession
  const renderProfessionTypes = ({item}) => (
    <ServiceType item={item} onChipClick={i => handleClickedType(i)} />
  );
  //render available users
  const renderFundis = ({item}) => (
    <Providers
      details={item}
      itemClick={() => dispatch(fundiActions.set_selected_fundi(item))}
    />
  );

  function handleClickedType(i) {
    setSelectedType(i);
    const clicked_index = categories.indexOf(i);
    const clone_arr = categories.map(el => {
      return {...el, selected: false};
    });
    clone_arr[clicked_index] = {...clone_arr[clicked_index], selected: true};
    setCategories(clone_arr);
  }

  useEffect(() => {
    dispatch(fundiActions.add_fundi(users));
    setFundis(users);
  }, []);

  return (
    <View style={styles.container}>
      <LoaderSpinner.DoubleRing loading={load} size={40} />
      <View>
        <Text style={{...FONTS.body_medium, color: COLORS.secondary}}>
          Available services
        </Text>
        <FlatList
          data={categories}
          renderItem={renderProfessionTypes}
          key={item => item.name}
          style={{marginVertical: SIZES.padding_16}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {/* Available users */}
      <Text style={{...FONTS.body_medium, color: COLORS.secondary}}>
        Available {selectedType.name == 'All' ? 'providers' : selectedType.name}
      </Text>
      {/* <LoadingNothing label={'No services providers found'} /> */}
      {fundis.length ? (
        <FlatList
          data={fundis}
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
        <FundiDetails renderNull={v => setRenderNull(v)} />
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
