module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},1341,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),o=e.i(59756),n=e.i(61916),i=e.i(74677),s=e.i(69741),l=e.i(16795),d=e.i(87718),p=e.i(95169),c=e.i(47587),u=e.i(66012),x=e.i(70101),f=e.i(26937),g=e.i(10372),h=e.i(93695);e.i(52474);var m=e.i(5232),y=e.i(5853);async function b(e){try{let{email:t,restaurantName:r,items:a}=await e.json();if(!t||!a||!Array.isArray(a)||0===a.length)return Response.json({error:"Missing required fields: email and items (non-empty array) are required"},{status:400});let o=a.map(e=>{let t=Math.round(e.currentStock/e.minStock*100),r=t<=50,a=Math.min(t,100);return`
          <tr>
            <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; font-weight: 500;">
              ${e.name}
            </td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; text-align: center;">
              <span style="color: ${r?"#dc2626":"#E8712B"}; font-size: 16px; font-weight: 700;">
                ${e.currentStock}
              </span>
              <span style="color: #aaa; font-size: 12px;"> ${e.unit}</span>
            </td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; text-align: center;">
              <span style="color: #555; font-size: 14px; font-weight: 500;">
                ${e.minStock}
              </span>
              <span style="color: #aaa; font-size: 12px;"> ${e.unit}</span>
            </td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; text-align: center;">
              <div style="background: #f0f0f0; border-radius: 10px; height: 8px; width: 60px; display: inline-block; vertical-align: middle;">
                <div style="background: ${r?"#dc2626":"#E8712B"}; border-radius: 10px; height: 8px; width: ${a}%;"></div>
              </div>
              <span style="color: ${r?"#dc2626":"#E8712B"}; font-size: 11px; margin-left: 6px; font-weight: 600;">
                ${t}%
              </span>
            </td>
          </tr>`}).join(""),n=a.filter(e=>50>=Math.round(e.currentStock/e.minStock*100)).length,{data:i,error:s}=await y.resend.emails.send({from:y.FROM_EMAIL,to:t,subject:"⚠️ Tahadhari: Vifaa vichache — Low stock alert",html:`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f7f7f7;">
          <!-- Header -->
          <div style="background: #2D7A3A; padding: 28px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">&#127860; FoodOS</h1>
            <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 6px 0 0;">Mfumo wa Usimamizi wa Mgahawa</p>
          </div>

          <!-- Body -->
          <div style="background: #ffffff; padding: 35px 30px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <!-- Alert banner -->
            <div style="background: #FFF3E0; border: 2px solid #E8712B; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
              <p style="font-size: 32px; margin: 0 0 8px;">&#9888;&#65039;</p>
              <h2 style="color: #E8712B; font-size: 20px; margin: 0 0 5px;">
                Tahadhari: Vifaa vya Chini
              </h2>
              <p style="color: #C06020; font-size: 13px; margin: 0;">
                Low Stock Alert &mdash; ${r||"FoodOS Restaurant"}
              </p>
            </div>

            <!-- Summary -->
            <div style="display: flex; margin-bottom: 25px;">
              <table style="width: 100%;">
                <tr>
                  <td style="background: #FEF2F2; border-radius: 8px; padding: 14px 16px; text-align: center; width: 48%;">
                    <p style="color: #dc2626; font-size: 24px; font-weight: 800; margin: 0;">
                      ${a.length}
                    </p>
                    <p style="color: #888; font-size: 11px; margin: 4px 0 0;">
                      Vifaa vya chini (Low stock items)
                    </p>
                  </td>
                  <td style="width: 4%;"></td>
                  <td style="background: #FFF8F0; border-radius: 8px; padding: 14px 16px; text-align: center; width: 48%;">
                    <p style="color: #E8712B; font-size: 24px; font-weight: 800; margin: 0;">
                      ${n}
                    </p>
                    <p style="color: #888; font-size: 11px; margin: 4px 0 0;">
                      Hatari sana (Critical &lt;50%)
                    </p>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Items table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <thead>
                <tr style="background: #fafafa;">
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Bidhaa (Item)
                  </th>
                  <th style="padding: 10px 16px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Sasa (Current)
                  </th>
                  <th style="padding: 10px 16px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Chini (Min)
                  </th>
                  <th style="padding: 10px 16px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Kiwango
                  </th>
                </tr>
              </thead>
              <tbody>
                ${o}
              </tbody>
            </table>

            <!-- Reorder suggestion -->
            <div style="background: #f0faf0; border-left: 4px solid #2D7A3A; padding: 16px 18px; border-radius: 0 10px 10px 0; margin-bottom: 20px;">
              <p style="color: #2D7A3A; font-size: 14px; font-weight: 600; margin: 0 0 6px;">
                Pendekezo: Agiza Upya (Reorder Suggestion)
              </p>
              <p style="color: #555; font-size: 13px; line-height: 1.6; margin: 0;">
                Tunapendekeza uagize vifaa vilivyoonyeshwa hapo juu ili kuepuka ukosefu wa bidhaa.
                Bonyeza hapa chini kwenda kwenye dashboard yako ya stoku.
              </p>
              <p style="color: #888; font-size: 12px; line-height: 1.5; margin: 6px 0 0;">
                We recommend reordering the items listed above to avoid stockouts.
                Click below to go to your stock dashboard.
              </p>
            </div>

            <!-- CTA button -->
            <div style="text-align: center;">
              <a href="https://foodos.online/stock"
                 style="display: inline-block; background: #2D7A3A; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
                Fungua Stoku &rarr; Open Stock
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #e8e8e8; border-radius: 0 0 12px 12px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <p style="color: #999; font-size: 11px; margin: 0;">
              Arifa hii imetumwa kwa sababu umewasha &quot;Tahadhari za Stoku Chini&quot; kwenye mipangilio.
            </p>
            <p style="color: #bbb; font-size: 10px; margin: 6px 0 0;">
              &copy; ${new Date().getFullYear()} FoodOS &mdash; Dar es Salaam, Tanzania
            </p>
          </div>
        </div>
      `});if(s)return console.error("Resend error:",s),Response.json({error:"Failed to send low stock alert email"},{status:500});return Response.json({success:!0,messageId:i?.id})}catch(e){return console.error("Low stock email error:",e),Response.json({error:"Low stock alert email send failed"},{status:500})}}e.s(["POST",0,b],9603);var v=e.i(9603);let w=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/email/low-stock/route",pathname:"/api/email/low-stock",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/email/low-stock/route.ts",nextConfigOutput:"standalone",userland:v,...{}}),{workAsyncStorage:R,workUnitAsyncStorage:k,serverHooks:E}=w;async function A(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),w.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/email/low-stock/route";y=y.replace(/\/index$/,"")||"/";let b=await w.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!b)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:v,params:R,nextConfig:k,parsedUrl:E,isDraftMode:A,prerenderManifest:C,routerServerContext:S,isOnDemandRevalidate:z,revalidateOnlyGenerated:T,resolvedPathname:q,clientReferenceManifest:F,serverActionsManifest:O}=b,P=(0,s.normalizeAppPath)(y),M=!!(C.dynamicRoutes[P]||C.routes[q]),N=async()=>((null==S?void 0:S.render404)?await S.render404(e,t,E,!1):t.end("This page could not be found"),null);if(M&&!A){let e=!!C.routes[q],t=C.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(k.adapterPath)return await N();throw new h.NoFallbackError}}let $=null;!M||w.isDev||A||($="/index"===($=q)?"/":$);let j=!0===w.isDev||!M,_=M&&!j;O&&F&&(0,i.setManifestsSingleton)({page:y,clientReferenceManifest:F,serverActionsManifest:O});let I=e.method||"GET",D=(0,n.getTracer)(),H=D.getActiveScopeSpan(),U=!!(null==S?void 0:S.isWrappedByNextServer),B=!!(0,o.getRequestMeta)(e,"minimalMode"),L=(0,o.getRequestMeta)(e,"incrementalCache")||await w.getIncrementalCache(e,k,C,B);null==L||L.resetRequestCache(),globalThis.__incrementalCache=L;let K={params:R,previewProps:C.preview,renderOpts:{experimental:{authInterrupts:!!k.experimental.authInterrupts},cacheComponents:!!k.cacheComponents,supportsDynamicResponse:j,incrementalCache:L,cacheLifeProfiles:k.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,o)=>w.onRequestError(e,t,a,o,S)},sharedContext:{buildId:v}},V=new l.NodeNextRequest(e),W=new l.NodeNextResponse(t),G=d.NextRequestAdapter.fromNodeNextRequest(V,(0,d.signalFromNodeResponse)(t));try{let o,i=async e=>w.handle(G,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=D.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${I} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),o&&o!==e&&(o.setAttribute("http.route",a),o.updateName(t))}else e.updateName(`${I} ${y}`)}),s=async o=>{var n,s;let l=async({previousCacheEntry:r})=>{try{if(!B&&z&&T&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=K.renderOpts.fetchMetrics;let s=K.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let l=K.renderOpts.collectedTags;if(!M)return await (0,u.sendResponse)(V,W,n,K.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,x.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[g.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,a=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:m.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await w.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:z})},!1,S),t}},d=await w.handleResponse({req:e,nextConfig:k,cacheKey:$,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:z,revalidateOnlyGenerated:T,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:B});if(!M)return null;if((null==d||null==(n=d.value)?void 0:n.kind)!==m.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(s=d.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",z?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,x.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&M||p.delete(g.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,f.getCacheControlHeader)(d.cacheControl)),await (0,u.sendResponse)(V,W,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};U&&H?await s(H):(o=D.getActiveScopeSpan(),await D.withPropagatedContext(e.headers,()=>D.trace(p.BaseServerSpan.handleRequest,{spanName:`${I} ${y}`,kind:n.SpanKind.SERVER,attributes:{"http.method":I,"http.target":e.url}},s),void 0,!U))}catch(t){if(t instanceof h.NoFallbackError||await w.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:z})},!1,S),M)throw t;return await (0,u.sendResponse)(V,W,new Response(null,{status:500})),null}}e.s(["handler",0,A,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:R,workUnitAsyncStorage:k})},"routeModule",0,w,"serverHooks",0,E,"workAsyncStorage",0,R,"workUnitAsyncStorage",0,k],1341)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0gh-jj~._.js.map