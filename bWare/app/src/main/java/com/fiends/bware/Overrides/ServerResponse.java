package com.fiends.bware.Overrides;

import com.fiends.bware.Models.NearByZoneModel;
import com.google.android.gms.maps.GoogleMap;

import java.util.ArrayList;

public interface ServerResponse {
    void NearByZoneResponse(boolean success, ArrayList<NearByZoneModel> nearByZoneModels);
    void RedZone(boolean success, ArrayList<NearByZoneModel> nearByZoneModels, ArrayList<NearByZoneModel> redZoneLocationModel);
    void MapResponse(boolean success, ArrayList<NearByZoneModel> redZoneLocationModel);
    void onMapReady(GoogleMap googleMap);

    void DiseaseCount(String state, String district, String place);
    void DiseaseClick(String diseaseName, String sDate);
}
