package org.theta;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

public final class RawTxBroadcaster {

    private final static String RPC_URL = "http://localhost:16888/rpc";
    private static int rpcID = 1;

    public static void broadcast(String rawTx) throws Exception {
        String rpcMethod = "theta.BroadcastRawTransaction";
        JSONObject params = new JSONObject();
        params.put("tx_bytes", rawTx);
        JSONObject broadcastRawTxResult = post(rpcMethod, params);
        System.out.println("-------------------------------------------------------");
        System.out.println("RPC Call \"theta.BroadcastRawTransaction\" Result:");
        System.out.println("");
        System.out.println(broadcastRawTxResult.toString());
        System.out.println("-------------------------------------------------------");
        System.out.println("");
    }
 
    private static JSONObject post(String rpcMethod, JSONObject params) throws Exception {
        HttpClient client = new DefaultHttpClient();
        HttpPost post = new HttpPost(RawTxBroadcaster.RPC_URL);
        JSONObject data = new JSONObject();
        data.put("jsonrpc", "2.0");
        data.put("method", rpcMethod);
        data.put("params", params);
        data.put("id", RawTxBroadcaster.rpcID);

        String dataStr = data.toString();
        post.setEntity(new StringEntity(dataStr));
        post.setHeader("Content-type", "application/json");
        
        HttpResponse response = client.execute(post);
        RawTxBroadcaster.rpcID ++;

        HttpEntity entity = response.getEntity();        
        if (entity != null) {
            String content = EntityUtils.toString(entity);
            JSONObject contentJson = new JSONObject(content);
            return contentJson;
        }

        return new JSONObject();
    }
}