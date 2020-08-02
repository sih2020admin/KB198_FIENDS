package com.fiends.bware.Activities;

import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;

import androidx.appcompat.app.AppCompatActivity;

import com.fiends.bware.R;
import com.fiends.bware.Utils.BwareFiles;
import com.fiends.bware.Utils.MyWebViewClient;

import org.json.JSONException;
import org.json.JSONObject;

public class WebReportActivity extends AppCompatActivity {

    private String url;
    private WebView reportView;
    private ProgressBar progressBar;
    private LinearLayout llProgressContainer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web_report);

        try {
            JSONObject jsonObject = new JSONObject(new BwareFiles(WebReportActivity.this).readData("Address"));
            url = getString(R.string.ReportLink) + "/" + jsonObject.getString("state") + "/all/" + getIntent().getExtras().getString("DISEASE");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        reportView = findViewById(R.id.report_view);
        progressBar = (ProgressBar) findViewById(R.id.progressBar);
        llProgressContainer = (LinearLayout) findViewById(R.id.llProgressContainer);


        reportView.setWebChromeClient(new WebChromeClient() {
            public void onProgressChanged(WebView view, int progress) {

                llProgressContainer.setVisibility(View.VISIBLE);
                progressBar.setProgress(progress);

            }
        });
        reportView.setWebViewClient(new MyWebViewClient(llProgressContainer));

        initWebView(reportView);
        reportView.loadUrl(url);

    }

    private void initWebView(WebView webView) {
        WebSettings browserSetting = webView.getSettings();

        browserSetting.setJavaScriptEnabled(true);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setBuiltInZoomControls(true);
        webView.getSettings().setDisplayZoomControls(false);
        webView.getSettings().setUseWideViewPort(true);
        webView.getSettings().setLoadWithOverviewMode(true);
    }

}