package com.fiends.bware.ui;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;

import com.fiends.bware.R;
import com.fiends.bware.Utils.MyWebViewClient;

public class SymptomsFragment extends Fragment {

    private String url;
    private WebView reportView;
    private ProgressBar progressBar;
    private LinearLayout llProgressContainer;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_symptoms, container, false);

        reportView = root.findViewById(R.id.report_view);
        progressBar = (ProgressBar) root.findViewById(R.id.progressBar);
        llProgressContainer = (LinearLayout) root.findViewById(R.id.llProgressContainer);

        url = getString(R.string.SymptomsLink);

        reportView.setWebChromeClient(new WebChromeClient() {
            public void onProgressChanged(WebView view, int progress) {

                llProgressContainer.setVisibility(View.VISIBLE);
                progressBar.setProgress(progress);

            }
        });
        reportView.setWebViewClient(new MyWebViewClient(llProgressContainer));

        initWebView(reportView);
        reportView.loadUrl(url);

        return root;
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