package com.fiends.bware.Overrides;

import com.fiends.bware.Models.NearByZoneModel;

import java.util.ArrayList;

public interface ServerResponse {
    void NearByZoneResponse(boolean success, ArrayList<NearByZoneModel> nearByZoneModels);
    void RedZone(boolean success, ArrayList<NearByZoneModel> nearByZoneModels, ArrayList<NearByZoneModel> redZoneLocationModel);
    void RedZoneResponse(boolean success, String response);
    void DiseaseCount(String state, String district, String place);
    void DiseaseClick(String diseaseName, String sDate);
}
