package com.fiends.bware.Activities;

import android.annotation.SuppressLint;
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

import androidx.appcompat.app.AppCompatActivity;

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

import static com.fiends.bware.Utils.Bware.showAppExitDialog;


public class RegisterActivity extends AppCompatActivity implements BwareResponse {

    private EditText phoneNumber;
    private TextView purpose;
    private TelephonyManager telephonyManager;
    private Button SendOtp;

    private EditText otp1;
    private EditText otp2;
    private EditText otp3;
    private EditText otp4;
    private TextView OtpTimer;
    private Button VerifyOTP;

    private View Otp;
    private View Register;
    private View AddAddress;
    private ServerRequest serverRequest;
    private ProgressDialog progressDialog;

    private Spinner State;
    private Spinner District;
    private Button AddAddressBtn;
    private EditText PinCode;
    private EditText Place;

    public static JSONObject mainAddress;
    private JSONObject address;
    private GetLocation getLocation;

    @SuppressLint("MissingPermission")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        phoneNumber = findViewById(R.id.phone_number);
        purpose = findViewById(R.id.purpose);
        SendOtp = findViewById(R.id.send_otp_btn);

        otp1 = findViewById(R.id.otp1);
        otp2 = findViewById(R.id.otp2);
        otp3 = findViewById(R.id.otp3);
        otp4 = findViewById(R.id.otp4);
        OtpTimer = findViewById(R.id.otp_timer);
        VerifyOTP = findViewById(R.id.verify_otp);

        Otp = findViewById(R.id.Otp);
        Register = findViewById(R.id.Register);
        AddAddress = findViewById(R.id.AddAddress);
        serverRequest = new ServerRequest(this);

        State = findViewById(R.id.state);
        District = findViewById(R.id.district);
        AddAddressBtn = findViewById(R.id.add_address_btn);
        PinCode = findViewById(R.id.pin_code);
        Place = findViewById(R.id.place);
        address = new JSONObject();
        mainAddress = new JSONObject();

        serverRequest.setUrl(getString(R.string.GetStates),this).getStates();
        String[] select = {"Select District"};
        ArrayAdapter<CharSequence> sequenceArrayAdapter = new ArrayAdapter<CharSequence>(this, R.layout.spinner_item, select);
        sequenceArrayAdapter.setDropDownViewResource(R.layout.spinner_dropdown);
        District.setAdapter(sequenceArrayAdapter);

        SimpleLocation locations = new SimpleLocation(this);
        JSONArray location = new JSONArray();
        try {
            location.put(locations.getLongitude());
            location.put(locations.getLatitude());
            mainAddress.put("location", location);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        telephonyManager = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);

        phoneNumber.setText("+91" + telephonyManager.getLine1Number());

        State.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                checkField();
                if (position != 0) {
                    try {
                        address.put("state",String.valueOf(State.getItemAtPosition(position)));
                        String url = getString(R.string.GetDistricts) + "/" + State.getItemAtPosition(position) + "/districts";
                        serverRequest.setUrl(url, RegisterActivity.this).getDistricts();
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

        SendOtp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String number = phoneNumber.getText().toString().replace("+91", "");
                number.replace(" ","");
                number.trim();
                if (number.length() == 10) {
                    JSONObject jsonObject = new JSONObject();
                    try {
                        jsonObject.put("phNo",number);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    new BwareFiles(RegisterActivity.this).saveData("Phone Number", number);
                    serverRequest.setUrl(getString(R.string.SendOTP), RegisterActivity.this).sendOTP(jsonObject);
                    progressDialog = ProgressDialog.show(RegisterActivity.this, "", "Please Wait...", true, false);
                } else {
                    phoneNumber.setError("Phone number must be 10 digit.", Bware.editTextError(RegisterActivity.this));
                }

            }
        });

        VerifyOTP.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String number = phoneNumber.getText().toString().replace("+91", "");
                JSONObject jsonObject = new JSONObject();
                try {
                    jsonObject.put("phNo", number);
                    jsonObject.put("otp", otp1.getText().toString() + otp2.getText().toString() + otp3.getText().toString() + otp4.getText().toString());
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                serverRequest.setUrl(getString(R.string.VerifyOTP), RegisterActivity.this).verifyOTP(jsonObject);
                progressDialog = ProgressDialog.show(RegisterActivity.this, "", "Please Wait...", true, false);
            }
        });

        AddAddressBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                addAddress();
            }
        });

        purpose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                BottomSheetDialog bottomSheetDialog = new BottomSheetDialog(
                        RegisterActivity.this, R.style.BottomSheetDialogTheme
                );
                View bottomSheetView = LayoutInflater.from(getApplicationContext())
                        .inflate(R.layout.bottom_sheet_layout, null);
                bottomSheetDialog.setContentView(bottomSheetView);
                bottomSheetDialog.show();
            }
        });

        phoneNumber.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (phoneNumber.getText().toString().isEmpty()) {
                    SendOtp.setEnabled(false);
                } else {
                    SendOtp.setEnabled(true);
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

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

        otp1.requestFocus();
        otp1.onKeyUp(KeyEvent.KEYCODE_DPAD_CENTER, new KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_DPAD_CENTER));
        otp1.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                checkOTPField();
            }

            @Override
            public void afterTextChanged(Editable s) {
                if (otp1.getText().toString().length() == 1) {
                    otp2.requestFocus();
                } else {
                    otp1.requestFocus();
                }
            }
        });
        otp2.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                checkOTPField();
            }

            @Override
            public void afterTextChanged(Editable s) {
                if (otp2.getText().toString().length() == 1) {
                    otp3.requestFocus();
                } else {
                    otp1.requestFocus();
                }
            }
        });
        otp3.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                checkOTPField();
            }

            @Override
            public void afterTextChanged(Editable s) {
                if (otp3.getText().toString().length() == 1) {
                    otp4.requestFocus();
                } else {
                    otp2.requestFocus();
                }
            }
        });
        otp4.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                checkOTPField();
            }

            @Override
            public void afterTextChanged(Editable s) {
                if (otp4.getText().toString().length() == 1) {
                    otp4.requestFocus();
                } else {
                    otp3.requestFocus();
                }
            }
        });

        new CountDownTimer(900000, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {

                long time = millisUntilFinished/1000;
                OtpTimer.setText(time/60 + ":" + time % 60);
            }

            @Override
            public void onFinish() {

                OtpTimer.setText("Resend OTP");
            }
        }.start();

    }

    private void addAddress() {
        BwareFiles files = new BwareFiles(RegisterActivity.this);
        if (Bware.checkLocation(RegisterActivity.this)){
            if (Place.getText().toString().isEmpty()) {
                Place.setError("Place should be given", Bware.editTextError(RegisterActivity.this));
            } else {
                if (PinCode.getText().toString().isEmpty()) {
                    PinCode.setError("Pin code should be given", Bware.editTextError(RegisterActivity.this));
                } else {
                    try {
                        address.put("place", Place.getText().toString());
                        address.put("pincode", PinCode.getText().toString());
                        new BwareFiles(RegisterActivity.this).saveData("Address",String.valueOf(address));
                        mainAddress.put("address", address);
                        mainAddress.put("fcmRegToken", files.readData("FCMToken"));
                        Log.i("ADDRESS",String.valueOf(mainAddress));
                        serverRequest.setUrl(getString(R.string.SendAddress), RegisterActivity.this).sendAddress(mainAddress);
                        progressDialog = ProgressDialog.show(RegisterActivity.this, "", "Please Wait...", true, false);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        } else {
            Bware.turnGPSOn(RegisterActivity.this);
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

    private void checkOTPField() {
        if (!otp1.getText().toString().isEmpty()) {
            if (!otp2.getText().toString().isEmpty()) {
                if (!otp3.getText().toString().isEmpty()) {
                    if (!otp4.getText().toString().isEmpty()) {
                        VerifyOTP.setEnabled(true);
                    } else {
                        VerifyOTP.setEnabled(false);
                    }
                } else {
                    VerifyOTP.setEnabled(false);
                }
            } else {
                VerifyOTP.setEnabled(false);
            }
        } else {
            VerifyOTP.setEnabled(false);
        }
    }

    @Override
    public void OTPResponse(Boolean success) {
        if (success) {
            Register.setVisibility(View.INVISIBLE);
            Otp.setVisibility(View.VISIBLE);
            progressDialog.dismiss();
        } else {
            progressDialog.dismiss();
            Toast.makeText(this, "Failed to send OTP", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void LoginResponse(Boolean success) {
        if (success) {
            progressDialog.dismiss();
            Otp.setVisibility(View.INVISIBLE);
            AddAddress.setVisibility(View.VISIBLE);
        } else {
            progressDialog.dismiss();
            Toast.makeText(this, "Failed to verify OTP", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void AddressResponse(Boolean success) {
        if (success) {
            progressDialog.dismiss();
            startActivity(new Intent(RegisterActivity.this, DashBoardActivity.class));
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

    @Override
    public void onBackPressed() {
        showAppExitDialog(RegisterActivity.this);
    }

}