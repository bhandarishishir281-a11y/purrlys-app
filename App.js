import React, { useState } from 'react';

// --- MOCK DATA ---
// In a real app, this data would come from a server or a database.
const USER_DATA = {
  name: 'Sarah',
  pets: [
    { id: '1', name: 'Whiskers', profilePic: 'https://placekitten.com/100/100', wellnessStreak: 4 },
    { id: '2', name: 'Mittens', profilePic: 'https://placekitten.com/101/101', wellnessStreak: 6 },
  ],
};

let PET_HEALTH_LOGS = {
  '1': [ // Whiskers' logs
    { id: 'log1', type: 'Dental', date: 'Yesterday', details: 'Gums: Good, Breath: Fresh' },
    { id: 'log2', type: 'Weight', date: '2 days ago', details: '5.1 kg' },
    { id: 'log3', type: 'Vet Visit', date: 'Last week', details: 'Annual check-up. All clear.' },
  ],
  '2': [ // Mittens' logs
    { id: 'log4', type: 'Dental', date: 'Today', details: 'Gums: Excellent, Breath: Fresh' },
    { id: 'log5', type: 'Weight', date: 'Yesterday', details: '4.8 kg' },
  ],
};

const BLOG_POSTS = [
    {id: '1', title: 'The Secret to a Cat\'s Dental Health', excerpt: 'Discover how probiotics can change everything...'},
    {id: '2', title: 'Why Your Cat\'s Gut Health Matters', excerpt: 'A healthy gut means a happy cat...'},
    {id: '3', title: 'Understanding Feline Gingivitis', excerpt: 'What to look for and how to prevent it...'},
];

// --- COMPONENTS FOR EACH SCREEN (Web-compatible) ---

const HomeScreen = ({ selectedPet, healthLogs, onAddLogPress }) => {
  const latestDentalLog = healthLogs.find(log => log.type === 'Dental');
  const latestWeightLog = healthLogs.find(log => log.type === 'Weight');

  const renderWellnessPaws = (streak) => {
    let paws = [];
    for (let i = 0; i < 7; i++) {
      paws.push(<span key={i} style={styles.paw}>{i < streak ? '🐾' : '⬜'}</span>);
    }
    return paws;
  };

  return (
    <div style={styles.dashboard}>
      <div style={styles.card}>
        <p style={styles.cardTitle}>{selectedPet.name}'s Weekly Wellness Streak</p>
        <div style={styles.pawsContainer}>{renderWellnessPaws(selectedPet.wellnessStreak)}</div>
        <p style={styles.cardSubtitle}>Log today's dental check to earn another paw!</p>
      </div>

      <div style={styles.card}>
        <p style={styles.cardTitle}>Dental Check-up</p>
        <p style={styles.cardContent}>Last logged: {latestDentalLog?.date || 'N/A'}</p>
        <p style={styles.cardDetail}>{latestDentalLog?.details || 'No dental log yet.'}</p>
      </div>

      <div style={styles.card}>
        <p style={styles.cardTitle}>Weight</p>
        <p style={styles.cardContent}>Last logged: {latestWeightLog?.date || 'N/A'}</p>
        <p style={styles.cardDetail}>{latestWeightLog?.details || 'No weight log yet.'}</p>
      </div>

      <button style={styles.primaryButton} onClick={onAddLogPress}>
        <span style={{color: 'white', fontSize: 20, marginRight: 10}}>⊕</span>
        <span style={styles.primaryButtonText}>Log New Health Entry</span>
      </button>
    </div>
  );
};

const LogbookScreen = ({ healthLogs }) => (
  <div style={styles.pageContainer}>
    <p style={styles.pageTitle}>Health Logbook</p>
    {healthLogs.length > 0 ? healthLogs.map(item => (
      <div key={item.id} style={styles.logItem}>
        <p style={styles.logItemType}>{item.type}</p>
        <p style={styles.logItemDetails}>{item.details}</p>
        <p style={styles.logItemDate}>{item.date}</p>
      </div>
    )) : <p style={styles.emptyText}>No logs found for this pet.</p>}
  </div>
);

const LearnScreen = () => (
    <div style={styles.pageContainer}>
      <p style={styles.pageTitle}>Learn About Cat Health</p>
       {BLOG_POSTS.map(item => (
          <div key={item.id} style={styles.card}>
              <p style={styles.cardTitle}>{item.title}</p>
              <p style={styles.cardContent}>{item.excerpt}</p>
              <button style={styles.linkButton}>
                  <span style={styles.readMore}>Read More →</span>
              </button>
          </div>
        ))}
    </div>
);

const PetsScreen = ({ pets }) => (
    <div style={styles.pageContainer}>
      <p style={styles.pageTitle}>My Pets</p>
        {pets.map(pet => (
            <div key={pet.id} style={styles.petListItem}>
                <img src={pet.profilePic} style={styles.petListImage} alt={pet.name} />
                <p style={styles.petListName}>{pet.name}</p>
            </div>
        ))}
         <button style={{...styles.primaryButton, marginTop: 20}}>
            <span style={{color: 'white', fontSize: 20}}>+</span>
            <span style={styles.primaryButtonText}>Add a New Pet</span>
        </button>
    </div>
);

const VipHubScreen = () => (
    <div style={styles.pageContainer}>
        <p style={styles.pageTitle}>VIP Hub</p>
        <div style={styles.card}>
            <p style={styles.cardTitle}>My Subscription</p>
            <p style={styles.cardContent}>Purrlys® Dental Probiotics</p>
            <p style={styles.cardDetail}>Next shipment: 15th October 2025</p>
            <button style={styles.secondaryButton}>
                <span style={styles.secondaryButtonText}>Manage Subscription</span>
            </button>
        </div>
        <div style={styles.card}>
            <p style={styles.cardTitle}>Loyalty Rewards</p>
            <p style={styles.cardContent}>You have 250 Paw Points!</p>
            <p style={styles.cardDetail}>Redeem for discounts and gifts.</p>
        </div>
    </div>
);

const HealthLogModal = ({ visible, onClose, onSave }) => {
    const [logType, setLogType] = useState('Dental');
    const [details, setDetails] = useState('');

    const handleSave = () => {
        if (details.trim()) {
            onSave(logType, details);
            setDetails('');
        }
    };
    
    if (!visible) return null;
    
    return (
        <div style={styles.modalContainer}>
            <div style={styles.modalContent}>
                <p style={styles.modalTitle}>Add New Health Log</p>
                <p>Log Type</p>
                <div style={styles.pickerContainer}>
                    {['Dental', 'Weight', 'Vet Visit'].map(type => (
                         <button key={type} onClick={() => setLogType(type)} style={{...styles.pickerOption, ...(logType === type ? styles.pickerOptionSelected : {})}}>
                             <span style={logType === type ? styles.pickerTextSelected : styles.pickerText}>{type}</span>
                        </button>
                    ))}
                </div>

                <p>Details</p>
                <input
                    style={styles.input}
                    placeholder="e.g., Gums look good, 5.3 kg"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                />
                <div style={styles.modalButtons}>
                    <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
                    <button onClick={handleSave} style={styles.saveButton}>Save Log</button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [selectedPetId, setSelectedPetId] = useState(USER_DATA.pets[0].id);
  const [modalVisible, setModalVisible] = useState(false);
  const [healthLogs, setHealthLogs] = useState(PET_HEALTH_LOGS);

  const selectedPet = USER_DATA.pets.find(p => p.id === selectedPetId);

  const handleSaveLog = (type, details) => {
    const newLog = {
        id: `log${Math.random()}`,
        type,
        details,
        date: 'Today'
    };
    const updatedLogs = {
        ...healthLogs,
        [selectedPetId]: [newLog, ...healthLogs[selectedPetId]]
    };
    setHealthLogs(updatedLogs);
    setModalVisible(false);
  };
  
  // Simple router
  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <HomeScreen selectedPet={selectedPet} healthLogs={healthLogs[selectedPetId]} onAddLogPress={() => setModalVisible(true)} />;
      case 'Logbook':
        return <LogbookScreen healthLogs={healthLogs[selectedPetId]} />;
      case 'Learn':
        return <LearnScreen />;
      case 'Pets':
        return <PetsScreen pets={USER_DATA.pets}/>;
      case 'VIP Hub':
        return <VipHubScreen />;
      default:
        return <HomeScreen selectedPet={selectedPet} healthLogs={healthLogs[selectedPetId]} onAddLogPress={() => setModalVisible(true)} />;
    }
  };

  const getNavIcon = (name) => {
    switch (name) {
        case 'Home': return '🏠';
        case 'Logbook': return '📖';
        case 'Learn': return '💡';
        case 'Pets': return '❤️';
        case 'VIP Hub': return '⭐';
        default: return '';
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <p style={styles.headerText}>Purrlys</p>
        <span style={{fontSize: 24}}>👤</span>
      </div>

      {/* Pet Selector */}
      <div>
        <div style={styles.petSelector}>
          {USER_DATA.pets.map(pet => (
            <button key={pet.id} onClick={() => setSelectedPetId(pet.id)} style={styles.petCardButton}>
              <div style={{...styles.petCard, ...(selectedPetId === pet.id ? styles.petCardSelected : {})}}>
                <img src={pet.profilePic} style={styles.petImage} alt={pet.name} />
                <span style={{...styles.petName, ...(selectedPetId === pet.id ? styles.petNameSelected : {})}}>{pet.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Renders the current page */}
      <div style={styles.contentArea}>
        {renderPage()}
      </div>
      
      <HealthLogModal visible={modalVisible} onClose={() => setModalVisible(false)} onSave={handleSaveLog} />

      {/* Bottom Navigation Bar */}
      <div style={styles.navBar}>
        {['Home', 'Logbook', 'Learn', 'Pets', 'VIP Hub'].map(name => (
            <button key={name} style={styles.navItem} onClick={() => setCurrentPage(name)}>
                <span style={{fontSize: 24}}>{getNavIcon(name)}</span>
                <span style={{...styles.navText, ...(currentPage === name ? styles.navTextSelected : {})}}>{name}</span>
            </button>
        ))}
      </div>
    </div>
  );
}

// --- STYLESHEET (Using JS objects for styling) ---
const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f8f8f8', fontFamily: 'sans-serif' },
  header: { padding: '10px 20px 5px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { fontSize: 24, fontWeight: 'bold' },
  petSelector: { display: 'flex', padding: '0 10px 10px 10px', overflowX: 'auto' },
  petCardButton: { background: 'none', border: 'none', padding: 0, cursor: 'pointer' },
  petCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 10px', padding: 10, borderRadius: 10 },
  petCardSelected: { backgroundColor: '#ffe4e1' },
  petImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 5, borderWidth: 2, borderColor: 'transparent', objectFit: 'cover' },
  petName: { fontSize: 14, color: '#555' },
  petNameSelected: { color: '#ff6347', fontWeight: 'bold' },
  contentArea: { flex: 1, overflowY: 'auto' },
  dashboard: { padding: 20 },
  pageContainer: { flex: 1, padding: 20 },
  pageTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 15, marginBottom: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333', marginTop: 0 },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 10, textAlign: 'center' },
  cardContent: { fontSize: 16, color: '#555' },
  cardDetail: { fontSize: 14, color: '#777', marginTop: 5 },
  pawsContainer: { display: 'flex', justifyContent: 'center' },
  paw: { fontSize: 24, marginRight: 5 },
  primaryButton: { display: 'flex', flexDirection: 'row', backgroundColor: '#ff6347', padding: '15px 20px', borderRadius: 30, alignItems: 'center', justifyContent: 'center', color: 'white', border: 'none', cursor: 'pointer', width: '100%' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  secondaryButton: { marginTop: 15, padding: 10, borderRadius: 20, borderWidth: 1, borderColor: '#ff6347', backgroundColor: 'white', cursor: 'pointer', width: '100%' },
  secondaryButtonText: { color: '#ff6347', textAlign: 'center', fontWeight: 'bold' },
  linkButton: { background: 'none', border: 'none', padding: 0, textAlign: 'left' },
  readMore: { color: '#ff6347', fontWeight: 'bold', marginTop: 10, cursor: 'pointer' },
  logItem: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, borderLeft: '5px solid #ff6347' },
  logItemType: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  logItemDetails: { fontSize: 14, color: '#666', margin: '4px 0' },
  logItemDate: { fontSize: 12, color: '#aaa', textAlign: 'right' },
  petListItem: { display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10 },
  petListImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15, objectFit: 'cover' },
  petListName: { fontSize: 18, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
  navBar: { display: 'flex', justifyContent: 'space-around', padding: '10px 0', borderTop: '1px solid #e0e0e0', backgroundColor: 'white' },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' },
  navText: { fontSize: 10, color: '#888' },
  navTextSelected: { color: '#ff6347' },
  modalContainer: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 },
  modalContent: { width: '90%', maxWidth: 400, backgroundColor: 'white', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { width: 'calc(100% - 22px)', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 15, marginTop: 5 },
  modalButtons: { display: 'flex', justifyContent: 'space-around', marginTop: 20 },
  cancelButton: { padding: '10px 20px', borderRadius: 20, border: '1px solid #ff6347', color: '#ff6347', backgroundColor: 'white', cursor: 'pointer' },
  saveButton: { padding: '10px 20px', borderRadius: 20, border: 'none', color: 'white', backgroundColor: '#007bff', cursor: 'pointer' },
  pickerContainer: { display: 'flex', justifyContent: 'space-around', marginBottom: 15 },
  pickerOption: { padding: '10px 15px', borderRadius: 20, borderWidth: 1, borderColor: '#ccc', background: 'none', cursor: 'pointer' },
  pickerOptionSelected: { backgroundColor: '#ffe4e1', borderColor: '#ff6347' },
  pickerText: { color: '#555' },
  pickerTextSelected: { color: '#ff6347', fontWeight: 'bold' },
};

