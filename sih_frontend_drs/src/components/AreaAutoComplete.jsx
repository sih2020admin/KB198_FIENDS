import React , {useState} from "react";
import PlacesAutocomplete , {geocodeByAddress,getLatLng} from 'react-places-autocomplete';
// import {
//     geocodeByAddress,
//     geocodeByPlaceId,
//     getLatLng,
//   } from 'react-places-autocomplete';

  {/* ) */}

export default function AreaAutoComplete(props){

    const [address,setAddress] = useState("")

    const [coordinates,setCoodinates] = useState({

        lan:null,
        lon:null,
    })

    const handleSelect = async value => {
        setAddress(value);
        const result = await geocodeByAddress(value);
       
        const latlng = await getLatLng(result[0])
        console.log(latlng)
        props.getLocation({
            place:value,
            location:[latlng.lng,latlng.lat]
        })
    }
    return (
        <div>
            <PlacesAutocomplete value={address}
        onChange={setAddress}
        onSelect={handleSelect}
        >

{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </PlacesAutocomplete>
        </div>
    );
    

     
  }

