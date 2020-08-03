package com.fiends.bware.Overrides;

import com.fiends.bware.Models.NearByZoneModel;
<<<<<<< HEAD
=======
import com.google.android.gms.maps.GoogleMap;
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186

import java.util.ArrayList;

public interface ServerResponse {
    void NearByZoneResponse(boolean success, ArrayList<NearByZoneModel> nearByZoneModels);
    void RedZone(boolean success, ArrayList<NearByZoneModel> nearByZoneModels, ArrayList<NearByZoneModel> redZoneLocationModel);
<<<<<<< HEAD
    void RedZoneResponse(boolean success, String response);
=======
    void MapResponse(boolean success, ArrayList<NearByZoneModel> redZoneLocationModel);
    void onMapReady(GoogleMap googleMap);

>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
    void DiseaseCount(String state, String district, String place);
    void DiseaseClick(String diseaseName, String sDate);
}
