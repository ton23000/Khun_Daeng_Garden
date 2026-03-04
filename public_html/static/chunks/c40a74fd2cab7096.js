(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,35333,e=>{e.v({button:"Button-module__8RiFmG__button",fullWidth:"Button-module__8RiFmG__fullWidth",ghost:"Button-module__8RiFmG__ghost",lg:"Button-module__8RiFmG__lg",md:"Button-module__8RiFmG__md",outline:"Button-module__8RiFmG__outline",primary:"Button-module__8RiFmG__primary",secondary:"Button-module__8RiFmG__secondary",sm:"Button-module__8RiFmG__sm"})},59544,e=>{"use strict";var i=e.i(43476),r=e.i(71645),n=e.i(35333);let t=r.default.forwardRef(({className:e="",variant:r="primary",size:t="md",fullWidth:o=!1,children:a,...d},s)=>{let l=[n.default.button,n.default[r],n.default[t],o?n.default.fullWidth:"",e].filter(Boolean).join(" ");return(0,i.jsx)("button",{ref:s,className:l,...d,children:a})});t.displayName="Button",e.s(["Button",0,t])},88760,e=>{"use strict";var i=e.i(43476),r=e.i(71645),n=e.i(22016),t=e.i(18566),o=e.i(85205),a=e.i(59544);function d({children:e}){let d=(0,t.usePathname)(),s=(0,t.useRouter)(),{user:l,isLoading:m}=(0,o.useAuth)(),[c,p]=(0,r.useState)(!1);return((0,r.useEffect)(()=>{window.innerWidth>=768&&p(!0)},[d]),(0,r.useEffect)(()=>{window.innerWidth<768&&p(!1)},[d]),"/admin/login"===d)?(0,i.jsx)(i.Fragment,{children:e}):m?(0,i.jsx)("div",{className:"flex justify-center items-center min-h-screen",children:"Loading..."}):l&&"staff"===l.role&&"/admin/login"!==d?(s.push("/staff/orders"),null):(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("style",{dangerouslySetInnerHTML:{__html:`
                .admin-layout { 
                    display: flex; 
                    min-height: calc(100vh - 64px); 
                    align-items: flex-start;
                }
                
                .admin-sidebar { 
                    width: 260px; 
                    background-color: #f9fafb; 
                    border-right: 1px solid #e5e7eb; 
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0;
                    overflow-y: auto;
                    
                    /* Desktop Default (Sticky) */
                    position: sticky;
                    top: 64px;
                    height: calc(100vh - 64px);
                    z-index: 40;
                    margin-left: 0;
                    transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .admin-sidebar::-webkit-scrollbar { width: 6px; }
                .admin-sidebar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
                
                /* Desktop Closed State */
                .admin-sidebar:not(.open) {
                    margin-left: -260px;
                }

                .admin-main-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    width: 100%;
                }
                
                .admin-top-bar {
                    display: flex;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    background-color: white;
                    border-bottom: 1px solid #e5e7eb;
                    position: sticky;
                    top: 64px; /* Default global navbar height */
                    z-index: 30;
                }
                
                .admin-main { 
                    padding: 1rem; 
                    flex: 1;
                    background-color: white;
                }

                .sidebar-backdrop {
                    display: none; /* hidden on desktop */
                }

                .mobile-close-btn {
                    display: none !important;
                }

                /* Mobile overrides */
                @media (max-width: 767px) {
                    .admin-layout {
                        padding-bottom: 5rem; /* Space for the global mobile bottom nav */
                    }
                    .admin-sidebar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        height: 100vh;
                        padding: 1.5rem;
                        padding-bottom: 6rem; /* Extra padding so the logout button isn't covered */
                        z-index: 9999;
                        margin-left: 0 !important; /* disable margin transitioning */
                        transform: translateX(-100%);
                        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .admin-sidebar.open {
                        transform: translateX(0);
                    }
                    .mobile-close-btn {
                        display: flex !important;
                    }
                    .sidebar-backdrop {
                        display: block;
                        position: fixed;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background-color: rgba(0,0,0,0.5);
                        z-index: 9998;
                        opacity: 0;
                        visibility: hidden;
                        transition: opacity 0.3s ease, visibility 0.3s ease;
                    }
                    .sidebar-backdrop.open {
                        opacity: 1;
                        visibility: visible;
                    }
                    .admin-top-bar {
                        position: relative;
                        top: 0; /* Un-stick inner top bar on mobile */
                    }
                }
                
                @media (min-width: 768px) {
                    .admin-main { padding: 2rem; }
                }
            `}}),(0,i.jsxs)("div",{className:"admin-layout",children:[(0,i.jsx)("div",{className:`sidebar-backdrop ${c?"open":""}`,onClick:()=>p(!1)}),(0,i.jsx)("aside",{className:`admin-sidebar ${c?"open":""}`,children:(0,i.jsxs)("div",{className:"admin-sidebar-content-wrapper",style:{display:"flex",flexDirection:"column",height:"100%"},children:[(0,i.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"},children:[(0,i.jsx)(n.default,{href:"/admin/trees",style:{textDecoration:"none",display:"block"},children:(0,i.jsx)("h2",{style:{fontSize:"1.5rem",fontWeight:"bold",color:"#166534",margin:0,cursor:"pointer",whiteSpace:"nowrap"},children:"Admin Panel"})}),(0,i.jsx)("button",{onClick:()=>p(!1),style:{display:"flex",alignItems:"center",justifyContent:"center",padding:"0.5rem",backgroundColor:"#e5e7eb",color:"#4b5563",borderRadius:"0.375rem",border:"none",cursor:"pointer",transition:"background-color 0.2s"},className:"mobile-close-btn",children:(0,i.jsx)("svg",{width:"20",height:"20",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,i.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})})]}),(0,i.jsxs)("nav",{className:"flex flex-col gap-2 flex-1",style:{display:"flex",flexDirection:"column",gap:"0.5rem"},children:[(l?.role==="admin"||l?.role==="staff")&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("div",{style:{marginTop:"1rem",marginBottom:"0.25rem",paddingLeft:"0.5rem",fontSize:"0.75rem",fontWeight:"bold",color:"#9ca3af",textTransform:"uppercase",whiteSpace:"nowrap"},children:"จัดการออเดอร์"}),(0,i.jsxs)(n.default,{href:"/admin/orders",style:{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 1rem",borderRadius:"0.5rem",color:"/admin/orders"===d?"#166534":"#374151",backgroundColor:"/admin/orders"===d?"#dcfce7":"transparent",fontWeight:"/admin/orders"===d?500:400,textDecoration:"none",whiteSpace:"nowrap"},children:[(0,i.jsx)("span",{style:{fontSize:"1.25rem"},children:"🛒"})," ออเดอร์ทั้งหมด"]}),(0,i.jsxs)(n.default,{href:"/admin/reviews",style:{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 1rem",borderRadius:"0.5rem",color:"/admin/reviews"===d?"#166534":"#374151",backgroundColor:"/admin/reviews"===d?"#dcfce7":"transparent",fontWeight:"/admin/reviews"===d?500:400,textDecoration:"none",whiteSpace:"nowrap"},children:[(0,i.jsx)("span",{style:{fontSize:"1.25rem"},children:"⭐"})," จัดการรีวิว"]})]}),l?.role==="admin"&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("div",{style:{marginTop:"1rem",marginBottom:"0.25rem",paddingLeft:"0.5rem",fontSize:"0.75rem",fontWeight:"bold",color:"#9ca3af",textTransform:"uppercase",whiteSpace:"nowrap"},children:"จัดการสินค้า"}),(0,i.jsxs)(n.default,{href:"/admin/trees",style:{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 1rem",borderRadius:"0.5rem",color:"/admin/trees"===d?"#166534":"#374151",backgroundColor:"/admin/trees"===d?"#dcfce7":"transparent",fontWeight:"/admin/trees"===d?500:400,textDecoration:"none",whiteSpace:"nowrap"},children:[(0,i.jsx)("span",{style:{fontSize:"1.25rem"},children:"🌳"})," จัดการต้นไม้"]}),(0,i.jsxs)(n.default,{href:"/admin/inventory",style:{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 1rem",borderRadius:"0.5rem",color:"/admin/inventory"===d?"#166534":"#374151",backgroundColor:"/admin/inventory"===d?"#dcfce7":"transparent",fontWeight:"/admin/inventory"===d?500:400,textDecoration:"none",whiteSpace:"nowrap"},children:[(0,i.jsx)("span",{style:{fontSize:"1.25rem"},children:"📦"})," จัดการสต็อก"]}),(0,i.jsx)("div",{style:{marginTop:"1rem",marginBottom:"0.25rem",paddingLeft:"0.5rem",fontSize:"0.75rem",fontWeight:"bold",color:"#9ca3af",textTransform:"uppercase",whiteSpace:"nowrap"},children:"อื่นๆ"}),(0,i.jsxs)(n.default,{href:"/admin/users",style:{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 1rem",borderRadius:"0.5rem",color:"/admin/users"===d?"#166534":"#374151",backgroundColor:"/admin/users"===d?"#dcfce7":"transparent",fontWeight:"/admin/users"===d?500:400,textDecoration:"none",whiteSpace:"nowrap"},children:[(0,i.jsx)("span",{style:{fontSize:"1.25rem"},children:"👥"})," ข้อมูลผู้ใช้งาน"]}),(0,i.jsxs)(n.default,{href:"/admin/reports",style:{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 1rem",borderRadius:"0.5rem",color:"/admin/reports"===d?"#166534":"#374151",backgroundColor:"/admin/reports"===d?"#dcfce7":"transparent",fontWeight:"/admin/reports"===d?500:400,textDecoration:"none",whiteSpace:"nowrap"},children:[(0,i.jsx)("span",{style:{fontSize:"1.25rem"},children:"📈"})," รายงาน"]}),(0,i.jsxs)(n.default,{href:"/admin/promotions",style:{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 1rem",borderRadius:"0.5rem",color:"/admin/promotions"===d?"#166534":"#374151",backgroundColor:"/admin/promotions"===d?"#dcfce7":"transparent",fontWeight:"/admin/promotions"===d?500:400,textDecoration:"none",whiteSpace:"nowrap"},children:[(0,i.jsx)("span",{style:{fontSize:"1.25rem"},children:"🏷️"})," จัดการโปรโมชัน"]}),(0,i.jsxs)(n.default,{href:"/admin/settings",style:{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 1rem",borderRadius:"0.5rem",color:"/admin/settings"===d?"#166534":"#374151",backgroundColor:"/admin/settings"===d?"#dcfce7":"transparent",fontWeight:"/admin/settings"===d?500:400,textDecoration:"none",whiteSpace:"nowrap"},children:[(0,i.jsx)("span",{style:{fontSize:"1.25rem"},children:"⚙️"})," ตั้งค่าหน้าเพจ"]})]})]}),(0,i.jsxs)("div",{style:{marginTop:"auto",paddingTop:"1.5rem",borderTop:"1px solid #e5e7eb"},children:[l&&(0,i.jsxs)("div",{style:{marginBottom:"1rem",paddingLeft:"0.5rem",fontSize:"0.875rem",color:"#6b7280",whiteSpace:"nowrap"},children:["Signed in as: ",(0,i.jsx)("br",{}),(0,i.jsxs)("strong",{children:[l.firstName," ",l.lastName]})]}),(0,i.jsx)(n.default,{href:"/logout",style:{textDecoration:"none",display:"block"},children:(0,i.jsx)(a.Button,{variant:"outline",fullWidth:!0,children:"ออกจากระบบ"})})]})]})}),(0,i.jsxs)("div",{className:"admin-main-wrapper",children:[(0,i.jsxs)("div",{className:"admin-top-bar",children:[(0,i.jsx)("button",{onClick:()=>p(!c),style:{padding:"0.5rem",marginRight:"1rem",backgroundColor:"white",border:"1px solid #d1d5db",borderRadius:"0.375rem",boxShadow:"0 1px 2px 0 rgba(0, 0, 0, 0.05)",display:"flex",alignItems:"center",justifyContent:"center",color:"#374151",cursor:"pointer",transition:"background-color 0.2s"},className:"hamburger-btn",children:(0,i.jsx)("svg",{width:"20",height:"20",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,i.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6h16M4 12h16M4 18h16"})})}),(0,i.jsx)("h1",{style:{fontSize:"1.25rem",fontWeight:600,color:"#1f2937",margin:0},children:"จัดการข้อมูล (Admin)"})]}),(0,i.jsx)("main",{className:"admin-main",children:e})]})]})]})}e.s(["default",()=>d])}]);