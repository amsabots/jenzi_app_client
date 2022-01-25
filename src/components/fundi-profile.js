import React, {useState, useEffect, useCallback} from 'react';

import {Button, Chip} from 'react-native-paper';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {connect} from 'react-redux';

//UI sub components
import {ServiceRequest, PendingRequests} from '../screens/ui-views';

//components
import {
  CircularImage,
  ReviewContainer,
  InfoChips,
  LoaderSpinner,
  LoadingNothing,
} from '.';
//icons
import MIcon from 'react-native-vector-icons/MaterialIcons';
const mapStateToProps = state => {
  const {fundis} = state;
  return {fundis};
};

const Loader = ({type = 'a', label = 'Fetching........'}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <LoaderSpinner.ArcherLoader loading={true} />
      <Text>{label}</Text>
    </View>
  );
};

const DetailsView = ({leadinglabel = 'No details available', fundis}) => {
  const [load, setLoad] = useState(false);
  const [trainedBy, setTraineddBy] = useState([]);
  const [projects, setLoadProjects] = useState([]);
  // timer to track the request validity period -
  const [time, setTimer] = useState(0);
  const [showRequestStatus, setRequestStatus] = useState(false);

  const {selected_fundi: fundi} = fundis;

  const handleSendRequest = user => {
    setRequestStatus(true);
  };

  return Object.keys(fundi).length ? (
    <View style={styles.container}>
      <CircularImage size={100} />
      {/*  */}
      <View style={styles._details}>
        <Text style={{...FONTS.body_bold, marginBottom: SIZES.base}}>
          {fundi.name}
        </Text>
        {/* NCA section */}
        <View>
          <Text style={{...FONTS.captionBold}}>NCA no</Text>
          <Text style={{...FONTS.body_medium}}>1234567890</Text>
        </View>
        {/* ====================== */}
        <View
          style={{
            marginVertical: SIZES.base,
            width: '100%',
          }}>
          <Text style={styles._section_header}>Trained by</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {load ? (
              <Loader label="Loading training organizations........" />
            ) : projects.length ? (
              [1, 2].map((el, idx) => (
                <InfoChips
                  key={idx}
                  text={'NIBS College'}
                  textColor={COLORS.blue_deep}
                  containerStyles={{
                    marginRight: SIZES.padding_4,
                    marginBottom: SIZES.padding_4,
                  }}
                />
              ))
            ) : (
              <LoadingNothing label={'Training not available'} width={100} />
            )}
          </View>
          {/* ============= projects */}
          <View style={{marginVertical: SIZES.padding_12}}>
            <Text style={styles._section_header}>Completed projects</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: SIZES.base,
              }}>
              {load ? (
                <Loader label="Loading user projects]........" />
              ) : trainedBy.length ? (
                [1, 2, 3, 4, 5, 6].map((el, idx) => (
                  <Chip
                    style={{marginBottom: 4, marginRight: SIZES.padding_16}}>
                    SGR construction
                  </Chip>
                ))
              ) : (
                <LoadingNothing label={'0 Projects done'} width={100} />
              )}
            </View>
          </View>
        </View>
      </View>
      {/*  */}
      <ServiceRequest sendRequest={user => handleSendRequest(user)} />
      {/* =================== component to show the request sending status =============== */}
      <PendingRequests
        timer={time}
        show={showRequestStatus}
        cancel={() => {
          setRequestStatus(false);
        }}
      />
      <View style={styles._border_line}></View>
      {/*  */}
      <View style={styles._reviews}>
        <ReviewContainer />
      </View>
    </View>
  ) : (
    <LoadingNothing label={leadinglabel} />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SIZES.padding_12,
    paddingHorizontal: SIZES.padding_16,
  },
  _details: {
    marginVertical: SIZES.base,
    width: '100%',
    alignItems: 'center',
  },
  _reviews: {
    width: '100%',
  },
  _section_header: {
    color: COLORS.secondary,
    ...FONTS.captionBold,
    marginBottom: SIZES.base,
  },
  _border_line: {
    borderColor: COLORS.light_secondary,
    borderWidth: SIZES.stroke,
    width: '100%',
    marginVertical: SIZES.padding_12,
  },
});

export const FundiDetails = connect(mapStateToProps)(DetailsView);
