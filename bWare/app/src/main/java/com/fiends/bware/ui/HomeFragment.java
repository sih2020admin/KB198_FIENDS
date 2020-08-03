package com.fiends.bware.ui;

import android.annotation.SuppressLint;
<<<<<<< HEAD
import android.graphics.Color;
=======
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
<<<<<<< HEAD
=======
import android.widget.ImageView;
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
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

<<<<<<< HEAD
=======
import com.fiends.bware.Activities.MapViewActivity;
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
import com.fiends.bware.Adapters.InActiveZoneAdapter;
import com.fiends.bware.Adapters.NearByZoneAdapter;
import com.fiends.bware.Models.NearByZoneModel;
import com.fiends.bware.Overrides.ServerResponse;
import com.fiends.bware.R;
import com.fiends.bware.Utils.BwareFiles;
import com.fiends.bware.Utils.GetLocation;
import com.fiends.bware.Utils.ServerRequest;
<<<<<<< HEAD
import com.google.android.material.tabs.TabLayout;
import com.mapbox.android.core.permissions.PermissionsListener;
import com.mapbox.android.core.permissions.PermissionsManager;
import com.mapbox.geojson.LineString;
import com.mapbox.geojson.Point;
import com.mapbox.geojson.Polygon;
import com.mapbox.mapboxsdk.Mapbox;
import com.mapbox.mapboxsdk.camera.CameraPosition;
import com.mapbox.mapboxsdk.geometry.LatLng;
import com.mapbox.mapboxsdk.location.LocationComponent;
import com.mapbox.mapboxsdk.location.LocationComponentActivationOptions;
import com.mapbox.mapboxsdk.location.modes.CameraMode;
import com.mapbox.mapboxsdk.location.modes.RenderMode;
import com.mapbox.mapboxsdk.maps.MapboxMap;
import com.mapbox.mapboxsdk.maps.MapboxMapOptions;
import com.mapbox.mapboxsdk.maps.OnMapReadyCallback;
import com.mapbox.mapboxsdk.maps.Style;
import com.mapbox.mapboxsdk.maps.SupportMapFragment;
import com.mapbox.mapboxsdk.style.layers.CircleLayer;
import com.mapbox.mapboxsdk.style.layers.FillLayer;
import com.mapbox.mapboxsdk.style.layers.HeatmapLayer;
import com.mapbox.mapboxsdk.style.layers.SymbolLayer;
import com.mapbox.mapboxsdk.style.sources.GeoJsonSource;
import com.mapbox.turf.TurfMeta;
import com.mapbox.turf.TurfTransformation;
=======
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
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
import com.scwang.wave.MultiWaveHeader;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Calendar;
<<<<<<< HEAD
import java.util.List;

import im.delight.android.location.SimpleLocation;
import io.supercharge.shimmerlayout.ShimmerLayout;
import timber.log.Timber;

import static com.fiends.bware.Utils.Bware.CIRCLE_LAYER_ID;
import static com.fiends.bware.Utils.Bware.RED_ZONE_LAYER_ID;
import static com.fiends.bware.Utils.Bware.RED_ZONE_LAYER_SOURCE;
import static com.fiends.bware.Utils.Bware.RED_ZONE_SOURCE_ID;
import static com.fiends.bware.Utils.Bware.setProgressColour;
import static com.mapbox.mapboxsdk.style.expressions.Expression.get;
import static com.mapbox.mapboxsdk.style.expressions.Expression.heatmapDensity;
import static com.mapbox.mapboxsdk.style.expressions.Expression.interpolate;
import static com.mapbox.mapboxsdk.style.expressions.Expression.linear;
import static com.mapbox.mapboxsdk.style.expressions.Expression.literal;
import static com.mapbox.mapboxsdk.style.expressions.Expression.rgb;
import static com.mapbox.mapboxsdk.style.expressions.Expression.rgba;
import static com.mapbox.mapboxsdk.style.expressions.Expression.stop;
import static com.mapbox.mapboxsdk.style.expressions.Expression.zoom;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.circleColor;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.circleOpacity;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.circleRadius;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.circleStrokeColor;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.circleStrokeWidth;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.fillColor;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.fillOpacity;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.heatmapColor;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.heatmapIntensity;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.heatmapOpacity;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.heatmapRadius;
import static com.mapbox.mapboxsdk.style.layers.PropertyFactory.heatmapWeight;
import static com.mapbox.turf.TurfConstants.UNIT_KILOMETERS;

public class HomeFragment extends Fragment implements ServerResponse, OnMapReadyCallback, PermissionsListener {
=======

import im.delight.android.location.SimpleLocation;
import io.supercharge.shimmerlayout.ShimmerLayout;

import static com.fiends.bware.Utils.Bware.setProgressColour;

public class HomeFragment extends Fragment implements ServerResponse, OnMapReadyCallback {
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186

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
<<<<<<< HEAD
    private PermissionsManager permissionsManager;
    private LocationComponent locationComponent;
=======
    private ImageView FullMap;
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186

    private ProgressBar stateDiseaseProgress;
    private ProgressBar districtDiseaseProgress;
    private ProgressBar placeDiseaseProgress;
<<<<<<< HEAD
    private MapboxMap mapboxMap;
=======
    private GoogleMap mMap;
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186

    private MultiWaveHeader multiWaveHeader;
    private TextView appName;
    private LinearLayout statusBar;
    private SwipeRefreshLayout refreshLayout;

    private RecyclerView inActiveOutrageRecyclerView;
    private InActiveZoneAdapter inActiveZoneAdapter;
    private ShimmerLayout sliderShimmer;
    private ShimmerLayout outrageShimmer;

<<<<<<< HEAD
//    private static final String TAG = "FilterActivity";
//    private static final String TURF_CALCULATION_FILL_LAYER_GEOJSON_SOURCE_ID
//            = "TURF_CALCULATION_FILL_LAYER_GEOJSON_SOURCE_ID";
//    private static final String TURF_CALCULATION_FILL_LAYER_ID = "TURF_CALCULATION_FILL_LAYER_ID";
//    private static final int RADIUS_SEEKBAR_DIFFERENCE = 1;
//    private static final int RADIUS_SEEKBAR_MAX = 10;
//    private static final Point DOWNTOWN_MUNICH_START_LOCATION =
//            Point.fromLngLat(11.5753822, 48.1371079);
//    private Point lastClickPoint;
//    private int circleRadius = RADIUS_SEEKBAR_MAX / 2;
//    private TextView circleRadiusTextView;
=======
    private View NoRedZone;
    private View NearByZone;
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

<<<<<<< HEAD
        Mapbox.getInstance(getContext(), getString(R.string.access_token));
=======
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
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
<<<<<<< HEAD
=======
        FullMap = root.findViewById(R.id.full_map_screen);
        NoRedZone = root.findViewById(R.id.no_red_zone_layer);
        NearByZone = root.findViewById(R.id.no_near_by_zone);

>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
        sliderShimmer.startShimmerAnimation();
        sliderShimmer.setShimmerAnimationDuration(2000);
        outrageShimmer.setShimmerAnimationDuration(1000);
        outrageShimmer.startShimmerAnimation();
        refreshLayout.setRefreshing(true);

<<<<<<< HEAD
=======
        FullMap.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(getActivity(), MapViewActivity.class));
            }
        });
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
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
<<<<<<< HEAD
        SupportMapFragment mapFragment;
        if (savedInstanceState == null) {

            final FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
            MapboxMapOptions options = MapboxMapOptions.createFromAttributes(getContext(), null);
            SimpleLocation location = new SimpleLocation(getContext());
                    options.camera(new CameraPosition.Builder()
                            .target(new LatLng(location.getLatitude(), location.getLongitude()))
                            .zoom(12)
                            .build());
            mapFragment = SupportMapFragment.newInstance(options);
            transaction.add(R.id.mapContainer, mapFragment, "com.mapbox.map");
            transaction.commit();
        } else {
            mapFragment = (SupportMapFragment) getActivity().getSupportFragmentManager().findFragmentByTag("com.mapbox.map");
        }
        if (mapFragment != null) {
            mapFragment.getMapAsync(HomeFragment.this);
=======

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
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
        }
    }

    private void updateStatus(final String distance) {

<<<<<<< HEAD
        SimpleLocation location = new SimpleLocation(getContext(), true);
=======
        SimpleLocation location = new SimpleLocation(getContext());
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
        String locations = "[" + location.getLongitude() + ", " + location.getLatitude() + "]";
        nearByZonePager.removeAllViews();
        sliderShimmer.setVisibility(View.VISIBLE);
        sliderShimmer.startShimmerAnimation();
<<<<<<< HEAD
        initZoneSlider(distance, locations);
        initRedZone(locations, "activeOutrages");
=======
        new GetLocation(getActivity(), new GetLocation.Response() {
            @Override
            public void getLocation(String latitude, String longitude) {
                String location = "[" + longitude + ", " + latitude + "]";
                initRedZone(location, "activeOutrages");
            }
        });
        initZoneSlider(distance, locations);
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186

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
<<<<<<< HEAD
            initNearByZoneSlider(nearByZoneModels);
        } else {
            nearByZonePager.removeAllViews();
=======
            NearByZone.setVisibility(View.INVISIBLE);
            initNearByZoneSlider(nearByZoneModels);
        } else {
            nearByZonePager.removeAllViews();
            NearByZone.setVisibility(View.VISIBLE);
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
            Toast.makeText(getActivity(), "Failed to load.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void RedZone(boolean success, ArrayList<NearByZoneModel> nearByZoneModels, ArrayList<NearByZoneModel> redZoneLocationModel) {
        if (success) {
<<<<<<< HEAD
            if (nearByZoneModels.size() == 0 && redZoneLocationModel.size() == 0) {
                outrageShimmer.setVisibility(View.VISIBLE);
                outrageShimmer.startShimmerAnimation();
            } else {
                outrageShimmer.stopShimmerAnimation();
                outrageShimmer.setVisibility(View.INVISIBLE);
            }
            initRedZone(nearByZoneModels);
//            setUpMapLayer(redZoneLocationModel);
=======
            if (nearByZoneModels.size() == 0) {
                NoRedZone.setVisibility(View.VISIBLE);
            } else {
                outrageShimmer.stopShimmerAnimation();
                outrageShimmer.setVisibility(View.INVISIBLE);
                NoRedZone.setVisibility(View.INVISIBLE);
            }
            initRedZone(nearByZoneModels);
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
        } else {
            inActiveOutrageRecyclerView.removeAllViews();
            Toast.makeText(getActivity(), "Failed to load.", Toast.LENGTH_SHORT).show();
        }
    }

<<<<<<< HEAD
    @Override
    public void RedZoneResponse(boolean success, String response) {
        if (success) {
            mapboxMap.getStyle(new Style.OnStyleLoaded() {
                @Override
                public void onStyleLoaded(@NonNull Style style) {

                    new Handler().postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            style.removeLayer(RED_ZONE_LAYER_ID);
                            style.removeLayer(RED_ZONE_LAYER_SOURCE);
                            style.removeLayer(CIRCLE_LAYER_ID);
                            style.removeSource(RED_ZONE_SOURCE_ID);
                            addEarthquakeSource(style);
                            addHeatmapLayer(style);
                            addCircleLayer(style);
                            enableLocationComponent(style);
                        }
                    }, 2000);
                }
            });
        }
    }


//
//    private void setUpMapLayer(ArrayList<NearByZoneModel> redZoneLocationModel) {
//
//        initPolygonCircleFillLayer();
//        ArrayList<Double> latitude = new ArrayList<>();
//        ArrayList<Double> longitude = new ArrayList<>();
//
//        for (int i=0; i<redZoneLocationModel.size(); i++) {
//            try {
//                JSONArray jsonArray = new JSONArray(redZoneLocationModel.get(i).getLocation());
//                longitude.add(Double.parseDouble(jsonArray.get(0).toString()));
//                latitude.add(Double.parseDouble(jsonArray.get(1).toString()));
//            } catch (JSONException e) {
//                e.printStackTrace();
//            }
//        }
//
//        for (int i=0; i<latitude.size(); i++) {
//            lastClickPoint = Point.fromLngLat(longitude.get(i), latitude.get(i));
//            drawPolygonCircle(lastClickPoint);
//        }
//    }
//
//    private void initPolygonCircleFillLayer() {
//        mapboxMap.getStyle(new Style.OnStyleLoaded() {
//            @Override
//            public void onStyleLoaded(@NonNull Style style) {
//
//                FillLayer fillLayer = new FillLayer(TURF_CALCULATION_FILL_LAYER_ID,
//                        TURF_CALCULATION_FILL_LAYER_GEOJSON_SOURCE_ID);
//                fillLayer.setProperties(
//                        fillColor(Color.parseColor("#f5425d")),
//                        fillOpacity(.5f));
//                style.addLayerBelow(fillLayer, "poi-label");
//            }
//        });
//    }
//
//    private void drawPolygonCircle(Point circleCenter) {
//        mapboxMap.getStyle(new Style.OnStyleLoaded() {
//            @Override
//            public void onStyleLoaded(@NonNull Style style) {
//
//                Polygon polygonArea = getTurfPolygon(circleCenter, circleRadius, UNIT_KILOMETERS);
//                List<Point> pointList = TurfMeta.coordAll(polygonArea, false);
//                GeoJsonSource polygonCircleSource = style.getSourceAs(TURF_CALCULATION_FILL_LAYER_GEOJSON_SOURCE_ID);
//                if (polygonCircleSource != null) {
//                    polygonCircleSource.setGeoJson(Polygon.fromOuterInner(
//                            LineString.fromLngLats(pointList)));
//                }
//                List<LatLng> latLngList = new ArrayList<>(pointList.size());
//                for (Point singlePoint : pointList) {
//                    latLngList.add(new LatLng((singlePoint.latitude()), singlePoint.longitude()));
//                }
//
//            }
//        });
//    }
//
//    private Polygon getTurfPolygon(@NonNull Point centerPoint, double radius,
//                                   @NonNull String units) {
//        return TurfTransformation.circle(centerPoint, radius / 10, 360, units);
//    }

=======
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
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186

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

<<<<<<< HEAD
    @Override
    public void onMapReady(@NonNull MapboxMap mapboxMap) {
        this.mapboxMap = mapboxMap;
        mapboxMap.setStyle(Style.DARK);
    }

    private void addEarthquakeSource(@NonNull Style loadedMapStyle) {
        try {
            loadedMapStyle.addSource(new GeoJsonSource(RED_ZONE_SOURCE_ID, new URI(new BwareFiles(getActivity()).getFileUri("Red Zone","json"))));
        } catch (URISyntaxException uriSyntaxException) {
            Timber.e(uriSyntaxException, "That's not an url... ");
        }
    }

    private void addHeatmapLayer(@NonNull Style loadedMapStyle) {
        HeatmapLayer layer = new HeatmapLayer(RED_ZONE_LAYER_ID, RED_ZONE_SOURCE_ID);
        layer.setMaxZoom(9);
        layer.setSourceLayer(RED_ZONE_LAYER_SOURCE);
        layer.setProperties(

                heatmapColor(
                        interpolate(
                                linear(), heatmapDensity(),
                                literal(0), rgba(33, 102, 172, 0),
                                literal(0.2), rgb(103, 169, 207),
                                literal(0.4), rgb(209, 229, 240),
                                literal(0.6), rgb(253, 219, 199),
                                literal(0.8), rgb(239, 138, 98),
                                literal(1), rgb(178, 24, 43)
                        )
                ),

                heatmapWeight(
                        interpolate(
                                linear(), get("alertRadius"),
                                stop(0, 0),
                                stop(6, 1)
                        )
                ),

                heatmapIntensity(
                        interpolate(
                                linear(), zoom(),
                                stop(0, 1),
                                stop(9, 3)
                        )
                ),

                heatmapRadius(
                        interpolate(
                                linear(), zoom(),
                                stop(0, 2),
                                stop(9, 20)
                        )
                ),

                heatmapOpacity(
                        interpolate(
                                linear(), zoom(),
                                stop(7, 1),
                                stop(9, 0)
                        )
                )
        );

        loadedMapStyle.addLayerAbove(layer, "waterway-label");
    }

    private void addCircleLayer(@NonNull Style loadedMapStyle) {
        CircleLayer circleLayer = new CircleLayer(CIRCLE_LAYER_ID, RED_ZONE_SOURCE_ID);
        circleLayer.setProperties(

// Size circle radius by earthquake magnitude and zoom level
                circleRadius(
                        interpolate(
                                linear(), zoom(),
                                literal(7), interpolate(
                                        linear(), get("alertRadius"),
                                        stop(1, 1),
                                        stop(6, 4)
                                ),
                                literal(16), interpolate(
                                        linear(), get("alertRadius"),
                                        stop(1, 5),
                                        stop(6, 50)
                                )
                        )
                ),

// Color circle by earthquake magnitude
                circleColor(
                        interpolate(
                                linear(), get("alertRadius"),
                                literal(1), rgba(33, 102, 172, 0),
                                literal(2), rgb(103, 169, 207),
                                literal(3), rgb(209, 229, 240),
                                literal(4), rgb(253, 219, 199),
                                literal(5), rgb(239, 138, 98),
                                literal(6), rgb(178, 24, 43)
                        )
                ),

// Transition from heatmap to circle layer by zoom level
                circleOpacity(
                        interpolate(
                                linear(), zoom(),
                                stop(7, 0),
                                stop(8, 1)
                        )
                ),
                circleStrokeColor("white"),
                circleStrokeWidth(1.0f)
        );

        loadedMapStyle.addLayerBelow(circleLayer, RED_ZONE_LAYER_ID);
    }

    @SuppressLint("MissingPermission")
    private void enableLocationComponent(@NonNull Style style) {
        if (PermissionsManager.areLocationPermissionsGranted(getContext())) {
            locationComponent = mapboxMap.getLocationComponent();
            locationComponent.activateLocationComponent(
                    LocationComponentActivationOptions.builder(getContext(),
                            style).build()
            );
            locationComponent.setLocationComponentEnabled(true);
            locationComponent.setCameraMode(CameraMode.TRACKING);
            locationComponent.setRenderMode(RenderMode.COMPASS);
        } else {
            permissionsManager = new PermissionsManager(this);
            permissionsManager.requestLocationPermissions(getActivity());
        }
    }

    @Override
    public void onExplanationNeeded(List<String> permissionsToExplain) {

    }

    @Override
    public void onPermissionResult(boolean granted) {

    }

=======
>>>>>>> 48a60c4102f13fe2ac8838f56c44906d17ae4186
}