package com.glacier.earthquake.monitor.server.crawler.module.bing_search;

import com.glacier.earthquake.monitor.server.crawler.core.Downloader;
import org.apache.http.client.params.CookiePolicy;
import org.apache.http.params.CoreConnectionPNames;
import org.apache.http.params.CoreProtocolPNames;

/**
 * Created by glacier on 15-5-3.
 */
public class BingDownloader extends Downloader {

    public void setHttpGet() {
        httpGet.setHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
        httpGet.setHeader("Accept-Encoding", "gzip, deflate, sdch");
        httpGet.setHeader("Accept-Language", "zh-CN,zh;q=0.8");
        httpGet.setHeader("Connection", "keep-alive");
        httpGet.setHeader("Cookie", "SRCHUID=V=2&GUID=4E93F69265164ACEAE7BB194F4D17F79; SRCHUSR=AUTOREDIR=0&GEOVAR=&DOB=20150113; _EDGE_V=1; MUIDB=390BF97B854F641B2A9EFE5584EE6590; MUID=390BF97B854F641B2A9EFE5584EE6590; _EDGE_S=SID=3C5102CCF4496E9016DE0550F5E86F05; _SS=SID=FB886E719B054150852CE95DB7EFCA86&bIm=154254; SRCHD=D=3858364&AF=NOFORM; SCRHDN=ASD=0&DURL=#; WLS=TS=63566245168; _HOP=; SRCHHPGUSR=CW=657&CH=615&DPR=1");
        httpGet.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36");

        httpGet.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 60000);
        httpGet.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT, 60000);
        httpGet.getParams().setParameter(CoreProtocolPNames.WAIT_FOR_CONTINUE, 60000);
        httpGet.getParams().setBooleanParameter("http.tcp.nodelay", true);
        httpGet.getParams().setParameter("http.connection.stalecheck", false);
        httpGet.getParams().setParameter("http.protocol.cookie-policy", CookiePolicy.BROWSER_COMPATIBILITY);
    }

}
