package com.fiends.bware.Utils;

import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;

import androidx.appcompat.app.AlertDialog;

public class MyWebViewClient extends WebViewClient {

    private LinearLayout llProgressContainer;

    public MyWebViewClient(LinearLayout linearLayout) {
        this.llProgressContainer = linearLayout;
    }

    @Override
    public void onPageStarted(WebView view, String url, Bitmap favicon) {
        //progressBar.setVisibility(View.VISIBLE);
        llProgressContainer.setVisibility(View.VISIBLE);
        super.onPageStarted(view, url, favicon);
    }

    @Override
    public void onPageFinished(WebView view, String url) {
        super.onPageFinished(view, url);

        llProgressContainer.setVisibility(View.GONE);
        //progressBar.setVisibility(View.GONE);
    }
}