package com.fiends.bware.Overrides;

public interface BwareResponse {

    void OTPResponse(Boolean success);
    void LoginResponse(Boolean success);
    void AddressResponse(Boolean success);
    void PlaceResponse(String[] strings, String type);
    void DiseaseCount(String count, String type);

}
