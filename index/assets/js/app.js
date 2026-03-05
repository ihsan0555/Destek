// ihsancelik.com IT Service Portal
// Frontend hosted on GitHub Pages, data on Firebase (Auth + Firestore)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  orderBy,
  serverTimestamp,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const LS_KEYS = {
  LANGUAGE: "ihsan_portal_lang",
};

// TODO: Fill this with your own Firebase config from the Firebase console.
// Firebase Console → Project settings → General → Your apps → SDK setup and configuration.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const i18n = {
    en: {
      login_title: "ihsancelik.com IT Service Portal",
      login_subtitle: "Secure access to your managed IT services",
      login_email_label: "Email",
      login_password_label: "Password",
      login_remember: "Remember me",
      login_forgot: "Forgot password?",
      login_button: "Login",
      login_helper:
        "Demo: use any email and password to continue. This is not a production login.",

      nav_dashboard: "Dashboard",
      nav_tickets: "My Tickets",
      nav_create_ticket: "Create Ticket",
      nav_devices: "My Devices",
      nav_kb: "Knowledge Base",
      nav_profile: "Profile",
      nav_logout: "Logout",

      dashboard_title: "Welcome back to ihsancelik.com",
      widget_open_tickets: "Open Tickets",
      widget_open_tickets_sub: "Active tickets currently handled by our NOC",
      widget_closed_tickets: "Closed Tickets",
      widget_closed_tickets_sub:
        "Tickets resolved by ihsancelik.com in the last 30 days",
      widget_devices: "Devices",
      widget_devices_sub: "Endpoints managed under your contract",
      widget_recent_activity: "Recent Activity",

      tickets_title: "My Tickets",
      tickets_create_btn: "Create Ticket",
      tickets_list_title: "All Tickets",
      filter_all: "All",
      filter_open: "Open",
      filter_in_progress: "In Progress",
      filter_waiting: "Waiting Customer",
      filter_resolved: "Resolved",
      tickets_table_id: "ID",
      tickets_table_title: "Title",
      tickets_table_device: "Device",
      tickets_table_priority: "Priority",
      tickets_table_status: "Status",
      tickets_table_updated: "Updated",
      tickets_create_title: "Create New Ticket",

      ticket_field_title: "Title",
      ticket_field_description: "Description",
      ticket_field_priority: "Priority",
      ticket_field_device: "Device",
      ticket_field_attachments: "Attachments",
      ticket_field_attachments_helper:
        "Attachments are simulated in this demo and are not actually uploaded.",

      priority_low: "Low",
      priority_medium: "Medium",
      priority_high: "High",
      priority_critical: "Critical",

      status_open: "Open",
      status_in_progress: "In Progress",
      status_waiting: "Waiting Customer",
      status_resolved: "Resolved",

      ticket_create_submit: "Submit Ticket",

      ticket_detail_title: "Ticket Detail",
      ticket_detail_status_label: "Status",
      ticket_detail_info_title: "Ticket Info",
      ticket_detail_created: "Created",
      ticket_detail_updated: "Last Updated",
      ticket_reply_submit: "Send Reply",

      devices_title: "My Devices",
      devices_table_title: "Device Inventory",
      devices_detail_title: "Device Details",
      devices_detail_placeholder:
        "Select a device from the table to view details.",
      device_table_name: "Device",
      device_table_brand: "Brand",
      device_table_model: "Model",
      device_table_serial: "Serial",
      device_table_ip: "IP Address",
      device_table_warranty: "Warranty",

      kb_title: "Knowledge Base",
      kb_getting_started_title: "Getting Started with ihsancelik.com",
      kb_remote_support_title: "Remote Support",
      kb_security_title: "Security & Best Practices",

      kb_how_to_open_ticket_title: "How to open a support ticket?",
      kb_how_to_open_ticket_body:
        'Go to "My Tickets" → "Create Ticket", choose the affected device, set the priority and describe the problem in detail. Our ihsancelik.com NOC team will be notified instantly.',

      kb_what_is_priority_title: "How should I choose priority?",
      kb_what_is_priority_body:
        "Use Critical for full service outages, High for severe degradation, Medium for single user impact and Low for informational or minor changes.",

      kb_remote_access_title: "Remote access by ihsancelik.com",
      kb_remote_access_body:
        "With your approval, our engineers connect securely over encrypted channels to troubleshoot issues on your endpoints and servers.",

      kb_sla_title: "SLA & response times",
      kb_sla_body:
        "Response times depend on the selected priority and your managed services contract with ihsancelik.com. Critical tickets are handled first.",

      kb_password_title: "Password & MFA",
      kb_password_body:
        "Always use strong passwords and enable MFA where possible. Do not share your portal credentials. Contact ihsancelik.com if you suspect any breach.",
    },
    tr: {
      login_title: "ihsancelik.com BT Hizmet Portalı",
      login_subtitle: "Yönetilen IT hizmetlerinize güvenli erişim",
      login_email_label: "E-posta",
      login_password_label: "Şifre",
      login_remember: "Beni hatırla",
      login_forgot: "Şifremi unuttum",
      login_button: "Giriş Yap",
      login_helper:
        "Demo: Herhangi bir e-posta ve şifre ile devam edebilirsiniz. Gerçek bir giriş değildir.",

      nav_dashboard: "Panel",
      nav_tickets: "Taleplerim",
      nav_create_ticket: "Talep Oluştur",
      nav_devices: "Cihazlarım",
      nav_kb: "Bilgi Bankası",
      nav_profile: "Profil",
      nav_logout: "Çıkış Yap",

      dashboard_title: "ihsancelik.com paneline hoş geldiniz",
      widget_open_tickets: "Açık Talepler",
      widget_open_tickets_sub:
        "Şu anda NOC ekibimizde açık olan çağrılarınız",
      widget_closed_tickets: "Kapanan Talepler",
      widget_closed_tickets_sub:
        "Son 30 günde ihsancelik.com tarafından kapatılan talepler",
      widget_devices: "Cihazlar",
      widget_devices_sub: "Sözleşmeniz kapsamında izlenen uç noktalar",
      widget_recent_activity: "Son Aktiviteler",

      tickets_title: "Taleplerim",
      tickets_create_btn: "Talep Oluştur",
      tickets_list_title: "Tüm Talepler",
      filter_all: "Tümü",
      filter_open: "Açık",
      filter_in_progress: "Devam Ediyor",
      filter_waiting: "Müşteri Yanıtı Bekliyor",
      filter_resolved: "Çözüldü",
      tickets_table_id: "ID",
      tickets_table_title: "Başlık",
      tickets_table_device: "Cihaz",
      tickets_table_priority: "Öncelik",
      tickets_table_status: "Durum",
      tickets_table_updated: "Güncellendi",
      tickets_create_title: "Yeni Talep Oluştur",

      ticket_field_title: "Başlık",
      ticket_field_description: "Açıklama",
      ticket_field_priority: "Öncelik",
      ticket_field_device: "Cihaz",
      ticket_field_attachments: "Ekler",
      ticket_field_attachments_helper:
        "Ekler bu demoda sadece simüle edilir, sunucuya yüklenmez.",

      priority_low: "Düşük",
      priority_medium: "Orta",
      priority_high: "Yüksek",
      priority_critical: "Kritik",

      status_open: "Açık",
      status_in_progress: "Devam Ediyor",
      status_waiting: "Müşteri Yanıtı Bekliyor",
      status_resolved: "Çözüldü",

      ticket_create_submit: "Talebi Gönder",

      ticket_detail_title: "Talep Detayı",
      ticket_detail_status_label: "Durum",
      ticket_detail_info_title: "Talep Bilgileri",
      ticket_detail_created: "Oluşturma",
      ticket_detail_updated: "Son Güncelleme",
      ticket_reply_submit: "Yanıt Gönder",

      devices_title: "Cihazlarım",
      devices_table_title: "Cihaz Envanteri",
      devices_detail_title: "Cihaz Detayları",
      devices_detail_placeholder:
        "Tablodan bir cihaz seçerek ayrıntıları görüntüleyin.",
      device_table_name: "Cihaz",
      device_table_brand: "Marka",
      device_table_model: "Model",
      device_table_serial: "Seri No",
      device_table_ip: "IP Adresi",
      device_table_warranty: "Garanti",

      kb_title: "Bilgi Bankası",
      kb_getting_started_title: "ihsancelik.com ile Başlarken",
      kb_remote_support_title: "Uzak Destek",
      kb_security_title: "Güvenlik ve En İyi Uygulamalar",

      kb_how_to_open_ticket_title: "Destek talebi nasıl açılır?",
      kb_how_to_open_ticket_body:
        '"Taleplerim" → "Talep Oluştur" adımlarını izleyin, etkilenen cihazı seçin, önceliği belirleyin ve problemi detaylıca açıklayın. ihsancelik.com NOC ekibi anında bilgilendirilir.',

      kb_what_is_priority_title: "Öncelik nasıl seçilmeli?",
      kb_what_is_priority_body:
        "Kritik: Tam servis kesintileri, Yüksek: Ciddi performans düşüşü, Orta: Tek kullanıcı etkilenmesi, Düşük: Bilgilendirme veya küçük değişiklik talepleri için kullanılmalıdır.",

      kb_remote_access_title: "ihsancelik.com tarafından uzak erişim",
      kb_remote_access_body:
        "Onayınız ile mühendislerimiz şifreli bağlantılar üzerinden cihaz ve sunucularınıza güvenli şekilde bağlanıp sorunları giderir.",

      kb_sla_title: "SLA ve yanıt süreleri",
      kb_sla_body:
        "Yanıt süreleri, seçtiğiniz öncelik seviyesine ve ihsancelik.com ile olan yönetilen hizmet sözleşmenize göre belirlenir. Kritik talepler önceliklidir.",

      kb_password_title: "Parola ve MFA",
      kb_password_body:
        "Her zaman güçlü parolalar kullanın ve mümkünse MFA aktif edin. Portal giriş bilgilerinizi paylaşmayın. Güvenlik ihlali şüpheniz varsa ihsancelik.com ile iletişime geçin.",
    },
  };

function getCurrentLang() {
  const saved = localStorage.getItem(LS_KEYS.LANGUAGE);
  return saved === "tr" ? "tr" : "en";
}

function setCurrentLang(lang) {
  const value = lang === "tr" ? "tr" : "en";
  localStorage.setItem(LS_KEYS.LANGUAGE, value);
}

function applyI18n() {
  const lang = getCurrentLang();
  const dict = i18n[lang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
}

function initLanguageToggle() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      setCurrentLang(lang);
      applyI18n();
    });
  });
  applyI18n();
}

function initSidebarToggle() {
  const toggle = document.getElementById("sidebarToggle");
  const sidebar = document.querySelector(".sidebar");
  if (!toggle || !sidebar) return;
  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "Open":
      return "status-badge status-open";
    case "In Progress":
      return "status-badge status-in-progress";
    case "Waiting Customer":
      return "status-badge status-waiting";
    case "Resolved":
      return "status-badge status-resolved";
    default:
      return "status-badge";
  }
}

function formatDateShort(iso) {
  if (!iso) return "-";
  const d = iso instanceof Date ? iso : new Date(iso);
  return d.toLocaleString();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function ensureSeedDataForUser(user) {
  // Seed devices if none
  const devicesCol = collection(db, "devices");
  const devicesSnap = await getDocs(
    query(devicesCol, where("userId", "==", user.uid))
  );
  if (devicesSnap.empty) {
    const defaults = [
      {
        name: "Finance-Laptop-01",
        brand: "Dell",
        model: "Latitude 7420",
        serial: "DL7420-FIN-01",
        ip: "10.0.20.11",
        warranty: "2027-01-31",
      },
      {
        name: "Core-Server-AD01",
        brand: "VMware",
        model: "vSphere VM",
        serial: "VM-AD-01",
        ip: "10.0.0.10",
        warranty: "2028-06-30",
      },
      {
        name: "Firewall-Edge-01",
        brand: "Fortinet",
        model: "FortiGate 100F",
        serial: "FG-100F-EDGE-01",
        ip: "192.168.0.1",
        warranty: "2029-03-15",
      },
    ];
    await Promise.all(
      defaults.map((d) =>
        addDoc(devicesCol, {
          userId: user.uid,
          ...d,
        })
      )
    );
  }

  // Seed tickets if none
  const ticketsCol = collection(db, "tickets");
  const ticketsSnap = await getDocs(
    query(ticketsCol, where("userId", "==", user.uid))
  );
  if (ticketsSnap.empty) {
    const now = serverTimestamp();
    await addDoc(ticketsCol, {
      userId: user.uid,
      title: "VPN connection dropping for remote users",
      description:
        "Remote employees lose VPN connection every 15–20 minutes during work hours.",
      priority: "High",
      deviceName: "Firewall-Edge-01",
      status: "In Progress",
      createdAt: now,
      updatedAt: now,
      conversation: [],
    });
  }
}

async function fetchDevices(user) {
  const snap = await getDocs(
    query(
      collection(db, "devices"),
      where("userId", "==", user.uid),
      orderBy("name")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function fetchTickets(user) {
  const snap = await getDocs(
    query(
      collection(db, "tickets"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function createTicket(user, data) {
  const now = serverTimestamp();
  const ref = await addDoc(collection(db, "tickets"), {
    userId: user.uid,
    title: data.title,
    description: data.description,
    priority: data.priority,
    deviceName: data.deviceName || null,
    status: "Open",
    createdAt: now,
    updatedAt: now,
    conversation: [],
  });
  return ref.id;
}

async function updateTicketStatus(ticketId, status) {
  await updateDoc(doc(db, "tickets", ticketId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

async function appendTicketReply(ticketId, author, text) {
  const ticketRef = doc(db, "tickets", ticketId);
  const snap = await getDocs(
    query(collection(db, "tickets"), where("__name__", "==", ticketId))
  );
  if (snap.empty) return;
  const existing = snap.docs[0].data();
  const conversation = existing.conversation || [];
  conversation.push({
    author,
    text,
    createdAt: new Date().toISOString(),
  });
  await updateDoc(ticketRef, {
    conversation,
    updatedAt: serverTimestamp(),
  });
}

async function initDashboardPage(user) {
  const page = document.body.getAttribute("data-page");
  if (page !== "dashboard") return;

  await ensureSeedDataForUser(user);
  const [tickets, devices] = await Promise.all([
    fetchTickets(user),
    fetchDevices(user),
  ]);

  const openCount = tickets.filter(
    (t) =>
      t.status === "Open" ||
      t.status === "In Progress" ||
      t.status === "Waiting Customer"
  ).length;
  const closedCount = tickets.filter((t) => t.status === "Resolved").length;

  const openEl = document.getElementById("openTicketsCount");
  const closedEl = document.getElementById("closedTicketsCount");
  const devicesEl = document.getElementById("devicesCount");

  if (openEl) openEl.textContent = openCount;
  if (closedEl) closedEl.textContent = closedCount;
  if (devicesEl) devicesEl.textContent = devices.length;

  const activityList = document.getElementById("recentActivityList");
  if (activityList) {
    activityList.innerHTML = "";
    tickets.slice(0, 5).forEach((t) => {
      const li = document.createElement("li");
      const badgeClass = getStatusBadgeClass(t.status);
      li.innerHTML = `
        <div>
          <strong>${escapeHtml(t.title)}</strong>
          <div class="activity-meta">#${t.id} · ${t.priority}</div>
        </div>
        <span class="${badgeClass}">${t.status}</span>
      `;
      activityList.appendChild(li);
    });
  }
}

async function initTicketsPage(user) {
  const page = document.body.getAttribute("data-page");
  if (page !== "tickets") return;

  await ensureSeedDataForUser(user);
  let tickets = await fetchTickets(user);
  const devices = await fetchDevices(user);

  const tbody = document.getElementById("ticketsTableBody");
  const deviceSelect = document.getElementById("ticketDevice");
  const form = document.getElementById("ticketForm");

  if (deviceSelect) {
    deviceSelect.innerHTML = `<option value="">-</option>`;
    devices.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.name;
      opt.textContent = `${d.name}`;
      deviceSelect.appendChild(opt);
    });
  }

  function renderTable(filterStatus) {
    if (!tbody) return;
    tbody.innerHTML = "";
    tickets.forEach((t) => {
      if (filterStatus && filterStatus !== "all" && t.status !== filterStatus)
        return;
      const badgeClass = getStatusBadgeClass(t.status);
      tbody.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
          <td><a href="ticket-detail.html?id=${t.id}">${t.id}</a></td>
          <td>${escapeHtml(t.title)}</td>
          <td>${t.deviceName ? escapeHtml(t.deviceName) : "-"}</td>
          <td>${t.priority}</td>
          <td><span class="${badgeClass}">${t.status}</span></td>
          <td>${formatDateShort(t.updatedAt?.toDate?.() || t.updatedAt)}</td>
        </tr>
      `
      );
    });
  }

  document.querySelectorAll(".chip[data-status-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const val = chip.getAttribute("data-status-filter");
      document
        .querySelectorAll(".chip")
        .forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderTable(val === "all" ? "" : val);
    });
  });

  renderTable("");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("ticketTitle").value.trim();
      const desc = document.getElementById("ticketDescription").value.trim();
      const priority = document.getElementById("ticketPriority").value;
      const deviceName = document.getElementById("ticketDevice").value || null;

      if (!title || !desc) {
        alert(
          getCurrentLang() === "tr"
            ? "Lütfen başlık ve açıklama alanlarını doldurun."
            : "Please fill in title and description."
        );
        return;
      }

      await createTicket(user, {
        title,
        description: desc,
        priority,
        deviceName,
      });
      tickets = await fetchTickets(user);
      renderTable("");
      form.reset();

      alert(
        getCurrentLang() === "tr"
          ? "Talebiniz başarıyla oluşturuldu."
          : "Your ticket has been created successfully."
      );
    });
  }
}

function getTicketIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function initTicketDetailPage(user) {
  const page = document.body.getAttribute("data-page");
  if (page !== "ticket-detail") return;

  const id = getTicketIdFromUrl();
  if (!id) {
    window.location.href = "tickets.html";
    return;
  }

  const snap = await getDocs(
    query(collection(db, "tickets"), where("__name__", "==", id))
  );
  if (snap.empty) {
    alert(
      getCurrentLang() === "tr" ? "Talep bulunamadı." : "Ticket not found."
    );
    window.location.href = "tickets.html";
    return;
  }
  const ticket = { id, ...snap.docs[0].data() };

  const titleEl = document.getElementById("ticketDetailTitle");
  const metaEl = document.getElementById("ticketDetailMeta");
  const priorityEl = document.getElementById("ticketInfoPriority");
  const deviceEl = document.getElementById("ticketInfoDevice");
  const createdEl = document.getElementById("ticketInfoCreated");
  const updatedEl = document.getElementById("ticketInfoUpdated");
  const conversationEl = document.getElementById("ticketConversation");
  const statusSelect = document.getElementById("ticketStatusSelect");

  if (titleEl) titleEl.textContent = `${ticket.id} · ${ticket.title}`;
  if (metaEl)
    metaEl.textContent = `${ticket.priority} · ${formatDateShort(
      ticket.createdAt?.toDate?.() || ticket.createdAt
    )}`;
  if (priorityEl) priorityEl.textContent = ticket.priority;
  if (deviceEl) deviceEl.textContent = ticket.deviceName || "-";
  if (createdEl)
    createdEl.textContent = formatDateShort(
      ticket.createdAt?.toDate?.() || ticket.createdAt
    );
  if (updatedEl)
    updatedEl.textContent = formatDateShort(
      ticket.updatedAt?.toDate?.() || ticket.updatedAt
    );

  if (statusSelect) {
    statusSelect.value = ticket.status;
    statusSelect.addEventListener("change", async () => {
      await updateTicketStatus(ticket.id, statusSelect.value);
    });
  }

  function renderConversation() {
    if (!conversationEl) return;
    conversationEl.innerHTML = "";
    (ticket.conversation || []).forEach((msg) => {
      const div = document.createElement("div");
      div.className = "message";
      div.innerHTML = `
        <div class="message-header">
          <span>${msg.author}</span>
          <span>${formatDateShort(msg.createdAt)}</span>
        </div>
        <div class="message-body">${escapeHtml(msg.text)}</div>
      `;
      conversationEl.appendChild(div);
    });
    conversationEl.scrollTop = conversationEl.scrollHeight;
  }

  renderConversation();

  const replyForm = document.getElementById("ticketReplyForm");
  const replyText = document.getElementById("ticketReplyText");

  if (replyForm && replyText) {
    replyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = replyText.value.trim();
      if (!text) return;
      await appendTicketReply(ticket.id, user.email, text);
      // reload conversation
      const snap2 = await getDocs(
        query(collection(db, "tickets"), where("__name__", "==", id))
      );
      if (!snap2.empty) {
        const t2 = { id, ...snap2.docs[0].data() };
        ticket.conversation = t2.conversation || [];
        ticket.updatedAt = t2.updatedAt;
        renderConversation();
      }
      replyForm.reset();
    });
  }
}

async function initDevicesPage(user) {
  const page = document.body.getAttribute("data-page");
  if (page !== "devices") return;

  await ensureSeedDataForUser(user);
  const devices = await fetchDevices(user);
  const tbody = document.getElementById("devicesTableBody");
  const detailCard = document.getElementById("deviceDetailCard");

  if (!tbody || !detailCard) return;

  function renderDetail(device) {
    if (!device) {
      detailCard.innerHTML = `<p class="muted">${
        getCurrentLang() === "tr"
          ? "Tablodan bir cihaz seçerek ayrıntıları görüntüleyin."
          : "Select a device from the table to view details."
      }</p>`;
      return;
    }
    detailCard.innerHTML = `
      <div>
        <span>${getCurrentLang() === "tr" ? "Cihaz Adı" : "Device Name"}</span>
        <strong>${escapeHtml(device.name)}</strong>
      </div>
      <div>
        <span>${getCurrentLang() === "tr" ? "Marka" : "Brand"}</span>
        <strong>${escapeHtml(device.brand)}</strong>
      </div>
      <div>
        <span>${getCurrentLang() === "tr" ? "Model" : "Model"}</span>
        <strong>${escapeHtml(device.model)}</strong>
      </div>
      <div>
        <span>${getCurrentLang() === "tr" ? "Seri No" : "Serial"}</span>
        <strong>${escapeHtml(device.serial)}</strong>
      </div>
      <div>
        <span>${getCurrentLang() === "tr" ? "IP Adresi" : "IP Address"}</span>
        <strong>${escapeHtml(device.ip)}</strong>
      </div>
      <div>
        <span>${
          getCurrentLang() === "tr" ? "Garanti Bitiş" : "Warranty End"
        }</span>
        <strong>${escapeHtml(device.warranty)}</strong>
      </div>
    `;
  }

  tbody.innerHTML = "";
  devices.forEach((d) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(d.name)}</td>
      <td>${escapeHtml(d.brand)}</td>
      <td>${escapeHtml(d.model)}</td>
      <td>${escapeHtml(d.serial)}</td>
      <td>${escapeHtml(d.ip)}</td>
      <td>${escapeHtml(d.warranty)}</td>
    `;
    tr.addEventListener("click", () => renderDetail(d));
    tbody.appendChild(tr);
  });

  if (devices[0]) renderDetail(devices[0]);
}

function initLoginPage() {
  const page = document.body.getAttribute("data-page");
  if (page !== "login") return;

  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password || password.length < 6) {
      alert(
        getCurrentLang() === "tr"
          ? "Lütfen geçerli bir e-posta ve en az 6 karakterlik bir şifre girin."
          : "Please enter a valid email and a password with at least 6 characters."
      );
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        // Auto-register for demo purposes
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        alert(err.message);
        return;
      }
    }
    window.location.href = "dashboard.html";
  });
}

function initLogout() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

function initAuthRouting() {
  const page = document.body.getAttribute("data-page");

  onAuthStateChanged(auth, async (user) => {
    if (page === "login") {
      if (user) {
        window.location.href = "dashboard.html";
        return;
      }
      initLoginPage();
      initLanguageToggle();
      return;
    }

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const emailLabel = document.getElementById("currentUserEmail");
    if (emailLabel) emailLabel.textContent = user.email;

    initLanguageToggle();
    initSidebarToggle();
    initLogout();

    await ensureSeedDataForUser(user);
    await initDashboardPage(user);
    await initTicketsPage(user);
    await initTicketDetailPage(user);
    await initDevicesPage(user);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAuthRouting();
});

