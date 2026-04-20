module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},36031,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),o=e.i(59756),i=e.i(61916),n=e.i(74677),s=e.i(69741),l=e.i(16795),d=e.i(87718),p=e.i(95169),u=e.i(47587),c=e.i(66012),x=e.i(70101),f=e.i(26937),g=e.i(10372),m=e.i(93695);e.i(52474);var h=e.i(5232),b=e.i(5853);async function y(e){try{let{email:t,orderNumber:r,items:a,total:o,paymentMethod:i,restaurantName:n}=await e.json();if(!t||!r||!a||!o)return Response.json({error:"Missing required fields: email, orderNumber, items, and total are required"},{status:400});let s=a.map(e=>`
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333;">
              ${e.name}
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #555; text-align: center;">
              ${e.qty}
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: right; font-weight: 500;">
              TZS ${Number(e.price).toLocaleString()}
            </td>
          </tr>`).join(""),{data:l,error:d}=await b.resend.emails.send({from:b.FROM_EMAIL,to:t,subject:`Oda #${r} imethibitishwa — Order confirmed`,html:`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f7f7f7;">
          <!-- Header -->
          <div style="background: #2D7A3A; padding: 28px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">&#127860; FoodOS</h1>
            <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 6px 0 0;">Mfumo wa Usimamizi wa Mgahawa</p>
          </div>

          <!-- Body -->
          <div style="background: #ffffff; padding: 35px 30px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <!-- Success badge -->
            <div style="text-align: center; margin-bottom: 25px;">
              <div style="display: inline-block; background: #f0faf0; border: 2px solid #2D7A3A; border-radius: 50%; width: 60px; height: 60px; line-height: 60px; font-size: 28px;">
                &#10003;
              </div>
              <h2 style="color: #2D7A3A; font-size: 22px; margin: 15px 0 5px;">
                Oda Imethibitishwa!
              </h2>
              <p style="color: #888; font-size: 13px; margin: 0;">Order Confirmed</p>
            </div>

            <!-- Order number card -->
            <div style="background: #f8faf8; border-radius: 10px; padding: 16px 20px; margin-bottom: 25px; text-align: center; border: 1px solid #e8f0e8;">
              <p style="color: #888; font-size: 11px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 1px;">
                Nambari ya Oda (Order Number)
              </p>
              <p style="color: #2D7A3A; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: 2px;">
                #${r}
              </p>
              <p style="color: #aaa; font-size: 11px; margin: 6px 0 0;">
                ${n||"FoodOS Restaurant"}
              </p>
            </div>

            <!-- Items table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: #fafafa;">
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Bidhaa (Item)
                  </th>
                  <th style="padding: 10px 16px; text-align: center; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Idadi (Qty)
                  </th>
                  <th style="padding: 10px 16px; text-align: right; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e8e8e8;">
                    Bei (Price)
                  </th>
                </tr>
              </thead>
              <tbody>
                ${s}
              </tbody>
            </table>

            <!-- Total -->
            <div style="background: #2D7A3A; border-radius: 10px; padding: 18px 20px; display: flex; margin-bottom: 20px;">
              <table style="width: 100%;">
                <tr>
                  <td style="color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 600;">
                    Jumla (Total)
                  </td>
                  <td style="color: #ffffff; font-size: 22px; font-weight: 800; text-align: right;">
                    TZS ${Number(o).toLocaleString()}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Payment method -->
            <div style="background: #FFF8F0; border-radius: 8px; padding: 14px 16px; margin-bottom: 25px; border: 1px solid #F5E0CC;">
              <table style="width: 100%;">
                <tr>
                  <td style="color: #E8712B; font-size: 12px; font-weight: 600;">
                    Njia ya Malipo (Payment Method)
                  </td>
                  <td style="color: #C06020; font-size: 14px; font-weight: 700; text-align: right;">
                    ${i||"Taslimu (Cash)"}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Thank you -->
            <div style="text-align: center; padding: 10px 0;">
              <p style="color: #2D7A3A; font-size: 24px; font-weight: 800; margin: 0 0 8px;">
                Asante! &#127881;
              </p>
              <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0;">
                Asante kwa oda yako! Tunakutayarishia chakula kitamu.
              </p>
              <p style="color: #888; font-size: 13px; margin: 5px 0 0;">
                Thank you for your order! We are preparing your delicious meal.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #e8e8e8; border-radius: 0 0 12px 12px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <p style="color: #999; font-size: 11px; margin: 0;">
              Maswali? Wasiliana nasi: support@foodos.online
            </p>
            <p style="color: #bbb; font-size: 10px; margin: 6px 0 0;">
              &copy; ${new Date().getFullYear()} FoodOS &mdash; Dar es Salaam, Tanzania
            </p>
          </div>
        </div>
      `});if(d)return console.error("Resend error:",d),Response.json({error:"Failed to send order confirmation email"},{status:500});return Response.json({success:!0,messageId:l?.id})}catch(e){return console.error("Order confirmation email error:",e),Response.json({error:"Order confirmation email send failed"},{status:500})}}e.s(["POST",0,y],6290);var v=e.i(6290);let R=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/email/order-confirmation/route",pathname:"/api/email/order-confirmation",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/email/order-confirmation/route.ts",nextConfigOutput:"standalone",userland:v,...{}}),{workAsyncStorage:w,workUnitAsyncStorage:A,serverHooks:E}=R;async function C(e,t,a){a.requestMeta&&(0,o.setRequestMeta)(e,a.requestMeta),R.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let b="/api/email/order-confirmation/route";b=b.replace(/\/index$/,"")||"/";let y=await R.prepare(e,t,{srcPage:b,multiZoneDraftMode:!1});if(!y)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:v,params:w,nextConfig:A,parsedUrl:E,isDraftMode:C,prerenderManifest:k,routerServerContext:O,isOnDemandRevalidate:T,revalidateOnlyGenerated:S,resolvedPathname:N,clientReferenceManifest:P,serverActionsManifest:q}=y,z=(0,s.normalizeAppPath)(b),M=!!(k.dynamicRoutes[z]||k.routes[N]),j=async()=>((null==O?void 0:O.render404)?await O.render404(e,t,E,!1):t.end("This page could not be found"),null);if(M&&!C){let e=!!k.routes[N],t=k.dynamicRoutes[z];if(t&&!1===t.fallback&&!e){if(A.adapterPath)return await j();throw new m.NoFallbackError}}let I=null;!M||R.isDev||C||(I="/index"===(I=N)?"/":I);let _=!0===R.isDev||!M,D=M&&!_;q&&P&&(0,n.setManifestsSingleton)({page:b,clientReferenceManifest:P,serverActionsManifest:q});let F=e.method||"GET",$=(0,i.getTracer)(),H=$.getActiveScopeSpan(),U=!!(null==O?void 0:O.isWrappedByNextServer),B=!!(0,o.getRequestMeta)(e,"minimalMode"),K=(0,o.getRequestMeta)(e,"incrementalCache")||await R.getIncrementalCache(e,A,k,B);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let L={params:w,previewProps:k.preview,renderOpts:{experimental:{authInterrupts:!!A.experimental.authInterrupts},cacheComponents:!!A.cacheComponents,supportsDynamicResponse:_,incrementalCache:K,cacheLifeProfiles:A.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,o)=>R.onRequestError(e,t,a,o,O)},sharedContext:{buildId:v}},W=new l.NodeNextRequest(e),G=new l.NodeNextResponse(t),V=d.NextRequestAdapter.fromNodeNextRequest(W,(0,d.signalFromNodeResponse)(t));try{let o,n=async e=>R.handle(V,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=$.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${F} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),o&&o!==e&&(o.setAttribute("http.route",a),o.updateName(t))}else e.updateName(`${F} ${b}`)}),s=async o=>{var i,s;let l=async({previousCacheEntry:r})=>{try{if(!B&&T&&S&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await n(o);e.fetchMetrics=L.renderOpts.fetchMetrics;let s=L.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let l=L.renderOpts.collectedTags;if(!M)return await (0,c.sendResponse)(W,G,i,L.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,x.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[g.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,a=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await R.onRequestError(e,t,{routerKind:"App Router",routePath:b,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:T})},!1,O),t}},d=await R.handleResponse({req:e,nextConfig:A,cacheKey:I,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:k,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:S,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:B});if(!M)return null;if((null==d||null==(i=d.value)?void 0:i.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(s=d.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",T?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,x.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&M||p.delete(g.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,f.getCacheControlHeader)(d.cacheControl)),await (0,c.sendResponse)(W,G,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};U&&H?await s(H):(o=$.getActiveScopeSpan(),await $.withPropagatedContext(e.headers,()=>$.trace(p.BaseServerSpan.handleRequest,{spanName:`${F} ${b}`,kind:i.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},s),void 0,!U))}catch(t){if(t instanceof m.NoFallbackError||await R.onRequestError(e,t,{routerKind:"App Router",routePath:z,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:T})},!1,O),M)throw t;return await (0,c.sendResponse)(W,G,new Response(null,{status:500})),null}}e.s(["handler",0,C,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:w,workUnitAsyncStorage:A})},"routeModule",0,R,"serverHooks",0,E,"workAsyncStorage",0,w,"workUnitAsyncStorage",0,A],36031)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__13bpekl._.js.map