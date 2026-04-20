module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},3170,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),i=e.i(59756),n=e.i(61916),o=e.i(74677),s=e.i(69741),l=e.i(16795),d=e.i(87718),p=e.i(95169),u=e.i(47587),c=e.i(66012),x=e.i(70101),h=e.i(26937),f=e.i(10372),m=e.i(93695);e.i(52474);var g=e.i(5232),v=e.i(5853);async function y(e){try{let{email:t,otp:r,name:a}=await e.json();if(!t||!r)return Response.json({error:"Missing required fields: email and otp are required"},{status:400});let{data:i,error:n}=await v.resend.emails.send({from:v.FROM_EMAIL,to:t,subject:"Nambari yako ya kuthibitisha — Your verification code",html:`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f7f7f7;">
          <!-- Header -->
          <div style="background: #2D7A3A; padding: 28px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">&#127860; FoodOS</h1>
            <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 6px 0 0;">Mfumo wa Usimamizi wa Mgahawa</p>
          </div>

          <!-- Body -->
          <div style="background: #ffffff; padding: 35px 30px; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8;">
            <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 8px;">
              Habari ${a||"Mtumiaji"},
            </h2>
            <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 25px;">
              Tumepokea ombi la kuingia kwenye akaunti yako. Tumia nambari hii ya kuthibitisha:
              <br />
              <span style="color: #888; font-size: 13px;">We received a request to sign in to your account. Use this verification code:</span>
            </p>

            <!-- OTP Code Card -->
            <div style="background: #f8faf8; border: 2px solid #2D7A3A; border-radius: 12px; padding: 30px; text-align: center; margin: 0 0 25px;">
              <p style="color: #888; font-size: 12px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">
                Nambari ya Kuthibitisha (Verification Code)
              </p>
              <div style="font-size: 40px; font-weight: 800; color: #E8712B; letter-spacing: 10px; font-family: 'Courier New', monospace; margin: 0;">
                ${r}
              </div>
            </div>

            <!-- Expiry Notice -->
            <div style="background: #FFF8F0; border-left: 4px solid #E8712B; padding: 14px 16px; border-radius: 0 8px 8px 0; margin: 0 0 25px;">
              <p style="color: #E8712B; font-size: 13px; margin: 0; font-weight: 600;">
                Nambari hii itaisha baada ya dakika 10.
              </p>
              <p style="color: #C06020; font-size: 12px; margin: 4px 0 0;">
                This code expires in 10 minutes.
              </p>
            </div>

            <!-- Security note -->
            <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 0;">
              Ikiwa hukuomba nambari hii, puuza barua pepe hii. Akaunti yako iko salama.
              <br />
              <span style="color: #aaa;">If you didn't request this code, please ignore this email. Your account is safe.</span>
            </p>
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
      `});if(n)return console.error("Resend error:",n),Response.json({error:"Failed to send OTP email"},{status:500});return Response.json({success:!0,messageId:i?.id})}catch(e){return console.error("OTP email error:",e),Response.json({error:"OTP email send failed"},{status:500})}}e.s(["POST",0,y],87226);var b=e.i(87226);let R=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/email/otp/route",pathname:"/api/email/otp",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/email/otp/route.ts",nextConfigOutput:"standalone",userland:b,...{}}),{workAsyncStorage:w,workUnitAsyncStorage:E,serverHooks:C}=R;async function k(e,t,a){a.requestMeta&&(0,i.setRequestMeta)(e,a.requestMeta),R.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/email/otp/route";v=v.replace(/\/index$/,"")||"/";let y=await R.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!y)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:b,params:w,nextConfig:E,parsedUrl:C,isDraftMode:k,prerenderManifest:A,routerServerContext:T,isOnDemandRevalidate:N,revalidateOnlyGenerated:O,resolvedPathname:P,clientReferenceManifest:S,serverActionsManifest:q}=y,M=(0,s.normalizeAppPath)(v),_=!!(A.dynamicRoutes[M]||A.routes[P]),j=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,C,!1):t.end("This page could not be found"),null);if(_&&!k){let e=!!A.routes[P],t=A.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(E.adapterPath)return await j();throw new m.NoFallbackError}}let I=null;!_||R.isDev||k||(I="/index"===(I=P)?"/":I);let F=!0===R.isDev||!_,H=_&&!F;q&&S&&(0,o.setManifestsSingleton)({page:v,clientReferenceManifest:S,serverActionsManifest:q});let U=e.method||"GET",D=(0,n.getTracer)(),z=D.getActiveScopeSpan(),$=!!(null==T?void 0:T.isWrappedByNextServer),B=!!(0,i.getRequestMeta)(e,"minimalMode"),K=(0,i.getRequestMeta)(e,"incrementalCache")||await R.getIncrementalCache(e,E,A,B);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let L={params:w,previewProps:A.preview,renderOpts:{experimental:{authInterrupts:!!E.experimental.authInterrupts},cacheComponents:!!E.cacheComponents,supportsDynamicResponse:F,incrementalCache:K,cacheLifeProfiles:E.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,i)=>R.onRequestError(e,t,a,i,T)},sharedContext:{buildId:b}},W=new l.NodeNextRequest(e),V=new l.NodeNextResponse(t),G=d.NextRequestAdapter.fromNodeNextRequest(W,(0,d.signalFromNodeResponse)(t));try{let i,o=async e=>R.handle(G,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=D.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${U} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),i&&i!==e&&(i.setAttribute("http.route",a),i.updateName(t))}else e.updateName(`${U} ${v}`)}),s=async i=>{var n,s;let l=async({previousCacheEntry:r})=>{try{if(!B&&N&&O&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(i);e.fetchMetrics=L.renderOpts.fetchMetrics;let s=L.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let l=L.renderOpts.collectedTags;if(!_)return await (0,c.sendResponse)(W,V,n,L.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,x.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[f.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,a=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:g.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await R.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:N})},!1,T),t}},d=await R.handleResponse({req:e,nextConfig:E,cacheKey:I,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:N,revalidateOnlyGenerated:O,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:B});if(!_)return null;if((null==d||null==(n=d.value)?void 0:n.kind)!==g.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(s=d.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",N?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),k&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,x.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&_||p.delete(f.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,h.getCacheControlHeader)(d.cacheControl)),await (0,c.sendResponse)(W,V,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};$&&z?await s(z):(i=D.getActiveScopeSpan(),await D.withPropagatedContext(e.headers,()=>D.trace(p.BaseServerSpan.handleRequest,{spanName:`${U} ${v}`,kind:n.SpanKind.SERVER,attributes:{"http.method":U,"http.target":e.url}},s),void 0,!$))}catch(t){if(t instanceof m.NoFallbackError||await R.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:N})},!1,T),_)throw t;return await (0,c.sendResponse)(W,V,new Response(null,{status:500})),null}}e.s(["handler",0,k,"patchFetch",0,function(){return(0,a.patchFetch)({workAsyncStorage:w,workUnitAsyncStorage:E})},"routeModule",0,R,"serverHooks",0,C,"workAsyncStorage",0,w,"workUnitAsyncStorage",0,E],3170)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ebr5t3._.js.map