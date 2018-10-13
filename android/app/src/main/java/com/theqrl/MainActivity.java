package com.theqrl;

import android.content.SharedPreferences;
import android.os.Bundle;

import com.facebook.react.ReactActivity;

import java.io.IOException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;

public class MainActivity extends ReactActivity {

    // required for SharedPreferences
    public static SharedPreferences preferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        preferences = getSharedPreferences("qrlpref", MODE_PRIVATE);
    }

    @Override
    protected String getMainComponentName() {
        return "theQRL";
    }

}
