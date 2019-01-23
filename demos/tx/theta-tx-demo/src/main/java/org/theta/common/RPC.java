package org.theta.common;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

public class RPC {
 
    private String rpcUrl;
    private int rpcID = 1;
    private HttpClient client;
    private HttpPost post;

    public RPC(String rpcUrl) {
        this.rpcUrl = rpcUrl;
        this.client = HttpClientBuilder.create().build();
        this.post = new HttpPost(this.rpcUrl);
    }

    public JSONObject call(String rpcMethod, JSONObject params) throws Exception {
        JSONObject data = new JSONObject();
        data.put("jsonrpc", "2.0");
        data.put("method", rpcMethod);
        data.put("params", params);
        data.put("id", this.rpcID);

        String dataStr = data.toString();
        this.post.setEntity(new StringEntity(dataStr));
        this.post.setHeader("Content-type", "application/json");
        
        HttpResponse response = this.client.execute(post);
        this.rpcID ++;

        HttpEntity entity = response.getEntity();        
        if (entity != null) {
            String content = EntityUtils.toString(entity);
            JSONObject contentJson = new JSONObject(content);
            return contentJson;
        }

        return new JSONObject();
    }
}