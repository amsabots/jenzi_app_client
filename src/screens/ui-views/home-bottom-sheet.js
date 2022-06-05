import React, {useState, useEffect, useCallback} from 'react';

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
import axios from 'axios';
axios.defaults.timeout = 10000;
import {endpoints, errorMessage} from '../../endpoints';
import {screens} from '../../constants';

const mapsStateToProps = state => {
  const {fundis, user_data, ui_settings, tasks} = state;
  return {fundis, user_data, ui_settings, tasks};
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
        {item.title}
      </Chip>
    </View>
  );
};

const Providers = ({details, itemClick}) => {
  const {name, photoUrl} = details.account;
  const d = details.distance;
  return (
    <Card style={styles.card_container} onPress={() => itemClick(details)}>
      <View style={styles._card_content}>
        <CircularImage size={70} />
        <View style={{marginVertical: SIZES.base, alignItems: 'center'}}>
          <Text style={{...FONTS.body_bold}}>{name || 'Not Available'}</Text>
        </View>

        <Rating
          ratingCount={5}
          imageSize={SIZES.icon_size}
          startingValue={0}
          readonly
        />
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
            {d < 1 ? (d * 1000).toFixed(2) + ' Meter(s)' : d + ' Kms'}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const PageContent = ({fundis: f, navigation, user_data, ui_settings}) => {
  const [load, setLoading] = useState(false);
  const {
    coordinates: {latitude, longitude},
    scanRadius,
  } = user_data;
  const [selectedType, setSelectedType] = useState({
    title: 'All',
    id: null,
    selected: true,
  });
  const [availableFundis, setAvailableFundis] = useState([]);
  const [renderNull, setRenderNull] = useState(false);
  const [categories, setCategories] = useState([]);

  //store
  const dispatch = useDispatch();

  //render types of profession
  const renderProfessionTypes = ({item}) => (
    <ServiceType item={item} onChipClick={i => handleClickedType(i)} />
  );
  //render available users
  const renderFundis = ({item}) => {
    return (
      <Providers
        details={item}
        itemClick={() => {
          navigation.navigate(screens.fundi_details_preview, {...item});
        }}
      />
    );
  };

  function handleClickedType(i) {
    setSelectedType(i);
    const clicked_index = categories.indexOf(i);
    const clone_arr = categories.map(el => {
      return {...el, selected: false};
    });
    clone_arr[clicked_index] = {...clone_arr[clicked_index], selected: true};
    setCategories(clone_arr);
  }

  // axios calls
  const fetchNearbyFundis = async (filter = 'none') => {
    if (latitude && longitude) {
      setLoading(true);
      try {
        let fundi_req = `${endpoints.fundi_service}/accounts/find-nearby?longitude=${longitude}&latitude=${latitude}&scanRadius=${scanRadius}`;
        if (filter !== 'none') {
          fundi_req = `${endpoints.fundi_service}/accounts/find-nearby?longitude=${longitude}&latitude=${latitude}&scanRadius=${scanRadius}&filter=${filter}`;
        }
        const users = axios.get(fundi_req);
        const req = await Promise.all([users]);
        dispatch(fundiActions.add_fundi(req[0].data));
        setAvailableFundis(req[0].data);
      } catch (error) {
        console.log(error);
        dispatch(fundiActions.add_fundi([]));
        errorMessage(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetch_categories = () => {
    axios.get(`${endpoints.client_service}/tasks-category`).then(categories => {
      let cats = categories.data.map(el => {
        return {id: el.id, title: el.title, selected: false};
      });
      cats = [{id: null, title: 'All', selected: true}, ...cats];
      setCategories(cats);
    });
  };

  const filterOnCategoryChange = () => {
    if (selectedType.title === 'All') fetchNearbyFundis();
    else fetchNearbyFundis(selectedType.id);
  };

  useEffect(() => {
    fetchNearbyFundis();
    return () => {
      setLoading(false);
    };
  }, [latitude, longitude, ui_settings.refresh_state]);

  useEffect(() => {
    filterOnCategoryChange();
  }, [selectedType]);

  // run once
  useEffect(() => {
    fetch_categories();
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

      <View>
        {/* <LoadingNothing label={'No services providers found'} /> */}
      </View>

      {/* Available users */}
      <Text style={{...FONTS.body_medium, color: COLORS.secondary}}>
        Available providers
      </Text>
      {availableFundis.length ? (
        <FlatList
          data={availableFundis}
          renderItem={renderFundis}
          keyExtractor={i => i.account.accountId}
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
