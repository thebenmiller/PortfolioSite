var mosseFilterResponses=function(){var n=[],r=[],e=0;this.init=function(r,o,a,t){for(var i=0;i<o;i++){var s={};s.width=a,s.height=t;for(var f=a*t,l=new Float64Array(f),v=new Float64Array(f),u=0;u<f;u++)l[u]=r[i][0][u],v[u]=r[i][1][u];s.real=l,s.imag=v,n[i]=new mosseFilter,n[i].load(s)}e=o},this.getResponses=function(a){for(var t=0;t<e;t++)r[t]=n[t].getResponse(a[t]),r[t]=o(r[t]);return r};var o=function(n){for(var r=n.length,e=0,o=1,a=0;a<r;a++)e=n[a]>e?n[a]:e,o=n[a]<o?n[a]:o;var t=e-o;if(0==t)console.log("a patchresponse was monotone, causing normalization to fail. Leaving it unchanged."),n=n.map(function(){return 1});else for(var a=0;a<r;a++)n[a]=(n[a]-o)/t;return n}};