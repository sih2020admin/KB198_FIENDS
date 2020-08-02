package com.fiends.bware.ui;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import androidx.viewpager.widget.ViewPager;

import com.fiends.bware.Activities.MapViewActivity;
import com.fiends.bware.Adapters.InActiveZoneAdapter;
import com.fiends.bware.Adapters.NearByZoneAdapter;
import com.fiends.bware.Models.NearByZoneModel;
import com.fiends.bware.Overrides.ServerResponse;
import com.fiends.bware.R;
import com.fiends.bware.Utils.BwareFiles;
import com.fiends.bware.Utils.GetLocation;
import com.fiends.bware.Utils.ServerRequest;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.GoogleMapOptions;
import com.google.android.gms.maps.LocationSource;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.Circle;
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MapStyleOptions;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.material.tabs.TabLayout;
import com.scwang.wave.MultiWaveHeader;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Calendar;

import im.delight.android.location.SimpleLocation;
import io.supercharge.shimmerlayout.ShimmerLayout;

import static com.fiends.bware.Utils.Bware.setProgressColour;

public class HomeFragment extends Fragment implements ServerResponse, OnMapReadyCallback {

    private TabLayout LocationRadius;
    private TabLayout nearByZonePagerIndicator;
    private TabLayout redZoneSelector;
    private ViewPager nearByZonePager;
    private NearByZoneAdapter nearByZoneAdapter;
    private ScrollView scrollView;

    private TextView fromDate;
    private TextView toDate;
    private TextView stateName;
    private TextView districtName;
    private TextView placeName;
    private TextView diseaseName;

    private TextView stateDisease;
    private TextView districtDisease;
    private TextView placeDisease;
    private ImageView FullMap;

    private ProgressBar stateDiseaseProgress;
    private ProgressBar districtDiseaseProgress;
    private ProgressBar placeDiseaseProgress;
    private GoogleMap mMap;

    private MultiWaveHeader multiWaveHeader;
    private TextView appName;
    private LinearLayout statusBar;
    private SwipeRefreshLayout refreshLayout;

    private RecyclerView inActiveOutrageRecyclerView;
    private InActiveZoneAdapter inActiveZoneAdapter;
    private ShimmerLayout sliderShimmer;
    private ShimmerLayout outrageShimmer;

    private View NoRedZone;
    private View NearByZone;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        final View root = inflater.inflate(R.layout.fragment_home, container, false);

        LocationRadius = root.findViewById(R.id.location_radius);
        fromDate = root.findViewById(R.id.from_date);
        toDate = root.findViewById(R.id.to_date);
        diseaseName = root.findViewById(R.id.disease_name);
        stateDisease = root.findViewById(R.id.stateDiseaseCount);
        stateDiseaseProgress = root.findViewById(R.id.state_progress);
        districtDisease = root.findViewById(R.id.districtDiseaseCount);
        districtDiseaseProgress = root.findViewById(R.id.district_progress);
        placeDisease = root.findViewById(R.id.placeDiseaseCount);
        placeDiseaseProgress = root.findViewById(R.id.place_progress);
        nearByZonePager = root.findViewById(R.id.near_by_zone_slider);
        nearByZonePagerIndicator = root.findViewById(R.id.near_by_zone_slider_indicator);
        scrollView = root.findViewById(R.id.home_scroll);
        statusBar = root.findViewById(R.id.status_bar);
        appName = root.findViewById(R.id.app_name);
        multiWaveHeader = root.findViewById(R.id.multiWaveHeader);
        inActiveOutrageRecyclerView = root.findViewById(R.id.inactive_outrages_recycler_view);
        redZoneSelector = root.findViewById(R.id.red_zone_selector);
        sliderShimmer = root.findViewById(R.id.slider_shimmer);
        outrageShimmer = root.findViewById(R.id.outrage_shimmer);
        refreshLayout = root.findViewById(R.id.scrollRefresh);
        FullMap = root.findViewById(R.id.full_map_screen);
        NoRedZone = root.findViewById(R.id.no_red_zone_layer);
        NearByZone = root.findViewById(R.id.no_near_by_zone);

        sliderShimmer.startShimmerAnimation();
        sliderShimmer.setShimmerAnimationDuration(2000);
        outrageShimmer.setShimmerAnimationDuration(1000);
        outrageShimmer.startShimmerAnimation();
        refreshLayout.setRefreshing(true);

        FullMap.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(getActivity(), MapViewActivity.class));
            }
        });
        refreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                updateStatus("500");
            }
        });
        scrollView.setOnScrollChangeListener(new View.OnScrollChangeListener() {
            @SuppressLint("ResourceType")
            @Override
            public void onScrollChange(View v, int scrollX, int scrollY, int oldScrollX, int oldScrollY) {
                if (scrollY >= 200) {
                    statusBar.setVisibility(View.VISIBLE);
                    appName.setVisibility(View.INVISIBLE);
                } else if (scrollY <= 230) {
                    statusBar.setVisibility(View.INVISIBLE);
                    appName.setVisibility(View.VISIBLE);
                }
                if (scrollY >= getResources().getDimension(R.dimen._243sdp)) {
                    multiWaveHeader.setVisibility(View.INVISIBLE);
                } else if (scrollY <= getResources().getDimension(R.dimen._243sdp)) {
                    multiWaveHeader.setVisibility(View.VISIBLE);
                }
            }
        });
        LocationRadius.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                String distance = tab.getText().toString().replaceAll("[^0-9]", "");
                int num = Integer.parseInt(distance);
                if (num < 100) {
                    num *= 1000;
                }
                sliderShimmer.setVisibility(View.VISIBLE);
                sliderShimmer.startShimmerAnimation();
                nearByZonePager.removeAllViews();
                nearByZonePagerIndicator.removeAllTabs();
                updateStatus(String.valueOf(num));
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });
        redZoneSelector.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                new GetLocation(getActivity(), new GetLocation.Response() {
                    @Override
                    public void getLocation(String latitude, String longitude) {
                        String location = "[" + longitude + ", " + latitude + "]";
                        initRedZone(location, tab.getText().toString().replaceAll(" ", ""));
                    }
                });
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });
        initMap(savedInstanceState);
        initDatePicker();
        initAddress(root);
        updateStatus("500");

        return root;
    }

    private void initMap(Bundle savedInstanceState) {

        SupportMapFragment mapFragment = SupportMapFragment.newInstance();
        if (savedInstanceState == null) {
            final FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
            transaction.add(R.id.map, mapFragment);
            transaction.commit();
        } else {
            mapFragment = (SupportMapFragment) getActivity().getSupportFragmentManager()
                    .findFragmentById(R.id.map);
        }

        if (mapFragment != null) {
            mapFragment.getMapAsync(this);
        }
    }

    private void updateStatus(final String distance) {

        SimpleLocation location = new SimpleLocation(getContext());
        String locations = "[" + location.getLongitude() + ", " + location.getLatitude() + "]";
        nearByZonePager.removeAllViews();
        sliderShimmer.setVisibility(View.VISIBLE);
        sliderShimmer.startShimmerAnimation();
        new GetLocation(getActivity(), new GetLocation.Response() {
            @Override
            public void getLocation(String latitude, String longitude) {
                String location = "[" + longitude + ", " + latitude + "]";
                initRedZone(location, "activeOutrages");
            }
        });
        initZoneSlider(distance, locations);

    }

    private void initZoneSlider(String distance, String location) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                new ServerRequest(getActivity()).setUrl(getString(R.string.GetNearByOutrages) + "/" + location + "/" + distance, HomeFragment.this).getNearByOutrages();
            }
        }).start();
    }

    private void initRedZone(String location, String type) {
        Log.i("NITHIN_AASHIK", type);
        new Thread(new Runnable() {
            @Override
            public void run() {
                new ServerRequest(getActivity()).setUrl(getString(R.string.GetRedZone) + "/" + location, HomeFragment.this).getRedZone(type);
            }
        }).start();
    }

    private void initNearByZoneSlider(ArrayList<NearByZoneModel> nearByZoneModels) {
        nearByZoneAdapter = new NearByZoneAdapter(nearByZoneModels, getActivity(), this);
        nearByZonePager.removeAllViews();
        nearByZonePager.setAdapter(nearByZoneAdapter);
        nearByZonePagerIndicator.setupWithViewPager(nearByZonePager, true);
        // Todo : SLIDER_TIMER
//
//        Timer timer = new Timer();
//        timer.scheduleAtFixedRate(new SliderTimer(getActivity(), nearByZonePager, nearByZoneModels), 5000,5000);
    }

    private void initRedZone(ArrayList<NearByZoneModel> nearByZoneModels) {
        inActiveZoneAdapter = new InActiveZoneAdapter(nearByZoneModels, getActivity());
        inActiveOutrageRecyclerView.removeAllViews();
        inActiveOutrageRecyclerView.setLayoutManager(new GridLayoutManager(getActivity(), 1, GridLayoutManager.HORIZONTAL, false));
        inActiveOutrageRecyclerView.setAdapter(inActiveZoneAdapter);
    }

    private void initAddress(View root) {
        BwareFiles files = new BwareFiles(getActivity());
        stateName = root.findViewById(R.id.state_name);
        districtName = root.findViewById(R.id.district_name);
        placeName = root.findViewById(R.id.place_name);
        try {
            JSONObject address = new JSONObject(files.readData("Address"));
            stateName.setText(address.getString("state"));
            districtName.setText(address.getString("district"));
            placeName.setText(address.getString("place"));
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void initDatePicker() {

        final Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -7);
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DAY_OF_MONTH);

        fromDate.setText(year + "-" + ++month + "-" + day);

        calendar.add(Calendar.DATE, 7);
        year = calendar.get(Calendar.YEAR);
        month = calendar.get(Calendar.MONTH);
        day = calendar.get(Calendar.DAY_OF_MONTH);

        toDate.setText(year + "-" + ++month + "-" + day);

    }

    @Override
    public void NearByZoneResponse(boolean success, ArrayList<NearByZoneModel> nearByZoneModels) {
        if (success) {
            sliderShimmer.stopShimmerAnimation();
            sliderShimmer.setVisibility(View.INVISIBLE);
            NearByZone.setVisibility(View.INVISIBLE);
            initNearByZoneSlider(nearByZoneModels);
        } else {
            nearByZonePager.removeAllViews();
            NearByZone.setVisibility(View.VISIBLE);
            Toast.makeText(getActivity(), "Failed to load.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void RedZone(boolean success, ArrayList<NearByZoneModel> nearByZoneModels, ArrayList<NearByZoneModel> redZoneLocationModel) {
        if (success) {
            if (nearByZoneModels.size() == 0) {
                NoRedZone.setVisibility(View.VISIBLE);
            } else {
                outrageShimmer.stopShimmerAnimation();
                outrageShimmer.setVisibility(View.INVISIBLE);
                NoRedZone.setVisibility(View.INVISIBLE);
            }
            initRedZone(nearByZoneModels);
        } else {
            inActiveOutrageRecyclerView.removeAllViews();
            Toast.makeText(getActivity(), "Failed to load.", Toast.LENGTH_SHORT).show();
        }
    }

    @SuppressLint("MissingPermission")
    private void setUpMapLayer(ArrayList<NearByZoneModel> redZoneLocationModel) {

        mMap.clear();
        mMap.setMapStyle(MapStyleOptions.loadRawResourceStyle(getContext(), R.raw.dark_map));
        int StrokeColor = Color.argb(100, 255, 0, 0);
        int FillColor = Color.argb(30, 255, 100, 0);
        for (int i = 0; i < redZoneLocationModel.size(); i++) {
            if (redZoneLocationModel.get(i).getRedZone()) {
                FillColor = Color.argb(30, 255, 0, 0);
            }
            try {
                JSONArray jsonArray = new JSONArray(redZoneLocationModel.get(i).getLocation());
                mMap.addCircle(new CircleOptions()
                        .center(new LatLng(Double.parseDouble(jsonArray.get(1).toString()), Double.parseDouble(jsonArray.get(0).toString())))
                        .radius(Integer.parseInt(redZoneLocationModel.get(i).getRadius()))
                        .strokeWidth(2)
                        .strokeColor(StrokeColor)
                        .fillColor(FillColor)
                        .clickable(true))
                        .setTag(redZoneLocationModel.get(i).getRadius());
                mMap.addCircle(new CircleOptions()
                        .center(new LatLng(Double.parseDouble(jsonArray.get(1).toString()), Double.parseDouble(jsonArray.get(0).toString())))
                        .radius(Integer.parseInt(redZoneLocationModel.get(i).getRadius())/20)
                        .strokeWidth(1)
                        .fillColor(Color.RED));
                mMap.setOnCircleClickListener(new GoogleMap.OnCircleClickListener() {
                    @Override
                    public void onCircleClick(Circle circle) {
                        mMap.addMarker(
                                new MarkerOptions()
                                        .alpha(0.0f)
                                        .position(circle.getCenter())
                                        .title("Radius : " + circle.getTag().toString())
                                        .snippet("Latitude: " + circle.getCenter().latitude + "    Longitude : " + circle.getCenter().longitude))
                                .showInfoWindow();

                    }
                });
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        SimpleLocation location = new SimpleLocation(getActivity());
        mMap.setMyLocationEnabled(true);
        mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(location.getLatitude(), location.getLongitude()), 14.0f));
    }

    @Override
    public void MapResponse(boolean success, ArrayList<NearByZoneModel> redZoneLocationModel) {
        setUpMapLayer(redZoneLocationModel);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {

        mMap = googleMap;
        mMap.setMapStyle(MapStyleOptions.loadRawResourceStyle(getContext(), R.raw.dark_map));

    }

    @SuppressLint("NewApi")
    @Override
    public void DiseaseCount(String state, String district, String place) {

        stateDisease.setText(state + "\nCases");
        districtDisease.setText(district + "\nCases");
        placeDisease.setText(place + "\nCases");
        int s = (Integer.parseInt(state) * 100) / Integer.parseInt(state);
        int d = (Integer.parseInt(district) * 100) / Integer.parseInt(state);
        int p = (Integer.parseInt(place) * 100) / Integer.parseInt(district);
        if (s == 0) {
            stateDiseaseProgress.setProgress(0, true);
            districtDiseaseProgress.setProgress(0, true);
            placeDiseaseProgress.setProgress(0, true);
        } else {
            stateDiseaseProgress.setProgress(s, true);
            districtDiseaseProgress.setProgress(d, true);
            placeDiseaseProgress.setProgress(p, true);
            setProgressColour(s, stateDiseaseProgress);
            setProgressColour(d, districtDiseaseProgress);
            setProgressColour(p, placeDiseaseProgress);
        }
        refreshLayout.setRefreshing(false);
    }

    @Override
    public void DiseaseClick(String diseaseNames, String sDate) {
        diseaseName.setText(diseaseNames);
        fromDate.setText(sDate);
        new Thread(new Runnable() {
            @Override
            public void run() {
                new ServerRequest(getActivity()).setUrl(getString(R.string.GetPlaceLevelDiseasesCount) +
                        "/" + stateName.getText().toString() +
                        "/" + districtName.getText().toString() +
                        "/" + placeName.getText().toString() +
                        "/" + diseaseNames +
                        "/" + fromDate.getText().toString() +
                        "/" + toDate.getText().toString(), HomeFragment.this).getDiseasesCount();
            }
        }).start();

    }

}