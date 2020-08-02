package com.fiends.bware.Adapters;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.fiends.bware.Models.SettingsModel;
import com.fiends.bware.R;

import java.util.ArrayList;

public class SettingsAdapter extends RecyclerView.Adapter<SettingsAdapter.ViewHolder> {

    private ArrayList<SettingsModel> settingsModels;
    private Activity activity;

    public SettingsAdapter(ArrayList<SettingsModel> settingsModels, Activity activity) {
        this.settingsModels = settingsModels;
        this.activity = activity;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater layoutInflater = LayoutInflater.from(parent.getContext());
        View view = layoutInflater.inflate(R.layout.settings_layout_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.settingName.setText(settingsModels.get(position).getSettingsName());
        holder.settingImage.setImageDrawable(settingsModels.get(position).getSettingsImage());
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

            }
        });
    }

    @Override
    public int getItemCount() {
        return settingsModels.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {

        private TextView settingName;
        private ImageView settingImage;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            settingImage = itemView.findViewById(R.id.settings_icon);
            settingName = itemView.findViewById(R.id.settings_name);

        }
    }
}
