package com.theqrl;

import android.content.Context;
import android.content.SharedPreferences;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.network.TLSSocketFactory;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.google.protobuf.ByteString;
import com.google.protobuf.Internal;
//import com.theqrl.PublicAPI.GetAddressStateReq;
//import com.theqrl.PublicAPI.GetAddressStateResp;
//import com.theqrl.PublicAPI.GetNodeStateReq;
//import com.theqrl.PublicAPI.GetNodeStateResp;
//import com.theqrl.PublicAPI.GetObjectReq;
//import com.theqrl.PublicAPI.GetObjectResp;
//import com.theqrl.PublicAPI.PublicAPIGrpc;
//import com.theqrl.PublicAPI.PushTransactionReq;
//import com.theqrl.PublicAPI.PushTransactionResp;
//import com.theqrl.PublicAPI.Transaction;
//import com.theqrl.PublicAPI.TransferCoinsReq;
//import com.theqrl.PublicAPI.TransferCoinsResp;
//import com.theqrl.PublicAPI.EncryptedEphemeralMessage;
//import com.theqrl.PublicAPI.GetNodeStateReq;
//import com.theqrl.PublicAPI.GetNodeStateReqOrBuilder;
//import com.theqrl.PublicAPI.qrlPubilicAPI;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SignatureException;
import java.security.UnrecoverableEntryException;
import java.security.cert.CertificateException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.internal.DnsNameResolverProvider;
import io.grpc.okhttp.OkHttpChannelBuilder;
import io.grpc.okhttp.OkHttpChannelProvider;
import io.grpc.stub.StreamObserver;
import qrl.PublicAPIGrpc;
import qrl.Qrl;

import static android.content.ContentValues.TAG;
import static android.content.Context.MODE_PRIVATE;

//import static com.theqrl.PublicAPI.PublicAPIGrpc.getGetObjectMethod;
//import static com.theqrl.PublicAPI.PublicAPIGrpc.newBlockingStub;


public class AndroidWalletModule extends ReactContextBaseJavaModule {

    static {
        // load the C-library
        System.loadLibrary("qrllib");
        System.loadLibrary("shasha");
        System.loadLibrary("android_wallet_jni");
    }

    private Encryptor encryptor;
    private Decryptor decryptor;

    public AndroidWalletModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native
        encryptor = new Encryptor();

        try {
            decryptor = new Decryptor();
        } catch (CertificateException | NoSuchAlgorithmException | KeyStoreException |
                IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getName() {
        return "AndroidWallet"; //AndroidWallet is how this module will be referred to from React Native
    }

    // Declaration of native method
    public native String createWallet(int treeHeight, int hashFunction);
    public native String openWalletWithHexseed(String hexseed);
    public native String transferCoins(String address, int amount, int fee, String hexseed, int otsIndex);
    public native String getMnemonic(String hexseed);
    private ManagedChannel channel;

    public static String server = "testnet-2.automated.theqrl.org";
    public static int port = 19009;

    // encrypt and save information to shared preferences
    private void saveEncrypted(String key, String value){
        try{
            final byte[] encryptedText = encryptor.encryptText(key, value);
        } catch (UnrecoverableEntryException | NoSuchAlgorithmException | NoSuchProviderException |
                KeyStoreException | IOException | NoSuchPaddingException | InvalidKeyException | InvalidAlgorithmParameterException | SignatureException |
                IllegalBlockSizeException | BadPaddingException e) {
            Log.e(TAG, "onClick() called with: " + e.getMessage(), e);
        }
    }

    // get information from shared preferences and decrypt
    private String getEncrypted(String key){
        try {
            return decryptor.decryptData(key, encryptor.getEncryption(key), encryptor.getIv(key));
        } catch (UnrecoverableEntryException | NoSuchAlgorithmException |
                KeyStoreException | NoSuchPaddingException | NoSuchProviderException |
                IOException | InvalidKeyException | IllegalBlockSizeException | BadPaddingException | InvalidAlgorithmParameterException e) {
            Log.e(TAG, "decryptData() called with: " + e.getMessage(), e);
            return "";
        }
    }

    // Create a QRL wallet from scratch
    @ReactMethod
    public void createWallet(int treeHeight, int hashFunction, Callback errorCallback, Callback successCallback) {
        try {
            String hexSeed = createWallet(treeHeight, hashFunction);
            // save the required information to Shared Preferences
            saveEncrypted("hexseed", hexSeed.split(" ")[0]);
            saveEncrypted("address", hexSeed.split(" ")[1]);
            saveEncrypted("xmsspk", hexSeed.split(" ")[2]);
            successCallback.invoke("success");
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    // Open an  existingQRL wallet with hexseed
    @ReactMethod
    public void openWalletWithHexseed(String hexseed, Callback errorCallback, Callback successCallback) {
        try {
            String hexSeed = openWalletWithHexseed(hexseed);
            saveEncrypted("hexseed", hexSeed.split(" ")[0]);
            saveEncrypted("address", hexSeed.split(" ")[1]);
            saveEncrypted("xmsspk", hexSeed.split(" ")[2]);
            successCallback.invoke("success");
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    // Show hexseed and mnemonic to user
    @ReactMethod
    public void sendWalletPrivateInfo(Callback errorCallback, Callback successCallback) {
        String hexseed = getEncrypted("hexseed");
        try {
            String mnemonic = getMnemonic(hexseed);
            successCallback.invoke( mnemonic, hexseed);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    // Check if user has pending tx
    @ReactMethod
    public void checkPendingTx(Callback errorCallback, Callback successCallback) {
//        String address = PreferenceHelper.getString("address");
        String walletAddress = getEncrypted("address");
        int len = walletAddress.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(walletAddress.charAt(i), 16) << 4)
                    + Character.digit(walletAddress.charAt(i+1), 16));
        }

        try {
            ManagedChannel channel = OkHttpChannelBuilder.forAddress(server , port).usePlaintext(true).build();
            PublicAPIGrpc.PublicAPIBlockingStub blockingStub = PublicAPIGrpc.newBlockingStub(channel);
            // get all tx unconfirmed
            Qrl.GetLatestDataReq getLatestDataReq = Qrl.GetLatestDataReq.newBuilder().setFilter(Qrl.GetLatestDataReq.Filter.TRANSACTIONS_UNCONFIRMED).build();
            Qrl.GetLatestDataResp getLatestDataResp = blockingStub.getLatestData(getLatestDataReq);

            // no unconfirmed tx
            if (getLatestDataResp.getTransactionsUnconfirmedCount() == 0){
                successCallback.invoke("success");
            }
            // unconfirmed tx found
            else {
                int found = 0;
                for (int i=0; i<getLatestDataResp.getTransactionsUnconfirmedCount(); i++ ){
                    // check if there is a pending tx for the given wallet address
                    if ( ByteString.copyFrom(data).equals(getLatestDataResp.getTransactionsUnconfirmed(i).getAddrFrom()) ){
                        found++;
                        successCallback.invoke("error");
                    }
                }
                if (found == 0){
                    successCallback.invoke("success");
                }
            }

        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    // Send walet related information to RN
    @ReactMethod
    // Method to update the wallet's balance
    public void refreshWallet(Callback errorCallback, Callback successCallback) {
        System.out.println( "refresWallet from Android" );
        String walletAddress = getEncrypted("address");
        // get the list of the latest 10 tx
        int completed = 0;
        try {
            ManagedChannel channel = OkHttpChannelBuilder.forAddress(server , port).usePlaintext(true).build();
            PublicAPIGrpc.PublicAPIBlockingStub blockingStub = PublicAPIGrpc.newBlockingStub(channel);

            int len = walletAddress.length();
            byte[] data = new byte[len / 2];
            for (int i = 0; i < len; i += 2) {
                data[i / 2] = (byte) ((Character.digit(walletAddress.charAt(i), 16) << 4)
                        + Character.digit(walletAddress.charAt(i+1), 16));
            }
            Qrl.GetAddressStateReq getAddressStateReq = Qrl.GetAddressStateReq.newBuilder().setAddress(ByteString.copyFrom(data)).build();
            Qrl.GetAddressStateResp getAddressStateResp = blockingStub.getAddressState(getAddressStateReq);

            // number of tx of the wallet
            int tx_count = getAddressStateResp.getState().getTransactionHashesCount();
            // prepare to loop through the latest 10 tx
            int tx_end;
            int tx_total;
            if (tx_count < 10) {
                tx_end = -1;
                tx_total = tx_count;
            }
            else {
                tx_end = tx_count - 11;
                tx_total = 10;
            }
            // JSON Array to save information related to tx and send back to RN
            JSONArray txJsonAll = new JSONArray();


            if (tx_count == 0){
                successCallback.invoke( walletAddress, 0 ,Long.toString(getAddressStateResp.getState().getBalance()), txJsonAll.toString() );
            }
            else {
                for (int i = tx_count - 1 ; i > tx_end ; i -= 1) {
                    // get txhashbytes and call getObject for each tx
                    ByteString txhashbytes = getAddressStateResp.getState().getTransactionHashesList().get(i);
                    // call getObject method from API for each transactions
                    Qrl.GetObjectReq getObjectReq = Qrl.GetObjectReq.newBuilder().setQuery(txhashbytes).build();
                    Qrl.GetObjectResp getObjectResp = blockingStub.getObject(getObjectReq);
                    // date formatter
                    SimpleDateFormat dt = new SimpleDateFormat("h:mm a, MMM d yyyy");
                    Date date = new Date(getObjectResp.getTransaction().getTimestampSeconds() * 1000);
                    // JSON object to save information realted to each tx
                    JSONObject txJson = new JSONObject();

                    // converting a ByteString to hexstring (https://stackoverflow.com/a/13006907)
                    // 1. convert ByteString to byte[]
                    // 2. convert byte[] to hexstring using StringBuilder
                    byte[] txHashByte = getObjectResp.getTransaction().getTx().getTransactionHash().toByteArray();
                    StringBuilder txHashString = new StringBuilder(txHashByte.length * 2);
                    for(byte txbyte: txHashByte)
                        txHashString.append(String.format("%02x", txbyte));


                    try{
                        txJson.put("title","SENT");
                        txJson.put("desc", getObjectResp.getTransaction().getTx().getTransfer().getAmounts(0));
                        txJson.put("date", dt.format(date) ) ;
                        txJson.put("txhash", txHashString.toString() ) ;
                        txJsonAll.put(txJson);
                        completed++;
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    int otsIndex = -1;
                    if (completed == tx_total){
                        // check latest available ots index
                        for (int j=0; j<getAddressStateResp.getState().getOtsBitfieldCount(); j++){
                            // Byte to binaryString (https://stackoverflow.com/questions/12310017/how-to-convert-a-byte-to-its-binary-string-representation)
                            byte bitfiedByte = getAddressStateResp.getState().getOtsBitfield(j).byteAt(0);
                            String bitfieldString = String.format("%8s", Integer.toBinaryString(bitfiedByte & 0xFF)).replace(' ', '0');
                            String bitfieldStringBigendian = new StringBuffer(bitfieldString).reverse().toString();

                            // System.out.println( Integer.toString(bitfiedInt,2));
                            if (bitfiedByte != -1){
                                System.out.println(bitfieldStringBigendian);
                                for (int o=0; o<bitfieldStringBigendian.length(); o++) {
                                    if (bitfieldStringBigendian.charAt(o) == '0') {
                                        otsIndex = (8 * j) + o;
                                        System.out.println("NEXT OTS INDEX IS");
                                        System.out.println(otsIndex);
                                        break;
                                    }
                                }
                            }
                            System.out.println( "OTSINDEX IS: " );
                            System.out.println( otsIndex );
                            // obtained next available ots index
                            if (otsIndex > 0){
                                successCallback.invoke( walletAddress, otsIndex ,Long.toString(getAddressStateResp.getState().getBalance()), txJsonAll.toString() );
                                break;
                            }
                        }
                    }
                }
            }
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }


    @ReactMethod
    public void transferCoins(String recipient, int amount, int otsIndex, int fee, Callback errorCallback, Callback successCallback) {

        System.out.println( "Transfer Coins from Android" );
        System.out.println( Long.valueOf(amount) * 1000000000 );
        Long amount_long = Long.valueOf(amount) * 1000000000;
        String hexseed = getEncrypted("hexseed");
        System.out.println( hexseed );
        ManagedChannel channel = OkHttpChannelBuilder.forAddress(server, port).usePlaintext(true).build();
        PublicAPIGrpc.PublicAPIBlockingStub blockingStub = PublicAPIGrpc.newBlockingStub(channel);

        // converting the wallet address to byte array
        String walletAddress = getEncrypted("address");
        System.out.println( walletAddress );
//        int len = walletAddress.length();
//        byte[] data = new byte[len / 2];
//        for (int i = 0; i < len; i += 2) {
//            data[i / 2] = (byte) ((Character.digit(walletAddress.charAt(i), 16) << 4)
//                    + Character.digit(walletAddress.charAt(i+1), 16));
//        }

        // converting the recipient address to byte arary
        String recipientAddress = recipient.substring(1);
        int reclen = recipientAddress.length();
        byte[] recdata = new byte[reclen / 2];
        for (int i = 0; i < reclen; i += 2) {
            recdata[i / 2] = (byte) ((Character.digit(recipientAddress.charAt(i), 16) << 4)
                    + Character.digit(recipientAddress.charAt(i+1), 16));
        }

        // converting xmssPK to byte array
//        String xmssPK = PreferenceHelper.getString("xmsspk");
        String xmssPK = getEncrypted("xmsspk");
        System.out.println( xmssPK );
        int xmsslen = xmssPK.length();
        byte[] xmssdata = new byte[xmsslen / 2];
        for (int i = 0; i < xmsslen; i += 2) {
            xmssdata[i / 2] = (byte) ((Character.digit(xmssPK.charAt(i), 16) << 4) + Character.digit(xmssPK.charAt(i+1), 16));
        }

        Qrl.TransferCoinsReq transferCoinsReq = Qrl.TransferCoinsReq.newBuilder().addAddressesTo(ByteString.copyFrom(recdata)).addAmounts(amount_long).setFee(fee).setXmssPk(ByteString.copyFrom(xmssdata)).build();
        Qrl.TransferCoinsResp transferCoinsResp = blockingStub.transferCoins(transferCoinsReq);

        try {
            // converting the amount and fee to long before passing to cpp
            String androidWallet = transferCoins(recipientAddress, amount, fee, hexseed, otsIndex);

//            System.out.println( androidWallet.length() )  ;
//            System.out.println( androidWallet )  ;
//
            String signature = androidWallet.substring(0, 5000);
            String txHash = androidWallet.substring(5000, 5064);
//            System.out.println( "NOW SIGNATURE AND TXHASH RECEIVED IN JAVA" )  ;
//            System.out.println( signature.length() )  ;
//            System.out.println( signature )  ;
//            System.out.println( txHash )  ;

            // converting signature to ByteString
            int txsiglen = signature.length();
            byte[] txsig = new byte[txsiglen / 2];
            for (int i = 0; i < txsiglen; i += 2) {
                txsig[i / 2] = (byte) ((Character.digit(signature.charAt(i), 16) << 4) + Character.digit(signature.charAt(i+1), 16));
            }
            System.out.println( txsig )  ;

            // converting txhash to ByteString
            int txhashlen = txHash.length();
            byte[] txhash = new byte[txhashlen / 2];
            for (int i = 0; i < txhashlen; i += 2) {
                txhash[i / 2] = (byte) ((Character.digit(txHash.charAt(i), 16) << 4) + Character.digit(txHash.charAt(i+1), 16));
            }

            Qrl.Transaction signedTx = Qrl.Transaction.newBuilder().setTransfer(Qrl.Transaction.Transfer.newBuilder().addAddrsTo(transferCoinsResp.getExtendedTransactionUnsigned().getTx().getTransfer().getAddrsTo(0)).addAmounts(amount_long)).setFee(fee).setSignature(ByteString.copyFrom(txsig)).setTransactionHash(ByteString.copyFrom(txhash)).setPublicKey(transferCoinsResp.getExtendedTransactionUnsigned().getTx().getPublicKey()).setNonce(12).build();
            Qrl.PushTransactionReq pushtransactionReq = Qrl.PushTransactionReq.newBuilder().setTransactionSigned(signedTx).build();
            Qrl.PushTransactionResp pushTransactionResp = blockingStub.pushTransaction(pushtransactionReq);

            successCallback.invoke("success");
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void closeWallet(Callback errorCallback, Callback successCallback) {
        PreferenceHelper.clearPreferences();
        successCallback.invoke("success");
    }


    @ReactMethod
    public void getTxDetails(String txhash, Callback errorCallback, Callback successCallback) {

        System.out.println( "TXHASH Andrdoid" );
        System.out.println( txhash );

        // converting txhash to byte arary
        int txlen = txhash.length();
        byte[] txdata = new byte[txlen / 2];
        for (int i = 0; i < txlen; i += 2) {
            txdata[i / 2] = (byte) ((Character.digit(txhash.charAt(i), 16) << 4)
                    + Character.digit(txhash.charAt(i+1), 16));
        }

        ManagedChannel channel = OkHttpChannelBuilder.forAddress(server, port).usePlaintext(true).build();
        PublicAPIGrpc.PublicAPIBlockingStub blockingStub = PublicAPIGrpc.newBlockingStub(channel);

        Qrl.GetObjectReq getObjectReq = Qrl.GetObjectReq.newBuilder().setQuery(ByteString.copyFrom(txdata)).build();
        Qrl.GetObjectResp getObjectResp = blockingStub.getObject(getObjectReq);

        // converting a ByteString to hexstring (https://stackoverflow.com/a/13006907)
        // 1. convert ByteString to byte[]
        // 2. convert byte[] to hexstring using StringBuilder
        byte[] addrFromByte = getObjectResp.getTransaction().getAddrFrom().toByteArray();
        StringBuilder addrFromString = new StringBuilder(addrFromByte.length * 2);
        for(byte txbyte: addrFromByte)
            addrFromString.append(String.format("%02x", txbyte));

        byte[] addrToByte = getObjectResp.getTransaction().getTx().getTransfer().getAddrsTo(0).toByteArray();
        StringBuilder addrToString = new StringBuilder(addrToByte.length * 2);
        for(byte txbyte: addrToByte)
            addrToString.append(String.format("%02x", txbyte));

        JSONObject txJson = new JSONObject();

        try{
            txJson.put("blocknumber", getObjectResp.getTransaction().getHeader().getBlockNumber() );
            txJson.put("nonce", getObjectResp.getTransaction().getTx().getNonce() );
            txJson.put("from", addrFromString ) ;
            txJson.put("to", addrToString ) ;
            txJson.put("amount", getObjectResp.getTransaction().getTx().getTransfer().getAmounts(0) ) ;
        } catch (JSONException e) {
            e.printStackTrace();
        }

        System.out.println( "Getobject Andrdoid" );
        System.out.println( getObjectResp.getTransaction() );

        successCallback.invoke(txJson.toString());
    }


}
