package com.theqrl;

        import android.content.SharedPreferences;
        import android.os.Bundle;
        import android.view.WindowManager;
        import android.webkit.WebView;

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
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);
        preferences = getSharedPreferences("qrlpref", MODE_PRIVATE);
//        WebView.setWebContentsDebuggingEnabled(true);
    }

    @Override
    protected String getMainComponentName() {
        return "theQRL";
    }

}
