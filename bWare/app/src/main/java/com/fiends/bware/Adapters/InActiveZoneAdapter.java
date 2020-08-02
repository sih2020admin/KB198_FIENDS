package com.fiends.bware.Adapters;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.fiends.bware.Activities.WebReportActivity;
import com.fiends.bware.Models.NearByZoneModel;
import com.fiends.bware.R;

import java.util.ArrayList;

import static com.fiends.bware.Utils.Bware.getDate;

public class InActiveZoneAdapter extends RecyclerView.Adapter<InActiveZoneAdapter.ViewHolder> {

    private ArrayList<NearByZoneModel> nearByZoneModels;
    private Activity activity;

    public InActiveZoneAdapter(ArrayList<NearByZoneModel> nearByZoneModels, Activity activity) {
        this.nearByZoneModels = nearByZoneModels;
        this.activity = activity;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater layoutInflater = LayoutInflater.from(parent.getContext());
        View view = layoutInflater.inflate(R.layout.inactive_zone_card, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {


        if (position % 2 == 0) {
            holder.constraintLayout.setBackgroundColor(Color.argb(10, 95, 41, 103));
        } else {
            holder.constraintLayout.setBackgroundColor(Color.argb(50, 98, 0, 238));
        }

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(activity, WebReportActivity.class);
                intent.putExtra("DISEASE",nearByZoneModels.get(position).getDiseaseName());
                activity.startActivity(intent);
            }
        });

        holder.DiseaseName.setText(nearByZoneModels.get(position).getDiseaseName());
        holder.DiseaseDiscription.setText(nearByZoneModels.get(position).getDiseaseDiscription());
        holder.StartDate.setText(getDate(nearByZoneModels.get(position).getStartDate()));
        double temp = Double.parseDouble(nearByZoneModels.get(position).getDistance());
        String dist = String.format("%.0f", temp) + " M";
        if (temp >= 1000) {
            temp *= 0.001;
            dist = String.format("%.0f", temp) + " KM";
        }
        holder.Distance.setText(dist);
    }

    @Override
    public int getItemCount() {
        return nearByZoneModels.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {

        private TextView DiseaseName;
        private TextView DiseaseDiscription;
        private TextView StartDate;
        private TextView Distance;

        private ConstraintLayout constraintLayout;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            DiseaseName = itemView.findViewById(R.id.near_by_zone_disease_name);
            DiseaseDiscription = itemView.findViewById(R.id.near_by_zone_disease_discription);
            StartDate = itemView.findViewById(R.id.start_date);
            Distance = itemView.findViewById(R.id.diatance);
            constraintLayout = itemView.findViewById(R.id.bg_colour);

        }
    }
}
