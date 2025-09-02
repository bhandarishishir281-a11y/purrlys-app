import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";

// ---- MOCK DATA (same as yours) ----
const USER_DATA = {
  name: "Sarah",
  pets: [
    { id: "1", name: "Whiskers", profilePic: "https://placekitten.com/100/100", wellnessStreak: 4 },
    { id: "2", name: "Mittens", profilePic: "https://placekitten.com/101/101", wellnessStreak: 6 },
  ],
};

const INITIAL_LOGS = {
  "1": [
    { id: "log1", type: "Dental", date: "Yesterday", details: "Gums: Good, Breath: Fresh" },
    { id: "log2", type: "Weight", date: "2 days ago", details: "5.1 kg" },
    { id: "log3", type: "Vet Visit", date: "Last week", details: "Annual check-up. All clear." },
  ],
  "2": [
    { id: "log4", type: "Dental", date: "Today", details: "Gums: Excellent, Breath: Fresh" },
    { id: "log5", type: "Weight", date: "Yesterday", details: "4.8 kg" },
  ],
};

const BLOG_POSTS = [
  { id: "1", title: "The Secret to a Cat's Dental Health", excerpt: "Discover how probiotics can change everything..." },
  { id: "2", title: "Why Your Cat's Gut Health Matters", excerpt: "A healthy gut means a happy cat..." },
  { id: "3", title: "Understanding Feline Gingivitis", excerpt: "What to look for and how to prevent it..." },
];

// ---- UI helpers ----
const PawRow = ({ streak = 0 }) => {
  return (
    <View style={styles.pawRow}>
      {Array.from({ length: 7 }).map((_, i) => (
        <Text key={i} style={styles.paw}>{i < streak ? "🐾" : "⬜"}</Text>
      ))}
    </View>
  );
};

const Card = ({ title, children, footer }) => (
  <View style={styles.card}>
    {!!title && <Text style={styles.cardTitle}>{title}</Text>}
    <View>{children}</View>
    {!!footer && <View style={{ marginTop: 10 }}>{footer}</View>}
  </View>
);

// ---- Screens ----
const HomeScreen = ({ selectedPet, healthLogs, onAddLog }) => {
  const latestDental = useMemo(() => healthLogs.find(l => l.type === "Dental"), [healthLogs]);
  const latestWeight = useMemo(() => healthLogs.find(l => l.type === "Weight"), [healthLogs]);

  return (
    <ScrollView style={styles.screenPad}>
      <Card title={`${selectedPet.name}'s Weekly Wellness Streak`}>
        <PawRow streak={selectedPet.wellnessStreak} />
        <Text style={styles.subtleCenter}>Log today's dental check to earn another paw!</Text>
      </Card>

      <Card title="Dental Check-up">
        <Text style={styles.body}>Last logged: {latestDental?.date ?? "N/A"}</Text>
        <Text style={styles.muted}>{latestDental?.details ?? "No dental log yet."}</Text>
      </Card>

      <Card title="Weight">
        <Text style={styles.body}>Last logged: {latestWeight?.date ?? "N/A"}</Text>
        <Text style={styles.muted}>{latestWeight?.details ?? "No weight log yet."}</Text>
      </Card>

      <TouchableOpacity style={styles.primaryBtn} onPress={onAddLog}>
        <Text style={styles.primaryBtnText}>⊕  Log New Health Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const LogbookScreen = ({ healthLogs }) => (
  <ScrollView style={styles.screenPad}>
    <Text style={styles.pageTitle}>Health Logbook</Text>
    {healthLogs.length === 0 ? (
      <Text style={styles.centerMuted}>No logs found for this pet.</Text>
    ) : (
      healthLogs.map(item => (
        <View key={item.id} style={styles.logRow}>
          <Text style={styles.logType}>{item.type}</Text>
          <Text style={styles.logDetails}>{item.details}</Text>
          <Text style={styles.logDate}>{item.date}</Text>
        </View>
      ))
    )}
  </ScrollView>
);

const LearnScreen = () => (
  <ScrollView style={styles.screenPad}>
    <Text style={styles.pageTitle}>Learn About Cat Health</Text>
    {BLOG_POSTS.map(p => (
      <Card key={p.id} title={p.title} footer={<Text style={styles.link}>Read More →</Text>}>
        <Text style={styles.body}>{p.excerpt}</Text>
      </Card>
    ))}
  </ScrollView>
);

const PetsScreen = ({ pets }) => (
  <ScrollView style={styles.screenPad}>
    <Text style={styles.pageTitle}>My Pets</Text>
    <FlatList
      data={pets}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <View style={styles.petRow}>
          <Image source={{ uri: item.profilePic }} style={styles.petImg} />
          <Text style={styles.petName}>{item.name}</Text>
        </View>
      )}
      scrollEnabled={false}
    />
    <TouchableOpacity style={[styles.primaryBtn, { marginTop: 16 }]}>
      <Text style={styles.primaryBtnText}>＋  Add a New Pet</Text>
    </TouchableOpacity>
  </ScrollView>
);

const VipHubScreen = () => (
  <ScrollView style={styles.screenPad}>
    <Text style={styles.pageTitle}>VIP Hub</Text>
    <Card title="My Subscription">
      <Text style={styles.body}>Purrlys® Dental Probiotics</Text>
      <Text style={styles.muted}>Next shipment: 15th October 2025</Text>
      <TouchableOpacity style={styles.secondaryBtn}>
        <Text style={styles.secondaryBtnText}>Manage Subscription</Text>
      </TouchableOpacity>
    </Card>
    <Card title="Loyalty Rewards">
      <Text style={styles.body}>You have 250 Paw Points!</Text>
      <Text style={styles.muted}>Redeem for discounts and gifts.</Text>
    </Card>
  </ScrollView>
);

// ---- Modal for adding a log ----
const AddLogModal = ({ visible, onClose, onSave }) => {
  const [type, setType] = useState("Dental");
  const [details, setDetails] = useState("");

  const save = () => {
    if (details.trim().length === 0) return;
    onSave(type, details.trim());
    setDetails("");
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Add New Health Log</Text>

          <Text style={styles.label}>Log Type</Text>
          <View style={styles.pillRow}>
            {["Dental", "Weight", "Vet Visit"].map(t => {
              const selected = t === type;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  style={[styles.pill, selected && styles.pillSelected]}
                >
                  <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Details</Text>
          <TextInput
            placeholder="e.g., Gums look good, 5.3 kg"
            value={details}
            onChangeText={setDetails}
            style={styles.input}
          />

          <View style={styles.modalBtnRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={save} style={styles.saveBtn}>
              <Text style={styles.saveText}>Save Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ---- Main Component ----
export default function Index() {
  const [page, setPage] = useState("Home");
  const [selectedPetId, setSelectedPetId] = useState(USER_DATA.pets[0].id);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [modal, setModal] = useState(false);

  const selectedPet = useMemo(
    () => USER_DATA.pets.find(p => p.id === selectedPetId) || USER_DATA.pets[0],
    [selectedPetId]
  );
  const healthLogs = logs[selectedPetId] ?? [];

  const saveLog = (type, details) => {
    const newLog = { id: `log_${Date.now()}`, type, details, date: "Today" };
    setLogs(prev => ({ ...prev, [selectedPetId]: [newLog, ...(prev[selectedPetId] ?? [])] }));
    setModal(false);
  };

  const renderScreen = () => {
    switch (page) {
      case "Home":    return <HomeScreen selectedPet={selectedPet} healthLogs={healthLogs} onAddLog={() => setModal(true)} />;
      case "Logbook": return <LogbookScreen healthLogs={healthLogs} />;
      case "Learn":   return <LearnScreen />;
      case "Pets":    return <PetsScreen pets={USER_DATA.pets} />;
      case "VIP":     return <VipHubScreen />;
      default:        return <HomeScreen selectedPet={selectedPet} healthLogs={healthLogs} onAddLog={() => setModal(true)} />;
    }
  };

  const tabs = [
    { key: "Home", icon: "🏠" },
    { key: "Logbook", icon: "📖" },
    { key: "Learn", icon: "💡" },
    { key: "Pets", icon: "❤️" },
    { key: "VIP", icon: "⭐" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Purrlys</Text>
        <Text style={styles.headerIcon}>👤</Text>
      </View>

      {/* Pet selector */}
      <ScrollView horizontal contentContainerStyle={styles.petScroller} showsHorizontalScrollIndicator={false}>
        {USER_DATA.pets.map(p => {
          const selected = p.id === selectedPetId;
          return (
            <TouchableOpacity key={p.id} onPress={() => setSelectedPetId(p.id)} style={[styles.petChip, selected && styles.petChipSelected]}>
              <Image source={{ uri: p.profilePic }} style={styles.petChipImg} />
              <Text style={[styles.petChipText, selected && styles.petChipTextSelected]}>{p.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Content */}
      <View style={styles.content}>{renderScreen()}</View>

      <AddLogModal visible={modal} onClose={() => setModal(false)} onSave={saveLog} />

      {/* Bottom nav */}
      <View style={styles.navBar}>
        {tabs.map(t => {
          const active = t.key === page;
          return (
            <TouchableOpacity key={t.key} onPress={() => setPage(t.key)} style={styles.navItem}>
              <Text style={styles.navIcon}>{t.icon}</Text>
              <Text style={[styles.navText, active && styles.navTextActive]}>{t.key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "700" },
  headerIcon: { fontSize: 22 },
  petScroller: { paddingHorizontal: 8, paddingBottom: 8 },
  petChip: { marginHorizontal: 6, padding: 8, borderRadius: 12, alignItems: "center" },
  petChipSelected: { backgroundColor: "#ffe4e1" },
  petChipImg: { width: 54, height: 54, borderRadius: 27, marginBottom: 6 },
  petChipText: { fontSize: 13, color: "#555" },
  petChipTextSelected: { color: "#ff6347", fontWeight: "700" },

  content: { flex: 1 },

  screenPad: { paddingHorizontal: 16, paddingTop: 10 },

  pageTitle: { fontSize: 24, fontWeight: "700", color: "#333", marginBottom: 12 },
  subtleCenter: { textAlign: "center", color: "#666", marginTop: 8 },

  card: { backgroundColor: "#fff", padding: 16, borderRadius: 16, marginBottom: 14, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 6 },
  body: { fontSize: 16, color: "#555" },
  muted: { fontSize: 14, color: "#777", marginTop: 4 },

  pawRow: { flexDirection: "row", justifyContent: "center", marginTop: 4 },
  paw: { fontSize: 22, marginRight: 6 },

  primaryBtn: { backgroundColor: "#ff6347", paddingVertical: 14, borderRadius: 28, alignItems: "center" },
  primaryBtnText: { color: "white", fontWeight: "700", fontSize: 16 },

  secondaryBtn: { marginTop: 12, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: "#ff6347", alignItems: "center" },
  secondaryBtnText: { color: "#ff6347", fontWeight: "700" },

  centerMuted: { textAlign: "center", color: "#888", marginTop: 16 },

  logRow: { backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: "#ff6347" },
  logType: { fontSize: 16, fontWeight: "700", color: "#333" },
  logDetails: { fontSize: 14, color: "#666", marginVertical: 2 },
  logDate: { fontSize: 12, color: "#aaa", textAlign: "right" },

  petRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10 },
  petImg: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  petName: { fontSize: 18, fontWeight: "700" },

  navBar: { flexDirection: "row", justifyContent: "space-around", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#e0e0e0", paddingVertical: 8, backgroundColor: "#fff" },
  navItem: { alignItems: "center" },
  navIcon: { fontSize: 22 },
  navText: { fontSize: 11, color: "#888", marginTop: 2 },
  navTextActive: { color: "#ff6347", fontWeight: "700" },

  // modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center", padding: 16 },
  modalCard: { width: "100%", maxWidth: 420, backgroundColor: "#fff", borderRadius: 18, padding: 16 },
  modalTitle: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  label: { fontWeight: "600", marginTop: 8, marginBottom: 6 },
  pillRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 8 },
  pill: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: "#ccc" },
  pillSelected: { backgroundColor: "#ffe4e1", borderColor: "#ff6347" },
  pillText: { color: "#555" },
  pillTextSelected: { color: "#ff6347", fontWeight: "700" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10 },
  modalBtnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, borderWidth: 1, borderColor: "#ff6347" },
  cancelText: { color: "#ff6347", fontWeight: "700" },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, backgroundColor: "#007bff" },
  saveText: { color: "#fff", fontWeight: "700" },
});
