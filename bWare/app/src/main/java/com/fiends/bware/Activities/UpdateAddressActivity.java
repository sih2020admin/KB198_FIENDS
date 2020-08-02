package com.fiends.bware.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.telephony.TelephonyManager;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.fiends.bware.Overrides.BwareResponse;
import com.fiends.bware.R;
import com.fiends.bware.Utils.Bware;
import com.fiends.bware.Utils.BwareFiles;
import com.fiends.bware.Utils.GetLocation;
import com.fiends.bware.Utils.ServerRequest;
import com.google.android.material.bottomsheet.BottomSheetDialog;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import im.delight.android.location.SimpleLocation;

public class UpdateAddressActivity extends AppCompatActivity implements BwareResponse {

    private ServerRequest serverRequest;
    private ProgressDialog progressDialog;

    private Spinner State;
    private Spinner District;
    private Button AddAddressBtn;
    private EditText PinCode;
    private EditText Place;

    public static JSONObject mainAddress;
    private JSONObject address;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_update_address);

        serverRequest = new ServerRequest(this);

        State = findViewById(R.id.state);
        District = findViewById(R.id.district);
        AddAddressBtn = findViewById(R.id.add_address_btn);
        PinCode = findViewById(R.id.pin_code);
        Place = findViewById(R.id.place);
        address = new JSONObject();
        mainAddress = new JSONObject();

        AddAddressBtn.setText("Update Address");
        serverRequest.setUrl(getString(R.string.GetStates),this).getStates();
        String[] select = {"Select District"};
        ArrayAdapter<CharSequence> sequenceArrayAdapter = new ArrayAdapter<CharSequence>(this, R.layout.spinner_item, select);
        sequenceArrayAdapter.setDropDownViewResource(R.layout.spinner_dropdown);
        District.setAdapter(sequenceArrayAdapter);
        State.setAdapter(sequenceArrayAdapter);

        SimpleLocation locations = new SimpleLocation(this);
        JSONArray location = new JSONArray();
        try {
            location.put(locations.getLongitude());
            location.put(locations.getLatitude());
            mainAddress.put("location", location);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        State.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                checkField();
                if (position != 0) {
                    try {
                        address.put("state",String.valueOf(State.getItemAtPosition(position)));
                        String url = getString(R.string.GetDistricts) + "/" + State.getItemAtPosition(position) + "/districts";
                        serverRequest.setUrl(url, UpdateAddressActivity.this).getDistricts();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        District.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                checkField();
                if (position != 0) {
                    try {
                        address.put("district",String.valueOf(District.getItemAtPosition(position)));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });


        AddAddressBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                addAddress();
            }
        });


        PinCode.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                checkField();
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });

        Place.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                checkField();
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });

    }

    private void addAddress() {
        BwareFiles files = new BwareFiles(UpdateAddressActivity.this);
        if (Bware.checkLocation(UpdateAddressActivity.this)){
            if (Place.getText().toString().isEmpty()) {
                Place.setError("Place should be given", Bware.editTextError(UpdateAddressActivity.this));
            } else {
                if (PinCode.getText().toString().isEmpty()) {
                    PinCode.setError("Pin code should be given", Bware.editTextError(UpdateAddressActivity.this));
                } else {
                    try {
                        address.put("place", Place.getText().toString());
                        address.put("pincode", PinCode.getText().toString());
                        new BwareFiles(UpdateAddressActivity.this).saveData("Address",String.valueOf(address));
                        mainAddress.put("address", address);
                        mainAddress.put("fcmRegToken", files.readData("FCMToken"));
                        Log.i("ADDRESS",String.valueOf(mainAddress));
                        serverRequest.setUrl(getString(R.string.SendAddress), UpdateAddressActivity.this).sendAddress(mainAddress);
                        progressDialog = ProgressDialog.show(UpdateAddressActivity.this, "", "Please Wait...", true, false);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        } else {
            Bware.turnGPSOn(UpdateAddressActivity.this);
        }
    }

    private void checkField() {
        if (!Place.getText().toString().isEmpty()) {
            if (!State.getSelectedItem().equals("Select State")) {
                if (!District.getSelectedItem().equals("Select District")) {
                    if (!PinCode.getText().toString().isEmpty()) {
                        AddAddressBtn.setEnabled(true);
                    } else {
                        AddAddressBtn.setEnabled(false);
                    }
                } else {
                    AddAddressBtn.setEnabled(false);
                }
            } else {
                AddAddressBtn.setEnabled(false);
            }
        } else {
            AddAddressBtn.setEnabled(false);
        }
    }


    @Override
    public void onBackPressed() {
        startActivity(new Intent(UpdateAddressActivity.this, DashBoardActivity.class));
        finish();
    }

    @Override
    public void OTPResponse(Boolean success) {

    }

    @Override
    public void LoginResponse(Boolean success) {

    }

    @Override
    public void AddressResponse(Boolean success) {
        if (success) {
            progressDialog.dismiss();
            startActivity(new Intent(UpdateAddressActivity.this, DashBoardActivity.class));
            finish();
        } else {
            progressDialog.dismiss();
            Toast.makeText(this, "Failed to Add Address", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void PlaceResponse(String[] strings, String type) {
        ArrayAdapter<CharSequence> sequenceArrayAdapter = new ArrayAdapter<CharSequence>(this, R.layout.spinner_item, strings);
        sequenceArrayAdapter.setDropDownViewResource(R.layout.spinner_dropdown);
        if (type.equals("State")) {
            State.setAdapter(sequenceArrayAdapter);
        }
        if (type.equals("District")) {
            District.setAdapter(sequenceArrayAdapter);
        }
    }

    @Override
    public void DiseaseCount(String count, String type) {

    }
}