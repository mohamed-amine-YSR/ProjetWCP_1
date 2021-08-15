const PROTOCOLE = 'http://';
const BASE = 'localhost';
const PORT = '8081';
const PATH_PROJET = '/projet';
const PATH_LOGIN = '/login';
const PATH_VALIDATE_TOKEN = '/validateToken';
const PATH_USER = '/user';
const PATH_CENTRE = '/centre';

export const WS_URL = 'ws://' + BASE + ':' + PORT + '/ws/prob';

export const PROJETS_URLS = {
  COUNT_PUBLIC_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/countPublic',
  COUNT_ALL_PROBS_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/countProbs',

  ADD_SKILLS_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/addSkills',
  ALL_SKILLS_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/allSkills',
  GET_SKILLS_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/getSkills',

  MY_PRJ_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/myPrj',

  PROJETS_PUBLIC_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/byVisibilityPublic',
  PROJET_ID_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/byId',
  PROJET_GET_ACCESS_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/getAccess',
  PROJET_INFOS_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/InfosProjet',
  PROJET_ACCESS_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/getAccesPrj',
  DEMANDE_ACCES_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/demanderAccesPrj',
  DECIDER_ACCES_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/deciderDemandeAcces',

  GET_DEROULEMENT_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/getPrjDeroulement',
  GET_PHASES_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/getPhases',
  ALL_PHASES_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/allPhases',
  GET_TACHES_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/getTaches',
  ADD_PHASE_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/addPhase',
  SAVE_PHASE_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/savePhase',
  SAVE_TACHE_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/saveTache',

  ALL_PROBS_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/allProbs',
  PROB_ID_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/getProb',
  ADD_PROBLEM_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/addProbleme',
  UPDATE_PROBLEM_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/updateProbleme',
  ADD_COMMENT_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/addComment',
  LIST_COMMENTS_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/getComments',
  ONE_COMMENT_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/getComment',
  ADD_REACT_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/addReaction',
  ALL_REACTS_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/getReactions',
  DEMANDE_ADHESION_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/demandeAdhesion',
  ALL_DEMANDES_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/getDemandesAdhesion',

  RECOMMENDED_PROJETS_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/recommandedProjets',
  RECOMMENDED_USERS_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/recommandedUsers',

  SOUMETTRE_Projet_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/soumettrePrj',
  Decider_Projet_URL: PROTOCOLE + BASE + ':' + PORT + PATH_PROJET + '/decisionProjet',
};

export const ACCOUNT_URLS = {
  LOGIN_URL: PROTOCOLE + BASE + ':' + PORT + PATH_LOGIN,
  VALIDATE_TOKEN_URL: PROTOCOLE + BASE + ':' + PORT + PATH_VALIDATE_TOKEN,

  USER_EMAIL_URL: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/byEmail',
  USER_ID_URL: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/byId',

  USER_LIKE_URL: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/like',
  USER_LIKE_CENTRE_URL: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/inCentre',
  USERS_IN_CENTRE_URL: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/allInCentre',
  COUNT_USERS_CENTRE_URL: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/countUsersInCentre',
  ALL_USER_URL: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/all',
  FILTER_USERS_IN_CENTRE_URL: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/filterMembres',

  ADD_USERS_CENTRE_URL: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/addMembresCentre',
  ADD_USER_INSC: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/addUserInsc',
  USERS_BY_DEMANDE: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/bydemande',
  COUNT_USERS_BY_DEMANDE: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/countUsersByDemande',

  USER_SET_ETAT_URL: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/setEtat',
  USER_SET_ETAT_DEMANDE_URL: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/setEtatDemande',
  USER_REINIT_PASSWORD_URL: PROTOCOLE + BASE + ':' + PORT + PATH_USER + '/reinitPassword',
};

export const CENTRES_URLS = {
  GET_CENTRE_ID_URL: PROTOCOLE + BASE + ':' + PORT + PATH_CENTRE + '/byId',
  ADD_CENTRE_URL: PROTOCOLE + BASE + ':' + PORT + PATH_CENTRE + '/addCentre',
  UPDATE_CENTRE_URL: PROTOCOLE + BASE + ':' + PORT + PATH_CENTRE + '/updateCentre',
  COUNT_CENTRES_URL: PROTOCOLE + BASE + ':' + PORT + PATH_CENTRE + '/countCentres',
  GET_CENTRES_URL: PROTOCOLE + BASE + ':' + PORT + PATH_CENTRE + '/getCentresByPage'
};
