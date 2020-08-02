package com.fiends.bware.Utils;

import android.app.Activity;
import android.util.Log;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.fiends.bware.Models.NearByZoneModel;
import com.fiends.bware.Overrides.BwareResponse;
import com.fiends.bware.Overrides.ServerResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class ServerRequest {

    private Activity activity;
    private String url;
    private BwareResponse bWareResponse;
    private ServerResponse serverResponse;
    private BwareFiles files;

    public ServerRequest() {

    }

    public ServerRequest(Activity activity) {
        this.activity = activity;
    }

    public ServerRequest setUrl(String url, BwareResponse bWareResponse) {

        this.url = url;
        this.bWareResponse = bWareResponse;
        return this;
    }

    public ServerRequest setUrl(String url, ServerResponse serverResponse) {

        this.url = url;
        this.serverResponse = serverResponse;
        return this;
    }

    public ServerRequest setUrl(String url) {

        this.url = url;
        return this;
    }

    public ServerRequest sendOTP(JSONObject jsonObject) {

        RequestQueue queue = Volley.newRequestQueue(activity.getApplicationContext());
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, jsonObject,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {

                        try {
                            if (response.getString("response").equals("OTP sent")) {
                                bWareResponse.OTPResponse(true);
                            } else {
                                bWareResponse.OTPResponse(false);
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        bWareResponse.OTPResponse(false);
                    }
                }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json; charset=utf-8");
                return headers;
            }
        };
        queue.add(request);
        return this;
    }

    public ServerRequest verifyOTP(JSONObject jsonObject) {

        RequestQueue queue = Volley.newRequestQueue(activity.getApplicationContext());
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url, jsonObject,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {

                        try {
                            if (!response.getString("x-user-token").isEmpty()) {
                                files = new BwareFiles(activity);
                                files.saveData("Temp",response.getString("x-user-token"));
                                bWareResponse.LoginResponse(true);
                            } else {
                                bWareResponse.LoginResponse(false);
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        bWareResponse.LoginResponse(false);
                    }
                }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json; charset=utf-8");
                return headers;
            }
        };
        queue.add(request);
        return this;
    }

    public ServerRequest sendAddress(JSONObject jsonObject) {

        RequestQueue queue = Volley.newRequestQueue(activity.getApplicationContext());
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.PUT, url, jsonObject,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {

                        try {
                            if (!response.getString("response").isEmpty()) {
                                files = new BwareFiles(activity);
                                files.renameFile("Temp","User Token");
                                bWareResponse.AddressResponse(true);
                            } else {
                                bWareResponse.AddressResponse(false);
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        bWareResponse.AddressResponse(false);
                    }
                }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                BwareFiles files = new BwareFiles(activity);
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json; charset=utf-8");
                String token;
                if (files.readData("Temp").isEmpty()) {
                    token = files.readData("User Token");
                } else {
                    token = files.readData("Temp");
                }
                headers.put("x-user-token",token);
                return headers;
            }
        };
        queue.add(request);
        return this;
    }

    public ServerRequest sendToken(JSONObject jsonObject, String token) {

        RequestQueue queue = Volley.newRequestQueue(activity.getApplicationContext());
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.PUT, url, jsonObject,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {

                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {

                    }
                }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json; charset=utf-8");
                headers.put("x-user-token",token);
                return headers;
            }
        };
        queue.add(request);
        return this;
    }

    public ServerRequest getStates() {

        RequestQueue queue = Volley.newRequestQueue(activity.getApplicationContext());
        final StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                response = response.replace("[\"","");
                response = response.replace("\"]","");
                response = response.replace("\""," ");
                String[] temp = response.split(" , ");
                String[] strings = new String[temp.length + 1];
                strings[0] = "Select State";
                for (int i=0; i<temp.length; i++) {
                    strings[i+1] = temp[i];
                }
                bWareResponse.PlaceResponse(strings,"State");
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json; charset=utf-8");
                return headers;
            }
        };
        queue.add(request);
        return this;
    }

    public ServerRequest getDistricts() {

        RequestQueue queue = Volley.newRequestQueue(activity.getApplicationContext());
        final StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.i("DISTRICTS123",response);
                response = response.replace("[\"","");
                response = response.replace("\"]","");
                response = response.replace("\""," ");
                String[] temp = response.split(" , ");
                String[] strings = new String[temp.length + 1];
                strings[0] = "Select District";
                for (int i=0; i<temp.length; i++) {
                    strings[i+1] = temp[i];
                }
                bWareResponse.PlaceResponse(strings, "District");
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json; charset=utf-8");
                return headers;
            }
        };
        queue.add(request);
        return this;
    }

    public ServerRequest getDiseasesCount() {

        RequestQueue queue = Volley.newRequestQueue(activity.getApplicationContext());
        final StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    Log.i("CURRENTLINK",url);
                    Log.i("CURRENTLINK",response);
                    JSONObject jsonObject = new JSONObject(response);
                    serverResponse.DiseaseCount(jsonObject.getString("state"),
                            jsonObject.getString("district"),
                            jsonObject.getString("place"));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json; charset=utf-8");
                return headers;
            }
        };
        queue.add(request);
        return this;
    }

    public ServerRequest getNearByOutrages() {

        final ArrayList<NearByZoneModel> nearByZoneModels = new ArrayList<>();
        final ArrayList<NearByZoneModel> redZoneLocationModel = new ArrayList<>();
        RequestQueue queue = Volley.newRequestQueue(activity.getApplicationContext());
        final StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    JSONArray jsonArray = new JSONArray(jsonObject.getString("features"));
                    Log.i("URLLINK",url);
                    Log.i("URLLINK",response);
                    for (int i=0; i<jsonArray.length(); i++) {
                        JSONObject jsonObject1 = new JSONObject(jsonArray.get(i).toString());
                        JSONObject object = new JSONObject(jsonObject1.getString("properties"));
                        JSONObject geometry = new JSONObject(jsonObject1.getString("geometry"));
                        JSONArray coordinates = new JSONArray(geometry.getString("coordinates"));
                        nearByZoneModels.add(new NearByZoneModel(
                                object.getString("disease"),
                                object.getString("description"),
                                Bware.getDate(object.getString("startDate")),
                                object.getString("distance")));
                        redZoneLocationModel.add(new NearByZoneModel(
                                "[" + coordinates.get(0).toString() + ", " + coordinates.get(1).toString() + "]",
                                object.getString("alertRadius"),
                                Boolean.parseBoolean(object.getString("isRedZone"))
                        ));
                    }
                    serverResponse.NearByZoneResponse(true, nearByZoneModels);
                    serverResponse.MapResponse(true, redZoneLocationModel);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                BwareFiles files = new BwareFiles(activity);
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json; charset=utf-8");
                Log.i("TOKEN",files.readData("User Token"));
                headers.put("x-user-token",files.readData("User Token"));
                return headers;
            }
        };
        queue.add(request);
        return this;
    }

    public ServerRequest getRedZone(String type) {

        final ArrayList<NearByZoneModel> nearByZoneModels = new ArrayList<>();
        final ArrayList<NearByZoneModel> redZoneLocationModel = new ArrayList<>();
        RequestQueue queue = Volley.newRequestQueue(activity.getApplicationContext());
        final StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    if (response.equals("[]")) {
                        serverResponse.RedZone(true, nearByZoneModels, redZoneLocationModel);
                    } else {
                        Log.i("URLLINK",url);
                        Log.i("URLLINK",response);
                        JSONObject jsonObject = new JSONObject(response);
                        JSONObject previousOutrages = new JSONObject(jsonObject.getString(type));
                        JSONArray jsonArray = new JSONArray(previousOutrages.getString("features"));
                        for (int i=0; i<jsonArray.length(); i++) {
                            JSONObject jsonObject1 = new JSONObject(jsonArray.get(i).toString());
                            JSONObject object = new JSONObject(jsonObject1.getString("properties"));
                            JSONObject geometry = new JSONObject(jsonObject1.getString("geometry"));
                            JSONArray coordinates = new JSONArray(geometry.getString("coordinates"));
                            nearByZoneModels.add(new NearByZoneModel(
                                    object.getString("disease"),
                                    object.getString("description"),
                                    object.getString("startDate"),
                                    object.getString("distance")));
                            redZoneLocationModel.add(new NearByZoneModel(
                                    "[" + coordinates.get(0).toString() + ", " + coordinates.get(1).toString() + "]",
                                    object.getString("alertRadius")
                            ));
                        }
                        serverResponse.RedZone(true, nearByZoneModels, redZoneLocationModel);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                serverResponse.RedZone(false, nearByZoneModels, redZoneLocationModel);
            }
        }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                BwareFiles files = new BwareFiles(activity);
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json; charset=utf-8");
                headers.put("x-user-token",files.readData("User Token"));
                Log.i("TOKEN2",files.readData("User Token"));
                return headers;
            }
        };
        queue.add(request);
        return this;
    }

    public ServerRequest sendLocation(JSONObject jsonObject, String token) {

        RequestQueue queue = Volley.newRequestQueue(activity.getApplicationContext());
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.PUT, url, jsonObject,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.i("NITHIN_AASHIK_RESPONSE", response.toString());
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {

                    }
                }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Content-Type", "application/json; charset=utf-8");
                headers.put("x-user-token",token);
                return headers;
            }
        };
        queue.add(request);
        return this;
    }

}
