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
    public native String transferCoins(String address, String amount, int fee, String hexseed, int otsIndex);
    public native String getMnemonic(String hexseed);
    private ManagedChannel channel;

//    public static String server = "testnet-2.automated.theqrl.org";
//    public static int port = 19009;

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
    public void createWallet(int treeHeight, String walletindex, String walletpin, int hashFunction, Callback errorCallback, Callback successCallback) {
        try {
            String hexSeed = createWallet(treeHeight, hashFunction);
            // save the required information to Shared Preferences
            saveEncrypted("hexseed".concat(walletindex), hexSeed.split(" ")[0]);
            saveEncrypted("address".concat(walletindex), hexSeed.split(" ")[1]);
            saveEncrypted("xmsspk".concat(walletindex), hexSeed.split(" ")[2]);
            saveEncrypted("pin".concat(walletindex), walletpin);
            // returns success and wallet address
            successCallback.invoke("success", hexSeed.split(" ")[1]);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    // Open an  existingQRL wallet with hexseed
    @ReactMethod
    public void openWalletWithHexseed(String hexseed, String walletindex, String walletpin,  Callback errorCallback, Callback successCallback) {
        try {
            String hexSeed = openWalletWithHexseed(hexseed);
            saveEncrypted("hexseed".concat(walletindex), hexSeed.split(" ")[0]);
            saveEncrypted("address".concat(walletindex), hexSeed.split(" ")[1]);
            saveEncrypted("xmsspk".concat(walletindex), hexSeed.split(" ")[2]);
            saveEncrypted("pin".concat(walletindex), walletpin);
            successCallback.invoke("success", hexSeed.split(" ")[1]);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    // Return wallet PIN to check
    @ReactMethod
    public void getWalletPin(String walletindex, Callback errorCallback, Callback successCallback) {
        String walletpin = getEncrypted("pin".concat(walletindex));
        successCallback.invoke(walletpin);
    }

    // Show hexseed and mnemonic to user
    @ReactMethod
    public void sendWalletPrivateInfo(String walletindex, Callback errorCallback, Callback successCallback) {
        String hexseed = getEncrypted("hexseed".concat(walletindex));
        try {
            String mnemonic = getMnemonic(hexseed);
            successCallback.invoke( mnemonic, hexseed);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }


    // Save port and node information to Shared Preferences
    @ReactMethod
    public void saveNodeInformation(String node, String port, Callback errorCallback, Callback successCallback) {
        PreferenceHelper.putString("node", node);
        PreferenceHelper.putInt("port", Integer.valueOf(port));
        successCallback.invoke("saved");
    }

    // Check if provided hexseed is correct
    @ReactMethod
    public void checkHexseedIdentical(String hexSeed, String walletindex, Callback errorCallback, Callback successCallback) {
        String hexseed = getEncrypted("hexseed".concat(walletindex));
        if (hexseed.equals(hexSeed)){
            successCallback.invoke("success");
        }
        else {
            successCallback.invoke("error");
        }
    }

    // Check if user has pending tx
    @ReactMethod
    public void checkPendingTx(String walletindex, Callback errorCallback, Callback successCallback) {
//        String address = PreferenceHelper.getString("address");
        String walletAddress = getEncrypted("address".concat(walletindex));
        int len = walletAddress.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(walletAddress.charAt(i), 16) << 4)
                    + Character.digit(walletAddress.charAt(i+1), 16));
        }

        String server = PreferenceHelper.getString("node");
        int port = PreferenceHelper.getInt("port");

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
    public void refreshWallet(String walletindex, Callback errorCallback, Callback successCallback) {
        System.out.println( "refresWallet from Android" );
        String walletAddress = getEncrypted("address".concat(walletindex));

        String server = PreferenceHelper.getString("node");
        int port = PreferenceHelper.getInt("port");
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

                    System.out.println("TX TYPE......");
                    System.out.println(getObjectResp.getTransaction().getTx().getTransactionTypeCase().toString());

                    if (getObjectResp.getTransaction().getTx().getTransactionTypeCase().toString() != "TRANSFER") {
                        completed++;
                    }

                    else {
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
                        for (byte txbyte : txHashByte)
                            txHashString.append(String.format("%02x", txbyte));

                        // check if the current wallet is in the list of recipient addresses
                        boolean inRecipient = false;
                        for (int r=0; r < getObjectResp.getTransaction().getTx().getTransfer().getAddrsToCount(); r++ ){
                            byte[] addrFromByte = getObjectResp.getTransaction().getTx().getTransfer().getAddrsTo(r).toByteArray();
                            StringBuilder addrFromString = new StringBuilder(addrFromByte.length * 2);
                            for (byte txbyteAddr : addrFromByte)
                                addrFromString.append(String.format("%02x", txbyteAddr));
                            if (addrFromString.toString().equals(walletAddress)){
                                inRecipient = true;
                            }
                        }

                        try {
                            if (inRecipient) {
                                txJson.put("title", "RECEIVED");
                            } else {
                                txJson.put("title", "SENT");
                            }
                            txJson.put("desc", getObjectResp.getTransaction().getTx().getTransfer().getAmounts(0));
                            txJson.put("date", dt.format(date));
                            txJson.put("txhash", txHashString.toString());
                            txJsonAll.put(txJson);
                            completed++;
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }

                    int otsIndex = -1;
                    if (completed == tx_total) {
                        // check latest available ots index
                        System.out.println( "OTS Bitfield count is : "+ getAddressStateResp.getState().getOtsBitfieldCount() );
                        for (int j = 0; j < getAddressStateResp.getState().getOtsBitfieldCount(); j++) {
                            System.out.println( "J is : "+j );
                            // Byte to binaryString (https://stackoverflow.com/questions/12310017/how-to-convert-a-byte-to-its-binary-string-representation)
                            byte bitfiedByte = getAddressStateResp.getState().getOtsBitfield(j).byteAt(0);
                            String bitfieldString = String.format("%8s", Integer.toBinaryString(bitfiedByte & 0xFF)).replace(' ', '0');
                            String bitfieldStringBigendian = new StringBuffer(bitfieldString).reverse().toString();

                            // System.out.println( Integer.toString(bitfiedInt,2));
                            System.out.println( "bitfieldByte is  : "+ bitfiedByte );
                            if (bitfiedByte != -1) {
                                System.out.println(bitfieldStringBigendian);
                                for (int o = 0; o < bitfieldStringBigendian.length(); o++) {
                                    if (bitfieldStringBigendian.charAt(o) == '0') {
                                        otsIndex = (8 * j) + o;
                                        System.out.println("NEXT OTS INDEX IS");
                                        System.out.println(otsIndex);
                                        break;
                                    }
                                }
                            }
                            System.out.println("OTSINDEX IS: ");
                            System.out.println(otsIndex);
                            // obtained next available ots index
                            if (otsIndex > -1) {

//                                successCallback.invoke( walletAddress, otsIndex ,Long.toString(getAddressStateResp.getState().getBalance()), txJsonAll.toString() );

                                JSONArray txJsonTotal = new JSONArray();
                                // add unconfirmed tx to the list
                                try {
                                    // get all tx unconfirmed
                                    Qrl.GetLatestDataReq getLatestDataReq = Qrl.GetLatestDataReq.newBuilder().setFilter(Qrl.GetLatestDataReq.Filter.TRANSACTIONS_UNCONFIRMED).build();
                                    Qrl.GetLatestDataResp getLatestDataResp = blockingStub.getLatestData(getLatestDataReq);

                                    // found an unconfirmed tx
                                    if (getLatestDataResp.getTransactionsUnconfirmedCount() != 0) {
                                        System.out.println("UNCONFIRMED TX FOUND");
                                        for (int u = 0; u < getLatestDataResp.getTransactionsUnconfirmedCount(); u++) {
                                            System.out.println("ENTERED FOR LOOP");
                                            // check if there is a pending tx for the given wallet address
                                            if (ByteString.copyFrom(data).equals(getLatestDataResp.getTransactionsUnconfirmed(u).getAddrFrom())) {
                                                System.out.println("FOUND UNCONFIRMED TX FROM CURRENT WALLET");
                                                JSONObject txJsonUnconfirmed = new JSONObject();
                                                try {
                                                    txJsonUnconfirmed.put("title", "SENT");
                                                    txJsonUnconfirmed.put("desc", getLatestDataResp.getTransactionsUnconfirmed(u).getTx().getTransfer().getAmounts(0));
                                                    Date dateUnconfirmed = new Date(getLatestDataResp.getTransactionsUnconfirmed(u).getTimestampSeconds() * 1000);
                                                    SimpleDateFormat dt = new SimpleDateFormat("h:mm a, MMM d yyyy");
                                                    txJsonUnconfirmed.put("date", dt.format(dateUnconfirmed));

                                                    byte[] txHashByteUnconfirmed = getLatestDataResp.getTransactionsUnconfirmed(u).getTx().getTransactionHash().toByteArray();
                                                    byte[] txHashByte = getObjectResp.getTransaction().getTx().getTransactionHash().toByteArray();
                                                    StringBuilder txHashString = new StringBuilder(txHashByte.length * 2);
                                                    for (byte txbyte : txHashByte)
                                                        txHashString.append(String.format("%02x", txbyte));

                                                    StringBuilder txHashStringUnconfirmed = new StringBuilder(txHashByte.length * 2);
                                                    for (byte txbyteUnconfirmed : txHashByteUnconfirmed)
                                                        txHashStringUnconfirmed.append(String.format("%02x", txbyteUnconfirmed));

                                                    txJsonUnconfirmed.put("txhash", txHashStringUnconfirmed.toString());
                                                    txJsonUnconfirmed.put("unconfirmed", "true");

                                                    // add unconfirmed tx
                                                    txJsonTotal.put(txJsonUnconfirmed);
                                                } catch (JSONException e) {
                                                    e.printStackTrace();
                                                }
                                            }
                                        }
                                    }
                                } catch (IllegalViewOperationException e) {
                                    errorCallback.invoke(e.getMessage());
                                }


                                try {
                                    // add all other tx
                                    for (int t = 0; t < txJsonAll.length(); t++) {
                                        txJsonTotal.put(txJsonAll.getJSONObject(t));
                                    }
                                    successCallback.invoke(walletAddress, otsIndex, Long.toString(getAddressStateResp.getState().getBalance()), txJsonTotal.toString());
                                    break;

                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
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
    public void transferCoins(String walletindex, String recipient, String amountStr, int otsIndex, int fee, Callback errorCallback, Callback successCallback) {

        // convert amount to double
        double amountDouble = Double.parseDouble(amountStr) * 1000000000;
        // convert amount to long
        long amount = (long) amountDouble ;

        // get node connection related information
        String server = PreferenceHelper.getString("node");
        int port = PreferenceHelper.getInt("port");

        // connection information
        ManagedChannel channel = OkHttpChannelBuilder.forAddress(server, port).usePlaintext(true).build();
        PublicAPIGrpc.PublicAPIBlockingStub blockingStub = PublicAPIGrpc.newBlockingStub(channel);

        // converting the wallet address to byte array
//        String walletAddress = getEncrypted("address".concat(walletindex));
//        System.out.println( walletAddress );
//        int len = walletAddress.length();
//        byte[] data = new byte[len / 2];
//        for (int i = 0; i < len; i += 2) {
//            data[i / 2] = (byte) ((Character.digit(walletAddress.charAt(i), 16) << 4)
//                    + Character.digit(walletAddress.charAt(i+1), 16));
//        }

        // converting the recipient address to byte array
        String recipientAddress = recipient.substring(1);
        int reclen = recipientAddress.length();
        byte[] recdata = new byte[reclen / 2];
        for (int i = 0; i < reclen; i += 2) {
            recdata[i / 2] = (byte) ((Character.digit(recipientAddress.charAt(i), 16) << 4)
                    + Character.digit(recipientAddress.charAt(i+1), 16));
        }

        // converting xmssPK to byte array
        String xmssPK = getEncrypted("xmsspk".concat(walletindex));
        System.out.println( xmssPK );
        int xmsslen = xmssPK.length();
        byte[] xmssdata = new byte[xmsslen / 2];
        for (int i = 0; i < xmsslen; i += 2) {
            xmssdata[i / 2] = (byte) ((Character.digit(xmssPK.charAt(i), 16) << 4) + Character.digit(xmssPK.charAt(i+1), 16));
        }


        try {
            // Preparing the tx by calling transferCoins
            Qrl.TransferCoinsReq transferCoinsReq = Qrl.TransferCoinsReq.newBuilder().addAddressesTo(ByteString.copyFrom(recdata)).addAmounts(amount).setFee(fee).setXmssPk(ByteString.copyFrom(xmssdata)).build();
            Qrl.TransferCoinsResp transferCoinsResp = blockingStub.transferCoins(transferCoinsReq);

            // converting the amount and fee to long before passing to cpp
            String hexseed = getEncrypted("hexseed".concat(walletindex));
            String androidWallet = transferCoins(recipientAddress, amountStr, fee, hexseed, otsIndex);

            // androidWallet is a string containing the signature and the txHash as hexseed
            // txHash is always 64 chars long
            // signature is identified by substracting the txHash
            String signature = androidWallet.substring(0, (androidWallet.length() - 64) );
            System.out.println(androidWallet.length());
            String txHash = androidWallet.substring( (androidWallet.length() - 64) , androidWallet.length() );
            System.out.println(txHash);

            // converting signature to ByteString
            int txsiglen = signature.length();
            byte[] txsig = new byte[txsiglen / 2];
            for (int i = 0; i < txsiglen; i += 2) {
                txsig[i / 2] = (byte) ((Character.digit(signature.charAt(i), 16) << 4) + Character.digit(signature.charAt(i + 1), 16));
            }
            System.out.println(txsig);

            // converting txhash to ByteString
            int txhashlen = txHash.length();
            byte[] txhash = new byte[txhashlen / 2];
            for (int i = 0; i < txhashlen; i += 2) {
                txhash[i / 2] = (byte) ((Character.digit(txHash.charAt(i), 16) << 4) + Character.digit(txHash.charAt(i + 1), 16));
            }

            // push transaction to the nodes
            Qrl.Transaction signedTx = Qrl.Transaction.newBuilder().setTransfer(Qrl.Transaction.Transfer.newBuilder().addAddrsTo(transferCoinsResp.getExtendedTransactionUnsigned().getTx().getTransfer().getAddrsTo(0)).addAmounts(amount)).setFee(fee).setSignature(ByteString.copyFrom(txsig)).setTransactionHash(ByteString.copyFrom(txhash)).setPublicKey(transferCoinsResp.getExtendedTransactionUnsigned().getTx().getPublicKey()).setNonce(12).build();
            Qrl.PushTransactionReq pushtransactionReq = Qrl.PushTransactionReq.newBuilder().setTransactionSigned(signedTx).build();
            Qrl.PushTransactionResp pushTransactionResp = blockingStub.pushTransaction(pushtransactionReq);
            // is success, send back information to JavaScript with a callback
            successCallback.invoke("success");

        } catch (RuntimeException e) {
            // catch RPC related errors such as not enough funds...
            System.out.println(e.getMessage());
            errorCallback.invoke(e.getMessage());

        }

    }

    // remove wallet related information from Shared Preferences
    @ReactMethod
    public void closeWallet(String walletindex, Callback errorCallback, Callback successCallback) {
        PreferenceHelper.removeFromPreferences("xmsspk"+walletindex+"iv" );
        PreferenceHelper.removeFromPreferences("xmsspk"+walletindex+"enc");
        PreferenceHelper.removeFromPreferences("pin"+walletindex+"iv");
        PreferenceHelper.removeFromPreferences("pin"+walletindex+"enc");
        PreferenceHelper.removeFromPreferences("address"+walletindex+"iv");
        PreferenceHelper.removeFromPreferences("address"+walletindex+"enc");
        PreferenceHelper.removeFromPreferences("hexseed"+walletindex+"iv");
        PreferenceHelper.removeFromPreferences("hexseed"+walletindex+"enc");
        successCallback.invoke("success");
    }


    @ReactMethod
    public void getTxDetails(String txhash, Callback errorCallback, Callback successCallback) {

        System.out.println( "TXHASH Andrdoid" );
        System.out.println( txhash );

        // converting txhash to byte array
        int txlen = txhash.length();
        byte[] txdata = new byte[txlen / 2];
        for (int i = 0; i < txlen; i += 2) {
            txdata[i / 2] = (byte) ((Character.digit(txhash.charAt(i), 16) << 4)
                    + Character.digit(txhash.charAt(i+1), 16));
        }

        String server = PreferenceHelper.getString("node");
        int port = PreferenceHelper.getInt("port");

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
