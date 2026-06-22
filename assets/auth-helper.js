/**
 * GameHub B2B Platforms - Auth & Multi-tenant Switcher Helper
 * Author: Specialist AI Studio Front-End Developer
 * Description: Enables interactive logins, master dual-site access, and multi-partner brand Switching.
 */

const DEMO_USERS = [
  {
    email: "master@gamehub.vn",
    password: "master123",
    name: "Nguyễn Minh Hoàng",
    avatar: "MH",
    role: "master",
    roleLabel: "Super Master (Tối cao)",
    allowedPortals: ["admin", "partner"],
    allowedPartners: ["ALL", "garena", "vng", "vtc", "krafton"],
    currentPartner: "garena"
  },
  {
    email: "partner.multi@gamehub.vn",
    password: "partner123",
    name: "Lê Hoàng Yến",
    avatar: "HY",
    role: "partner_multi",
    roleLabel: "Quản trị viên Liên thông",
    allowedPortals: ["partner"],
    allowedPartners: ["garena", "vng", "vtc"],
    currentPartner: "vng"
  },
  {
    email: "partner@garena.vn",
    password: "garena123",
    name: "Trần Hồng Nam",
    avatar: "HN",
    role: "partner",
    roleLabel: "CEO Garena Vietnam",
    allowedPortals: ["partner"],
    allowedPartners: ["garena"],
    currentPartner: "garena"
  },
  {
    email: "admin@gamehub.vn",
    password: "admin123",
    name: "Phạm Minh Đức",
    avatar: "MĐ",
    role: "admin",
    roleLabel: "Admin Hệ Thống",
    allowedPortals: ["admin"],
    allowedPartners: [],
    currentPartner: null
  }
];

const PARTNERS_DATA = {
  garena: {
    id: "garena",
    name: "Garena Vietnam",
    fullname: "Công ty Cổ phần Giải trí và Thể thao Điện tử Việt Nam",
    logoText: "G",
    logoBg: "bg-orange-600/20 text-orange-400 border-orange-500/20",
    idCode: "PTN_001",
    spCode: "VN_VTL_001",
    apiCalls: "870,412",
    revenue: "256,120,000 ₫",
    sla: "99.94%",
    status: "Active",
    games: ["Free Fire Max", "Liên Quân Mobile", "Cái Thế Tranh Hùng"],
    services: "3 cổng dịch vụ đang kích hoạt"
  },
  vng: {
    id: "vng",
    name: "VNG Corporation",
    fullname: "Công ty Cổ phần VNG (VNG Corporation)",
    logoText: "V",
    logoBg: "bg-blue-600/20 text-blue-400 border-blue-500/20",
    idCode: "PTN_002",
    spCode: "VN_MBF_002",
    apiCalls: "412,056",
    revenue: "115,450,000 ₫",
    sla: "99.91%",
    status: "Active",
    games: ["Võ Lâm Truyền Kỳ H5", "PUBG Mobile VN", "ZingPlay"],
    services: "2 cổng dịch vụ đang kích hoạt"
  },
  vtc: {
    id: "vtc",
    name: "VTC Mobile",
    fullname: "Tổng Công ty Truyền thông Đa phương tiện VTC Việt Nam",
    logoText: "VT",
    logoBg: "bg-purple-600/20 text-purple-400 border-purple-500/20",
    idCode: "PTN_003",
    spCode: "VN_VNP_003",
    apiCalls: "235,942",
    revenue: "78,280,000 ₫",
    sla: "99.88%",
    status: "Active",
    games: ["Truy Kích PC", "Au Mobile", "Giang Hồ Ngũ Tuyệt"],
    services: "2 cổng dịch vụ đang kích hoạt"
  },
  krafton: {
    id: "krafton",
    name: "Krafton Vietnam",
    fullname: "Krafton Inc. Vietnam Branch",
    logoText: "K",
    logoBg: "bg-teal-600/20 text-teal-400 border-teal-500/20",
    idCode: "PTN_004",
    spCode: "VN_KFT_001",
    apiCalls: "129,540",
    revenue: "54,190,000 ₫",
    sla: "99.95%",
    status: "Active",
    games: ["PUBG Battlegrounds", "Defense Derby"],
    services: "1 cổng dịch vụ đang kích hoạt"
  }
};

// Initialize session state if not existing
function getLocalStorage(key, defaultVal) {
  const item = localStorage.getItem(key);
  if (item) {
    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  }
  return defaultVal;
}

function setLocalStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// Get Logged-in User
function getLoggedInUser() {
  const defaultUser = window.location.pathname.includes('/admin/') ? DEMO_USERS[3] : DEMO_USERS[2];
  return getLocalStorage("gamehub_user", defaultUser);
}

// Get selected partner data based on the logged-in user context
function getSelectedPartner() {
  const user = getLoggedInUser();
  if (!user || !user.currentPartner) return PARTNERS_DATA.garena;
  return PARTNERS_DATA[user.currentPartner] || PARTNERS_DATA.garena;
}

// Get list of all available role identities for a user based on their account/email
function getUserRoles(user) {
  if (!user) return [];
  if (user.email === "master@gamehub.vn") {
    return [
      { id: "master_super", label: "🛡️ Admin Tối Cao (Super Admin)", targetPortal: "admin", targetRole: "master", targetPartner: null },
      { id: "master_sub", label: "🛡️ Admin Phụ (Assistant Admin)", targetPortal: "admin", targetRole: "admin", targetPartner: null },
      { id: "master_garena", label: "🏢 Super Partner Garena (CEO Garena)", targetPortal: "partner", targetRole: "master", targetPartner: "garena" },
      { id: "master_garena_sub", label: "🏢 Partner Phụ Garena (Assistant Garena)", targetPortal: "partner", targetRole: "partner_multi", targetPartner: "garena" },
      { id: "master_vng", label: "🏢 Partner VNG (Trưởng ban vận hành)", targetPortal: "partner", targetRole: "master", targetPartner: "vng" },
      { id: "master_bug", label: "👾 Super Bug (Nhà phát triển tối cao)", targetPortal: "admin", targetRole: "master", targetPartner: null }
    ];
  } else if (user.email === "partner.multi@gamehub.vn") {
    return [
      { id: "multi_vng", label: "🏢 Partner VNG (Vận hành chính)", targetPortal: "partner", targetRole: "partner_multi", targetPartner: "vng" },
      { id: "multi_garena", label: "🏢 Super Partner Garena (CEO Garena)", targetPortal: "partner", targetRole: "partner_multi", targetPartner: "garena" },
      { id: "multi_garena_sub", label: "🏢 Partner Phụ Garena (Assistant Garena)", targetPortal: "partner", targetRole: "partner_multi", targetPartner: "garena" }
    ];
  } else if (user.email === "partner@garena.vn") {
    return [
      { id: "garena_ceo", label: "🏢 Super Partner Garena (CEO Garena VN)", targetPortal: "partner", targetRole: "partner", targetPartner: "garena" },
      { id: "garena_sub", label: "🏢 Partner Phụ Garena (Assistant Garena)", targetPortal: "partner", targetRole: "partner", targetPartner: "garena" }
    ];
  } else if (user.email === "admin@gamehub.vn") {
    return [
      { id: "admin_super", label: "🛡️ Super Admin Hệ Thống", targetPortal: "admin", targetRole: "admin", targetPartner: null },
      { id: "admin_sub", label: "🛡️ Admin Phụ (Assistant Admin)", targetPortal: "admin", targetRole: "admin", targetPartner: null }
    ];
  } else {
    // Dynamically fallback for custom defined roles
    const pId = user.currentPartner || (user.allowedPartners && user.allowedPartners[0]) || "garena";
    const titleVal = user.roleLabel || "Thành viên";
    const isAdm = user.role === "admin" || user.role === "master";
    return [
      { id: "custom_user_1", label: isAdm ? `🛡️ ${titleVal}` : `🏢 ${titleVal}`, targetPortal: isAdm ? "admin" : "partner", targetRole: user.role, targetPartner: isAdm ? null : pId }
    ];
  }
}

// Global scope action to switch user identity and reload
window.switchActiveRoleIdentityDirectly = function(targetPortal, targetRole, targetPartner) {
  const user = getLoggedInUser();
  if (!user) return;

  user.role = targetRole;
  user.currentPartner = targetPartner;

  // Set appropriate role label dynamically to reflect their newly switched identity
  if (targetPortal === "admin") {
    if (targetRole === "master") {
      user.roleLabel = "Super Master (Tối cao)";
    } else {
      user.roleLabel = "Phó Admin Hệ Thống";
    }
  } else {
    if (targetPartner === "garena") user.roleLabel = "CEO Garena Vietnam";
    else if (targetPartner === "vng") user.roleLabel = "Trưởng Ban Vận Hành VNG";
    else if (targetPartner === "vtc") user.roleLabel = "Kỹ Thuật Trưởng VTC";
    else if (targetPartner === "krafton") user.roleLabel = "Đại Diện Ủy Quyền";
    else user.roleLabel = "Đối Tác Partner";
  }

  setLocalStorage("gamehub_user", user);

  showToast(`Đang chuyển sang vai trò: ${targetPortal === 'admin' ? '🛡️ Ban Quản Trị Hệ Thống' : '🏢 ' + PARTNERS_DATA[targetPartner].name}`, "info");

  setTimeout(() => {
    let targetUrl;
    if (targetPortal === "admin") {
      targetUrl = window.location.pathname.includes('/partner/') 
        ? window.location.pathname.replace(/\/partner\/.*/, '/admin/dashboard.html')
        : '../admin/dashboard.html';
    } else {
      targetUrl = window.location.pathname.includes('/admin/')
        ? window.location.pathname.replace(/\/admin\/.*/, '/partner/dashboard.html')
        : '../partner/dashboard.html';
    }
    window.location.href = targetUrl;
  }, 750);
};

// Login operation
function performLogin(email, password, overrideRole = null) {
  const user = DEMO_USERS.find(u => u.email === email);
  if (user) {
    // Save user state
    setLocalStorage("gamehub_user", user);
    showToast(`Đăng nhập thành công: ${user.name}`, "success");
    
    setTimeout(() => {
      if (overrideRole) {
        window.location.href = overrideRole === "admin" ? "admin/dashboard.html" : "partner/dashboard.html";
      } else {
        const primaryPortal = user.allowedPortals[0];
        window.location.href = primaryPortal === "admin" ? "admin/dashboard.html" : "partner/dashboard.html";
      }
    }, 800);
    return true;
  }
  return false;
}

// Show Toast message
function showToast(message, type = "success") {
  const oldToast = document.getElementById("gamehub-toast");
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.id = "gamehub-toast";
  toast.className = `fixed bottom-5 right-5 z-[9999] p-4 rounded-xl shadow-2xl flex items-center gap-3 border transition-all duration-300 transform translate-y-10 opacity-0 font-medium text-sm`;
  
  if (type === "success") {
    toast.className += " bg-[#0F1D13] border-green-500/50 text-green-300";
    toast.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5 text-green-400"></i><span>${message}</span>`;
  } else if (type === "info") {
    toast.className += " bg-[#111A2E] border-cyan-500/50 text-cyan-300";
    toast.innerHTML = `<i data-lucide="info" class="w-5 h-5 text-cyan-400"></i><span>${message}</span>`;
  } else {
    toast.className += " bg-[#2A1215] border-red-500/50 text-red-300";
    toast.innerHTML = `<i data-lucide="alert-triangle" class="w-5 h-5 text-red-400"></i><span>${message}</span>`;
  }

  document.body.appendChild(toast);
  lucide.createIcons({ attrs: { class: "w-5 h-5" } });

  // Fade in
  setTimeout(() => {
    toast.classList.remove("translate-y-10", "opacity-0");
  }, 10);

  // Fade out
  setTimeout(() => {
    toast.classList.add("translate-y-10", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Switch Tenant / Partner (Applicable for Master or Multi-Partner accounts)
function switchPartnerTenant(partnerId) {
  const user = getLoggedInUser();
  if (!user) return;
  
  if (user.allowedPartners.includes("ALL") || user.allowedPartners.includes(partnerId)) {
    user.currentPartner = partnerId;
    setLocalStorage("gamehub_user", user);
    showToast(`Đã chuyển không gian làm việc sang: ${PARTNERS_DATA[partnerId].name}`, "info");
    
    // Dispatch custom event if any interface wants to listen
    window.dispatchEvent(new CustomEvent('tenantChanged', { detail: partnerId }));
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else {
    showToast("Không có quyền truy cập đối tác này!", "error");
  }
}

// Auto inject header details, switcher widgets upon page load
function autoConfigurePortalUI() {
  const user = getLoggedInUser();
  const partner = getSelectedPartner();
  const isPartnerPortal = window.location.pathname.includes('/partner/');
  const isAdminPortal = window.location.pathname.includes('/admin/');

  if (!isPartnerPortal && !isAdminPortal) return; // Login / index side is handled customly

  // Update Username elements
  const userProfileNames = document.querySelectorAll(".font-bold.text-gray-200, .text-sm.font-medium.text-gray-300");
  userProfileNames.forEach(el => {
    // If it is in the bottom sidebar
    if (el.textContent === "Admin System" || el.textContent === "Garena VN") {
      el.textContent = user.name;
    }
    // If it is in the top header info
    if (el.textContent.includes("Admin System ▾") || el.textContent.includes("Garena Admin ▾")) {
      el.innerHTML = `${user.name} <span class="text-xs text-gray-500 font-medium">(${user.roleLabel})</span> ▾`;
    }
  });

  // Update Avatar abbreviations
  const avatarElements = document.querySelectorAll(".w-8.h-8.rounded-full.bg-violet-600, .w-8.h-8.rounded-full.bg-cyan-600, .w-8.h-8.rounded-full.bg-slate-800");
  avatarElements.forEach(el => {
    if (el.textContent.trim() === "AD" || el.textContent.trim() === "GA" || el.textContent.trim() === "A" || el.textContent.trim() === "G") {
      el.textContent = user.avatar;
      
      // Customize color according to role
      if (user.role === "master") {
        el.className = el.className.replace(/bg-\w+-600/g, 'bg-violet-700 border-2 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]');
      } else if (user.role === "partner_multi") {
        el.className = el.className.replace(/bg-\w+-600/g, 'bg-cyan-700 border border-violet-500');
      }
    }
  });

  // Dynamically tailor calculations for selected partner in Partner Dashboard
  if (isPartnerPortal) {
    tailorPartnerDashboardData(partner);
    if (window.location.pathname.includes('info.html')) {
      tailorPartnerInfoPageData(partner);
    }
  }

  // Inject the advanced interactive avatar dropdown multi-site & multi-tenant switcher
  injectInteractiveAvatarMenu(user, partner, isPartnerPortal);
}

// Inject advanced identity management & space switcher drop menu directly when user clicks their avatar
function injectInteractiveAvatarMenu(user, currentPartner, isPartnerPortal) {
  const header = document.querySelector("header");
  if (!header) return;

  const actionsBlock = header.querySelector(".flex.items-center.gap-4") || header;
  if (!actionsBlock) return;

  // Identify original profile container usually located at the end of the header block
  const originalProfileNode = actionsBlock.lastElementChild;
  if (!originalProfileNode) return;

  // Multi-injection guard
  if (document.getElementById("gamehub-avatar-dropdown-container")) return;

  const dropdownContainer = document.createElement("div");
  dropdownContainer.id = "gamehub-avatar-dropdown-container";
  dropdownContainer.className = "relative inline-block text-left";

  let avatarBgClass = "bg-slate-800 text-cyan-400 border-gray-700";
  if (user.role === "master") {
    avatarBgClass = "bg-violet-700 text-cyan-300 border-cyan-400/50 border";
  } else if (user.role === "partner_multi") {
    avatarBgClass = "bg-cyan-700 text-violet-200 border-violet-500/40 border";
  } else if (user.role === "admin") {
    avatarBgClass = "bg-violet-600 text-white border-violet-500/40 border";
  }

  // 1. Render all allowed user active role identities
  const userRoles = getUserRoles(user);
  let identityListMarkup = "";
  
  userRoles.forEach(roleOpt => {
    const isPortalCurrent = (roleOpt.targetPortal === "admin" && !isPartnerPortal) || (roleOpt.targetPortal === "partner" && isPartnerPortal);
    const isRoleCurrent = user.role === roleOpt.targetRole;
    const isPartnerCurrent = !roleOpt.targetPartner || (user.currentPartner === roleOpt.targetPartner);
    
    const isActive = isPortalCurrent && isRoleCurrent && isPartnerCurrent;
    
    const activeClass = isActive
      ? "bg-slate-800 text-cyan-400 font-bold border-cyan-900/50"
      : "border-transparent text-gray-300 hover:bg-gray-800/50 hover:text-white";
      
    identityListMarkup += `
      <button onclick="window.switchActiveRoleIdentityDirectly('${roleOpt.targetPortal}', '${roleOpt.targetRole}', ${roleOpt.targetPartner ? `'${roleOpt.targetPartner}'` : 'null'})" class="w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors border text-left cursor-pointer ${activeClass}" ${isActive ? 'disabled' : ''}>
        <span class="truncate">${roleOpt.label}</span>
        ${isActive ? '<span class="text-[8px] bg-cyan-500/15 px-1.5 py-0.5 rounded text-cyan-400 uppercase font-mono tracking-wider shrink-0 ml-1.5">ĐANG CHỌN</span>' : '<i data-lucide="chevron-right" class="w-3.5 h-3.5 text-gray-500 shrink-0 ml-1.5"></i>'}
      </button>
    `;
  });

  // Populate total simplified layout markup with a flat selectable roles panel
  dropdownContainer.innerHTML = `
    <!-- Simple Avatar Trigger -->
    <button id="gamehub-avatar-trigger" class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer text-left select-none shadow-sm">
      <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border pointer-events-none shrink-0 uppercase ${avatarBgClass}">
        ${user.avatar}
      </div>
      <div class="text-left hidden sm:block pointer-events-none">
        <p class="text-xs font-bold text-gray-200 leading-tight">${user.name}</p>
        <p class="text-[9px] font-mono text-cyan-400 mt-0.5 leading-none font-medium tracking-wide flex items-center gap-1">
          <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
          ${user.roleLabel}
        </p>
      </div>
      <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-gray-400 transition-transform pointer-events-none shrink-0" id="gamehub-avatar-arrow"></i>
    </button>

    <!-- Dropdown Content Box -->
    <div id="gamehub-avatar-menu" class="absolute right-0 top-full mt-2 w-72 bg-[#161B22] border border-gray-800 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-2.5 space-y-3.5 hidden z-50 transform scale-95 opacity-0 transition-all duration-150 origin-top-right">
      
      <!-- Account Info Header -->
      <div class="px-2 py-1.5 border-b border-gray-800">
        <p class="text-xs font-bold text-white">${user.name}</p>
        <p class="text-[10px] text-gray-500 font-mono truncate">${user.email}</p>
      </div>

      <!-- Unified Roles List -->
      <div class="space-y-1.5">
        <span class="text-[9px] font-bold uppercase tracking-widest text-cyan-400 font-mono px-1 block">Vai trò thực tế khả dụng</span>
        <div class="space-y-1 max-h-[280px] overflow-y-auto">
          ${identityListMarkup}
        </div>
      </div>

      <!-- Bottom utilities -->
      <div class="border-t border-gray-800 pt-2 flex items-center justify-between">
        <span class="text-[8px] text-gray-600 font-mono tracking-wider ml-1 uppercase">B2B Core System</span>
        <button onclick="window.location.href = '../index.html'" class="flex items-center gap-1 text-[11px] font-bold text-red-400 hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer">
          <i data-lucide="log-out" class="w-3 h-3 text-red-400"></i>
          <span>Thoát</span>
        </button>
      </div>
    </div>
  `;

  // Swap original profile node out, embed interactive GameHub drop element in
  actionsBlock.replaceChild(dropdownContainer, originalProfileNode);

  // Re-run lucide renderer instantly for dropdown interior elements
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Bind interactive click toggle events
  const triggerBtn = document.getElementById("gamehub-avatar-trigger");
  const dropdownMenu = document.getElementById("gamehub-avatar-menu");
  const arrowIcon = document.getElementById("gamehub-avatar-arrow");

  if (triggerBtn && dropdownMenu) {
    triggerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = dropdownMenu.classList.contains("hidden");
      
      if (isHidden) {
        dropdownMenu.classList.remove("hidden");
        dropdownMenu.offsetHeight;
        dropdownMenu.classList.remove("scale-95", "opacity-0");
        dropdownMenu.classList.add("scale-100", "opacity-100");
        if (arrowIcon) arrowIcon.classList.add("rotate-180");
        triggerBtn.classList.add("bg-slate-800/80", "border-gray-700");
      } else {
        closeAvatarMenu();
      }
    });

    function closeAvatarMenu() {
      dropdownMenu.classList.remove("scale-100", "opacity-100");
      dropdownMenu.classList.add("scale-95", "opacity-0");
      if (arrowIcon) arrowIcon.classList.remove("rotate-180");
      triggerBtn.classList.remove("bg-slate-800/80", "border-gray-700");
      setTimeout(() => {
        dropdownMenu.classList.add("hidden");
      }, 150);
    }

    document.addEventListener("click", (event) => {
      if (!dropdownMenu.classList.contains("hidden") && !dropdownContainer.contains(event.target)) {
        closeAvatarMenu();
      }
    });

    dropdownMenu.addEventListener("click", (e) => {
      if (!e.target.closest('button')) {
        e.stopPropagation();
      }
    });
  }
}

// Global scope bindings for direct buttons click trigger
window.switchPortalDirectly = function(targetPortal) {
  const user = getLoggedInUser();
  if (!user.allowedPortals.includes(targetPortal)) {
    showToast("Tài khoản hiện tại của bạn không mang thẩm quyền cổng này!", "error");
    return;
  }
  
  showToast(`Chuyển sang: ${targetPortal === 'admin' ? 'Hệ thống Admin 🛡️' : 'Đối tác Partner 🤝'}`, "info");
  
  setTimeout(() => {
    let targetUrl;
    if (targetPortal === "admin") {
      targetUrl = window.location.pathname.includes('/partner/') 
        ? window.location.pathname.replace(/\/partner\/.*/, '/admin/dashboard.html')
        : '../admin/dashboard.html';
    } else {
      targetUrl = window.location.pathname.includes('/admin/')
        ? window.location.pathname.replace(/\/admin\/.*/, '/partner/dashboard.html')
        : '../partner/dashboard.html';
    }
    window.location.href = targetUrl;
  }, 750);
};

window.switchPartnerTenantDirectly = function(partnerId) {
  // Directly trigger pre-defined tenant changing mechanism
  switchPartnerTenant(partnerId);
};


// Adjust Partner corporate Enterprise Profile page (info.html)
function tailorPartnerInfoPageData(partner) {
  // Update Huge Company Name
  const compNameH3 = document.querySelector("main h3.text-lg.font-extrabold.text-white");
  if (compNameH3) compNameH3.textContent = partner.fullname;

  // Update Partner Logo box abbreviation symbol
  const logoBox = document.querySelector("main .w-14.h-14.rounded-2xl");
  if (logoBox) {
    logoBox.textContent = partner.logoText;
  }

  // Update partner Code PTN_XXX
  const partnerCodeSpan = document.querySelector("main span.text-gray-500");
  if (partnerCodeSpan) {
    partnerCodeSpan.textContent = `Mã đối tác: ${partner.idCode}`;
  }

  // Update representative person
  const repName = document.querySelector("main p.font-bold.text-gray-100"); // Let's check both text-gray-200 and text-gray-100
  const repNameAlt = document.querySelector("main p.font-bold.text-gray-200");
  const targetRep = repName || repNameAlt;
  if (targetRep) {
    const reps = {
      garena: "Trần Hồng Nam (Giám đốc Garena VN)",
      vng: "Lê Hồng Minh (Tổng Giám đốc VNG)",
      vtc: "Nguyễn Xuân Cường (Chủ tịch VTC)",
      krafton: "Changhan Kim (CEO Krafton HQ)"
    };
    targetRep.textContent = reps[partner.id] || "Trần Hồng Nam (Giám đốc)";
  }
}

// Switch between Admin Portal and Partner Portal
function switchPortal(targetPortal) {
  const user = getLoggedInUser();
  if (user.role !== "master") {
    showToast("Chỉ tài khoản Super Master mới có thể chuyển cổng!", "error");
    return;
  }
  
  showToast(`Đang chuyển cổng sang: ${targetPortal.toUpperCase()} Portal`, "success");
  setTimeout(() => {
    window.location.href = targetPortal === "admin" ? "../admin/dashboard.html" : "../partner/dashboard.html";
  }, 1000);
}

// Injects portal selector panel
function injectDualPortalSwitcher(current) {
  const header = document.querySelector("header");
  if (!header) return;

  const switcher = document.createElement("div");
  switcher.className = "flex items-center gap-1.5 bg-violet-950/40 border border-violet-500/20 px-2 py-1 rounded-xl shadow-inner mr-2";
  switcher.innerHTML = `
    <span class="text-[10px] font-bold text-violet-400 uppercase tracking-widest px-1 font-mono">Master Cổng:</span>
    <button onclick="switchPortal('admin')" class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${current === 'admin' ? 'bg-violet-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}">System Admin</button>
    <button onclick="switchPortal('partner')" class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${current === 'partner' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}">Partner Portal</button>
  `;
  
  // Insert at the beginning of actions block
  const actionsBlock = header.querySelector(".flex.items-center.gap-4") || header;
  actionsBlock.insertBefore(switcher, actionsBlock.firstChild);
}

// Injects tenant Switching dropdown (Multi-Tenant Selector)
function injectTenantSwitcherDropdown(user, currentPartner, isPartnerPortal) {
  const header = document.querySelector("header");
  if (!header) return;

  const dropdownContainer = document.createElement("div");
  dropdownContainer.className = "relative group";

  // Formulate items
  const availableIds = user.allowedPartners.includes("ALL") 
    ? Object.keys(PARTNERS_DATA) 
    : user.allowedPartners;

  let optionsMarkup = "";
  availableIds.forEach(id => {
    const data = PARTNERS_DATA[id];
    const activeClass = currentPartner.id === id ? "bg-cyan-950/60 border-l-2 border-cyan-400 text-cyan-300" : "text-gray-300 hover:bg-gray-800/60";
    optionsMarkup += `
      <button onclick="switchPartnerTenant('${id}')" class="w-full text-left px-3.5 py-2.5 text-xs rounded-md transition-all flex items-center justify-between ${activeClass}">
        <span class="font-semibold">${data.name}</span>
        <span class="font-mono text-[9px] text-[#06B6D4] bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/30">${data.idCode}</span>
      </button>
    `;
  });

  // Update static partner label in Partner Portal Header if exists
  const currentBadge = header.querySelector(".bg-cyan-950.text-cyan-300, .bg-violet-950.text-violet-300");
  if (currentBadge && isPartnerPortal) {
    currentBadge.remove(); // We will substitute it with the elegant selector below
  }

  dropdownContainer.innerHTML = `
    <div class="flex items-center gap-1.5 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400/40 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm">
      <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
      <span class="text-xs font-bold uppercase tracking-wider text-cyan-300">${currentPartner.name}</span>
      <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:rotate-180"></i>
    </div>
    <!-- Dropdown absolute card -->
    <div class="absolute right-0 top-full mt-2 w-64 bg-[#161B22] border border-gray-800 rounded-xl shadow-2xl p-1.5 z-50 pointer-events-none opacity-0 scale-95 origin-top-right group-hover:pointer-events-auto group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
      <div class="px-3 py-2 border-b border-gray-800 mb-1.5">
        <span class="text-[9.5px] font-bold uppercase tracking-widest text-gray-500 font-mono">Chọn không gian đối tác</span>
      </div>
      <div class="space-y-0.5 max-h-[250px] overflow-y-auto">
        ${optionsMarkup}
      </div>
    </div>
  `;

  // Insert before users drop profile
  const actionsBlock = header.querySelector(".flex.items-center.gap-4") || header;
  const userProfileNode = actionsBlock.lastElementChild;
  actionsBlock.insertBefore(dropdownContainer, userProfileNode);
}

// Adjust Partner Dashboard widgets based on Corporate Tenant selection
function tailorPartnerDashboardData(partner) {
  // Update Welcome text
  const welcomeBadge = document.querySelector("main .text-cyan-400.uppercase");
  if (welcomeBadge) welcomeBadge.textContent = `Xin chào ${partner.name.toUpperCase()}`;

  const welcomeHeader = document.querySelector("main h1.text-2xl");
  if (welcomeHeader) welcomeHeader.textContent = `Không gian liên kết - ${partner.name}`;

  // Update KPI 1: Transactions
  const kpiTransactions = document.querySelectorAll("main p.text-3xl.font-black.font-mono");
  if (kpiTransactions.length >= 3) {
    kpiTransactions[0].textContent = partner.apiCalls;
    kpiTransactions[1].textContent = partner.revenue;
    kpiTransactions[2].textContent = partner.sla;
  }

  // Inject game names lists dynamically if we find a list of games
  // Or keep as is. Let's find any descriptions or side contents
  const welcomeText = document.querySelector("main p.text-xs.text-gray-500");
  if (welcomeText && welcomeText.textContent.includes("súng sinh tồn")) {
    welcomeText.innerHTML = `Toàn bộ dải game tích hợp: <strong class="text-cyan-300 font-medium">${partner.games.join(', ')}</strong> đang hoạt động ổn định và có sản lượng cao.`;
  }
}

// Auto kick-off when the DOM resources are fully mounted
document.addEventListener("DOMContentLoaded", () => {
  autoConfigurePortalUI();
  
  // Re-run lucide icons rendering for newly injected html nodes
  if (window.lucide) {
    lucide.createIcons();
  }
});
