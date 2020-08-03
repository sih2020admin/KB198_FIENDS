package com.fiends.bware.Adapters;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.viewpager.widget.PagerAdapter;

import com.fiends.bware.Activities.WebReportActivity;
import com.fiends.bware.Models.NearByZoneModel;
import com.fiends.bware.Overrides.ServerResponse;
import com.fiends.bware.R;

import java.util.ArrayList;

import static com.fiends.bware.Utils.Bware.getDate;

public class NearByZoneAdapter extends PagerAdapter {

    private ArrayList<NearByZoneModel> nearByZoneModels;
    private Activity activity;
    private ServerResponse serverResponse;

    private TextView DiseaseName;
    private TextView DiseaseDiscription;
    private TextView StartDate;
    private TextView Distance;
    private ImageView Report;

    public NearByZoneAdapter(ArrayList<NearByZoneModel> nearByZoneModels, Activity activity, ServerResponse serverResponse) {
        this.nearByZoneModels = nearByZoneModels;
        this.activity = activity;
        this.serverResponse = serverResponse;
    }

    @NonNull
    @Override
    public Object instantiateItem(@NonNull ViewGroup container, final int position) {

        LayoutInflater inflater = (LayoutInflater) activity.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View sliderLayout = inflater.inflate(R.layout.near_by_zone_slider_card, null);

        DiseaseName = sliderLayout.findViewById(R.id.near_by_zone_disease_name);
        DiseaseDiscription = sliderLayout.findViewById(R.id.near_by_zone_disease_discription);
        StartDate = sliderLayout.findViewById(R.id.start_date);
        Distance = sliderLayout.findViewById(R.id.diatance);
        Report = sliderLayout.findViewById(R.id.report_view);

        DiseaseName.setText(nearByZoneModels.get(position).getDiseaseName());
        DiseaseDiscription.setText(nearByZoneModels.get(position).getDiseaseDiscription());
        StartDate.setText(getDate(nearByZoneModels.get(position).getStartDate()));

        double temp = Double.parseDouble(nearByZoneModels.get(position).getDistance());
        String dist = String.format("%.0f", temp)+" M";
        if (temp >= 1000) {
            temp *= 0.001;
            dist = String.format("%.0f", temp)+" KM";
        }
        Distance.setText(dist);

        Report.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(activity, WebReportActivity.class);
                intent.putExtra("DISEASE",nearByZoneModels.get(position).getDiseaseName());
                activity.startActivity(intent);
            }
        });

        sliderLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("NITHIN_AASHIK_PS_1", "1");
                serverResponse.DiseaseClick(nearByZoneModels.get(position).getDiseaseName(),
                        nearByZoneModels.get(position).getStartDate());
            }
        });

        if (position == 0) {
            Log.i("NITHIN_AASHIK_PS_2", "2");
            serverResponse.DiseaseClick(nearByZoneModels.get(0).getDiseaseName(),
                    nearByZoneModels.get(0).getStartDate());
        }

        container.addView(sliderLayout);
        return sliderLayout;
    }

    @Override
    public int getCount() {
        return nearByZoneModels.size();
    }

    @Override
    public boolean isViewFromObject(@NonNull View view, @NonNull Object object) {
        return view == object;
    }

    @Override
    public void destroyItem(@NonNull ViewGroup container, int position, @NonNull Object object) {
        container.removeView((View) object);
    }
}
