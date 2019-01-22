package org.theta;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.HttpEntity;
import org.apache.http.util.EntityUtils;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.commons.io.IOUtils;


// API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#api-reference
public final class App {

    private final static String RPC_URL = "http://localhost:16888/rpc";
    private static int rpcID = 1;

    // Before running this demo, please follow the steps in the setup guide to launch a local private net
    // Setup guide: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/setup.md#setup
    public static void main(String[] args) throws Exception {

        // ---------------- Get a block at the given height ---------------- //
        // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getblockbyheight
        int blockHeight = 1;
        String rpcMethod = "theta.GetBlockByHeight";
        JSONObject params = new JSONObject();
        params.put("height", Integer.toString(blockHeight));
        JSONObject getBlockByHeightResult = post(rpcMethod, params);
        System.out.println("-------------------------------------------------------");
        System.out.println("RPC Call \"theta.GetBlockByHeight\" Result:");
        System.out.println("");
        System.out.println(getBlockByHeightResult.toString());
        System.out.println("-------------------------------------------------------");
        System.out.println("");

        // ------------- Get a block with the given block hash ------------- //
        // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getblock
        String blockHash = getBlockHash(getBlockByHeightResult);
        rpcMethod = "theta.GetBlock";
        params = new JSONObject();
        params.put("hash", blockHash);
        JSONObject getBlockResult = post(rpcMethod, params);
        System.out.println("-------------------------------------------------------");
        System.out.println("RPC Call \"theta.getBlock\" Result:");
        System.out.println("");
        System.out.println(getBlockResult.toString());
        System.out.println("-------------------------------------------------------");
        System.out.println("");

        // ------- Get a transaction with the given transaction hash ------- //
        // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#gettransaction
        String txHash = getTheFirstTransactionHash(getBlockByHeightResult);
        rpcMethod = "theta.GetTransaction";
        params = new JSONObject();
        params.put("hash", txHash);
        JSONObject getTransactionResult = post(rpcMethod, params);
        System.out.println("-------------------------------------------------------");
        System.out.println("RPC Call \"theta.GetTransaction\" Result:");
        System.out.println("");
        System.out.println(getTransactionResult.toString());
        System.out.println("-------------------------------------------------------");
        System.out.println("");

        // ---------------------- Retrieve an account ---------------------- //
        // API Reference: https://github.com/thetatoken/theta-mainnet-integration-guide/blob/master/docs/api.md#getaccount
        String address = "0x2E833968E5bB786Ae419c4d13189fB081Cc43bab";
        rpcMethod = "theta.GetAccount";
        params = new JSONObject();
        params.put("address", address);
        JSONObject getAccountResult = post(rpcMethod, params);
        System.out.println("-------------------------------------------------------");
        System.out.println("RPC Call \"theta.GetAccount\" Result:");
        System.out.println("");
        System.out.println(getAccountResult.toString());
        System.out.println("-------------------------------------------------------");
        System.out.println("");
    }  

    private static JSONObject post(String rpcMethod, JSONObject params) throws Exception {
        HttpClient client = new DefaultHttpClient();
        HttpPost post = new HttpPost(App.RPC_URL);
        JSONObject data = new JSONObject();
        data.put("jsonrpc", "2.0");
        data.put("method", rpcMethod);
        data.put("params", params);
        data.put("id", App.rpcID);

        String dataStr = data.toString();
        post.setEntity(new StringEntity(dataStr));
        post.setHeader("Content-type", "application/json");
        
        HttpResponse response = client.execute(post);
        App.rpcID ++;

        HttpEntity entity = response.getEntity();        
        if (entity != null) {
            String content = EntityUtils.toString(entity);
            JSONObject contentJson = new JSONObject(content);
            return contentJson;
        }

        return new JSONObject();
    }

    private static String getBlockHash(JSONObject blockJSONObj) throws Exception {
        String blockHash = "";
        try {
            blockHash = blockJSONObj.getJSONObject("result").getString("hash");
        } catch (Exception e) {
            throw new Exception(String.format("Malformed block JSON object: %s, error: %s", blockJSONObj, e));
        }
        return blockHash;
    }

    private static String getTheFirstTransactionHash(JSONObject blockJSONObj) throws Exception {
        String firstTxHash = "";
        try {
            JSONArray txs = blockJSONObj.getJSONObject("result").getJSONArray("transactions");
            if (txs.length() >= 1) {
                JSONObject firstTx = txs.getJSONObject(0);
                firstTxHash = firstTx.getString("hash");
            }
        } catch (Exception e) {
            throw new Exception(String.format("Malformed block JSON object: %s, error: %s", blockJSONObj, e));
        }
        return firstTxHash;
    }
}
