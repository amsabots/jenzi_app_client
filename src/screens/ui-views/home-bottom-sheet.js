import React, {useState, useEffect, useCallback} from 'react';

import {View, Text, StyleSheet} from 'react-native';
import {LoaderSpinner} from '../../components';
import {COLORS, FONTS, SIZES} from '../../constants/themes';
import {Chip, Card} from 'react-native-paper';
import {FlatList} from 'react-native-gesture-handler';

import {LoadingNothing, CircularImage} from '../../components';

//rating
import {Rating} from 'react-native-ratings';
//icons;
import AIcons from 'react-native-vector-icons/AntDesign';
// redux store
import {useDispatch, connect} from 'react-redux';
import {fundiActions} from '../../store-actions';

///// constants
import axios from 'axios';
axios.defaults.timeout = 10000;
import {axios_endpoint_error, endpoints} from '../../endpoints';
import {screens} from '../../constants';
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';

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
  const {name, photo_url, id, stars} = details;
  const [fundi_projects, set_fundi_projects] = useState([]);
  useEffect(() => {
    axios.get(`/fundi-tasks/user/${id}`).then(res => {
      const {data} = res.data;
      const projects_data = data?.filter(el => {
        if (el?.fundi_data?.state?.toLowerCase() === 'inprogress') return el;
      });
      set_fundi_projects(projects_data);
    });

    return () => {
      set_fundi_projects(0);
    };
  }, []);
  return (
    <Card style={styles.card_container} onPress={() => itemClick(details)}>
      <View style={styles._card_content}>
        <CircularImage size={100} url={photo_url} />
        <View style={{marginVertical: SIZES.base, alignItems: 'center'}}>
          <Text style={{...FONTS.body_bold}}>{name || 'Not Available'}</Text>
        </View>

        <Rating
          ratingCount={5}
          imageSize={SIZES.icon_size}
          startingValue={stars ?? 1}
          readonly
        />
        <View
          style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
          <AIcons
            name="dashboard"
            size={SIZES.padding_16}
            color={COLORS.blue_deep}
            style={{marginRight: SIZES.base}}
          />
          <Text
            style={{
              ...FONTS.body,
              marginVertical: SIZES.base,
              color: COLORS.blue_deep,
            }}>
            {fundi_projects.length} projects{`(s)`} complete
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
  const [categories, setCategories] = useState([]);

  //store
  const dispatch = useDispatch();

  //render types of profession
  const renderProfessionTypes = ({item}) => (
    <ServiceType item={item} onChipClick={i => handleClickedType(i)} />
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

  // axios calls
  const fetchNearbyFundis = async (filter = 'none') => {
    // if (latitude && longitude) {
    setLoading(true);
    let fundi_req = `/utility/nearby-fundis?longitude=${0}&latitude=${0}&radius=${22000}`;
    if (filter !== 'none') {
      fundi_req = `/utility/nearby-fundis?longitude=${0}&latitude=${0}&radius=${22000}&filter=${filter}`;
    }
    axios
      .get(fundi_req)
      .then(res => {
        setAvailableFundis(res.data);
      })
      .catch(err => {
        dispatch(fundiActions.add_fundi([]));
        axios_endpoint_error(err);
      })
      .finally(() => setLoading(false));
    // }
  };

  const fetch_categories = () => {
    axios.get(`/job-category`).then(categories => {
      let cats = categories.data.map(el => {
        return {id: el.id, title: el.title, selected: false};
      });
      cats = [{id: null, title: 'All', selected: true}, ...cats];
      setCategories(cats);
    });
  };

  useEffect(() => {
    if (selectedType.title !== 'All') fetchNearbyFundis(selectedType.id);
    else fetchNearbyFundis();
    return () => {
      setLoading(false);
    };
  }, [latitude, longitude, ui_settings.refresh_state, selectedType]);
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
          renderItem={({item}) => {
            return (
              <Providers
                details={item}
                itemClick={() => {
                  navigation.navigate(screens.fundi_details_preview, {...item});
                }}
              />
            );
          }}
          keyExtractor={i => i.account_id}
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
