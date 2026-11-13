import React from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

// ---------- Types ----------
type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};
type Statut = 'Complet' | 'Presque complet' | 'Ouvert';
type Mode = 'tous' | 'ateliers';

// ---------- Données ----------
const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

// Changer ici : 'tous' ou 'ateliers'
const mode = 'tous' as Mode;

// ---------- Fonctions ----------
const placesRestantes = (e: Evenement): number => Math.max(0, e.capacite - e.inscrits);

const statutEvenement = (e: Evenement): Statut => {
  const r = placesRestantes(e);
  if (r === 0) return 'Complet';
  if (r <= 3) return 'Presque complet';
  return 'Ouvert';
};

// ---------- Indicateurs ----------
const total = evenements.length;
const nbComplets = evenements.filter((e) => placesRestantes(e) === 0).length;
const nbAvecPlaces = evenements.filter((e) => placesRestantes(e) > 0).length;
const totalPlaces = evenements.reduce((somme, e) => somme + placesRestantes(e), 0);

const ateliersDisponibles = evenements.filter(
  (e) => e.categorie === 'Atelier' && placesRestantes(e) > 0
);
const nbAteliers = ateliersDisponibles.length;

const donneesAffichees = mode === 'ateliers' ? ateliersDisponibles : evenements;

// ---------- Composants ----------
const COULEURS: Record<Statut, { fond: string; texte: string }> = {
  Complet: { fond: '#FEE2E2', texte: '#B91C1C' },
  'Presque complet': { fond: '#FFEDD5', texte: '#C2410C' },
  Ouvert: { fond: '#DCFCE7', texte: '#15803D' },
};

type BadgeProps = { statut: Statut };
function BadgeEtat({ statut }: BadgeProps) {
  const c = COULEURS[statut];
  return (
    <View style={[styles.badge, { backgroundColor: c.fond }]}>
      <Text style={[styles.badgeTexte, { color: c.texte }]}>{statut}</Text>
    </View>
  );
}

type CarteProps = { evenement: Evenement };
function CarteEvenement({ evenement }: CarteProps) {
  const r = placesRestantes(evenement);
  return (
    <View style={styles.carte}>
      <View style={styles.carteInfos}>
        <Text style={styles.carteTitre}>{evenement.titre}</Text>
        <Text style={styles.carteCategorie}>{evenement.categorie}</Text>
        <Text style={styles.cartePlaces}>
          {r} {r > 1 ? 'places restantes' : 'place restante'}
        </Text>
      </View>
      <BadgeEtat statut={statutEvenement(evenement)} />
    </View>
  );
}

type BlocProps = { libelle: string; valeur: number };
function BlocStatistique({ libelle, valeur }: BlocProps) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.blocValeur}>{valeur}</Text>
      <Text style={styles.blocLibelle}>{libelle}</Text>
    </View>
  );
}

// ---------- Écran ----------
export default function App() {
  return (
    <SafeAreaView style={styles.ecran}>
      <StatusBar barStyle="light-content" />

      <View style={styles.entete}>
        <Text style={styles.enteteTitre}>CampusAgenda</Text>
        <Text style={styles.enteteSousTitre}>Événements du campus</Text>
      </View>

      <View style={styles.statistiques}>
        <BlocStatistique libelle="Événements" valeur={total} />
        <BlocStatistique libelle="Complets" valeur={nbComplets} />
        <BlocStatistique libelle="Avec places" valeur={nbAvecPlaces} />
        <BlocStatistique libelle="Places restantes" valeur={totalPlaces} />
      </View>

      <Text style={styles.titreListe}>
        {mode === 'tous'
          ? `Tous les événements (${donneesAffichees.length})`
          : `Ateliers disponibles (${nbAteliers})`}
      </Text>

      <FlatList
        data={donneesAffichees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        contentContainerStyle={styles.liste}
        ListEmptyComponent={
          <Text style={styles.vide}>Aucun événement à afficher pour le moment.</Text>
        }
      />
    </SafeAreaView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: '#F1F5F9' },
  entete: {
    backgroundColor: '#1E3A8A',
    paddingTop: 36,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  enteteTitre: { color: '#FFFFFF', fontSize: 26, fontWeight: 'bold' },
  enteteSousTitre: { color: '#BFDBFE', fontSize: 14, marginTop: 2 },

  statistiques: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 14,
  },
  bloc: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  blocValeur: { fontSize: 22, fontWeight: 'bold', color: '#1E3A8A' },
  blocLibelle: { fontSize: 12, color: '#64748B' },

  titreListe: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  liste: { paddingHorizontal: 16, paddingBottom: 24 },

  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  carteInfos: { flex: 1, marginRight: 10 },
  carteTitre: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  carteCategorie: { fontSize: 13, color: '#64748B', marginTop: 2 },
  cartePlaces: { fontSize: 13, color: '#1E3A8A', marginTop: 4 },

  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  badgeTexte: { fontSize: 12, fontWeight: 'bold' },

  vide: { textAlign: 'center', color: '#64748B', marginTop: 30, fontSize: 15 },
});